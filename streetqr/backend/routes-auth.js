const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const sendEmail = require('./sendmail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

// ========================================
// AUTHENTICATION ENDPOINTS (15 endpoints)
// ========================================

// ✅ 1. Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check existing user
    const existing = await User.findOne({ email }).select('_id').lean();
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || ''
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('_id email passwordHash firstName lastName');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Logout (client-side only, but endpoint for consistency)
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

// ✅ 4. Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -resetToken -resetTokenExpiry').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-passwordHash -resetToken -resetTokenExpiry');

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords required' });
    }

    const user = await User.findById(req.user.userId).select('passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('_id');
    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'If email exists, reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    await User.updateOne(
      { _id: user._id },
      { resetToken, resetTokenExpiry }
    );

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your StreetQR account.</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reset Your Password
          </a>
        </p>
        <p style="font-size: 14px; color: #666;">If the button doesn't work, paste this link:</p>
        <p style="font-size: 13px; color: #333; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
        <p style="font-size: 12px; color: #999;">This link expires in 1 hour.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">StreetQR Support Team</p>
      </div>
    `;

    await sendEmail(email, 'StreetQR Password Reset', html);

    return res.json({
      success: true,
      message: 'If email exists, reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now login.'
    });
  } catch (error) {
    console.error('Reset password error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Refresh Token
router.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('_id email').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Refresh token error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Verify Token
router.get('/verify', authenticateToken, (req, res) => {
  return res.json({ success: true, message: 'Token is valid' });
});

// ✅ 11. Setup 2FA (placeholder)
router.post('/2fa/setup', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement 2FA setup with authenticator app
    return res.json({ success: true, message: '2FA setup initiated' });
  } catch (error) {
    console.error('2FA setup error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Confirm 2FA (placeholder)
router.post('/2fa/confirm', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    // TODO: Verify 2FA code
    return res.json({ success: true, message: '2FA confirmed' });
  } catch (error) {
    console.error('2FA confirm error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Verify 2FA (placeholder)
router.post('/2fa/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    // TODO: Verify 2FA code during login
    return res.json({ success: true, message: '2FA verified' });
  } catch (error) {
    console.error('2FA verify error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Permissions (RBAC)
router.get('/permissions', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement role-based permissions
    const permissions = {
      canViewAnalytics: true,
      canManageMenu: true,
      canManageOrders: true,
      canManageSettings: true,
      canManageInventory: true,
      canViewReports: true
    };
    return res.json({ success: true, permissions });
  } catch (error) {
    console.error('Get permissions error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Check Permission
router.post('/check-permission', authenticateToken, async (req, res) => {
  try {
    const { permission } = req.body;
    // TODO: Implement role-based permission checking
    return res.json({ success: true, hasPermission: true });
  } catch (error) {
    console.error('Check permission error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========================================
// MIDDLEWARE
// ========================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
