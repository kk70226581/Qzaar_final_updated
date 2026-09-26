const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication Middleware
 * Validates JWT Bearer token and attaches decoded user to req.user
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Session expired. Please sign in again.'
        : 'Invalid token. Authorization failed.';
      return res.status(403).json({ success: false, message });
    }

    req.user = decodedUser;
    next();
  });
}

/**
 * Optional Authentication Middleware
 * If a token is provided, decodes and attaches user; otherwise proceeds as guest
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (!err) {
      req.user = decodedUser;
    }
    next();
  });
}

/**
 * Shop Ownership Verification Middleware
 * Ensures the authenticated user owns the target shop or is an admin
 */
function verifyShopOwner(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const targetShopId = req.params.shopId || req.body.shopId || req.query.shopId;
  const userShopId = req.user.shopId || req.user.userId || req.user.id;

  // Allow admin or matching shopkeeper
  if (req.user.role === 'admin' || !targetShopId || String(userShopId) === String(targetShopId)) {
    req.shopId = targetShopId || userShopId;
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden. You do not have permission to access or modify this shop.'
  });
}

module.exports = {
  authenticateToken,
  optionalAuth,
  verifyShopOwner,
  JWT_SECRET
};
