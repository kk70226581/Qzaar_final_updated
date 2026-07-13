const express = require('express');
const { Shopkeeper } = require('./models');

const router = express.Router();

// ========================================
// SETTINGS ENDPOINTS (15 endpoints)
// ========================================

// ✅ 1. Get All Settings
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await Shopkeeper.findById(req.params.shopId)
      .select('-passwordHash -resetToken -resetTokenExpiry')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({ success: true, settings: shop });
  } catch (error) {
    console.error('Get settings error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Update All Settings
router.post('/:shopId', async (req, res) => {
  try {
    const { shopName, ownerName, tagline, cuisineType, contactPhone, openHours, address, logo, brandColor } = req.body;

    const shop = await Shopkeeper.findByIdAndUpdate(
      req.params.shopId,
      {
        shopName: shopName || undefined,
        ownerName: ownerName || undefined,
        tagline: tagline || undefined,
        cuisineType: cuisineType || undefined,
        contactPhone: contactPhone || undefined,
        openHours: openHours || undefined,
        address: address || undefined,
        logo: logo || undefined,
        brandColor: brandColor || undefined
      },
      { new: true }
    ).select('-passwordHash -resetToken -resetTokenExpiry');

    return res.json({ success: true, settings: shop });
  } catch (error) {
    console.error('Update settings error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Profile Settings
router.get('/:shopId/profile', async (req, res) => {
  try {
    const shop = await Shopkeeper.findById(req.params.shopId)
      .select('shopName ownerName email contactPhone logo address brandColor')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({ success: true, profile: shop });
  } catch (error) {
    console.error('Get profile error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Update Profile Settings
router.put('/:shopId/profile', async (req, res) => {
  try {
    const { shopName, ownerName, contactPhone, logo, address } = req.body;

    const shop = await Shopkeeper.findByIdAndUpdate(
      req.params.shopId,
      {
        shopName: shopName || undefined,
        ownerName: ownerName || undefined,
        contactPhone: contactPhone || undefined,
        logo: logo || undefined,
        address: address || undefined
      },
      { new: true }
    ).select('shopName ownerName contactPhone logo address');

    return res.json({ success: true, profile: shop });
  } catch (error) {
    console.error('Update profile error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Get Operating Hours
router.get('/:shopId/hours', async (req, res) => {
  try {
    const shop = await Shopkeeper.findById(req.params.shopId)
      .select('openHours')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    // Parse or return as-is
    const hours = {
      Monday: shop.openHours || '10:00 AM - 10:00 PM',
      Tuesday: shop.openHours || '10:00 AM - 10:00 PM',
      Wednesday: shop.openHours || '10:00 AM - 10:00 PM',
      Thursday: shop.openHours || '10:00 AM - 10:00 PM',
      Friday: shop.openHours || '10:00 AM - 10:00 PM',
      Saturday: shop.openHours || '10:00 AM - 11:00 PM',
      Sunday: shop.openHours || '10:00 AM - 11:00 PM'
    };

    return res.json({ success: true, hours });
  } catch (error) {
    console.error('Get hours error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Update Operating Hours
router.put('/:shopId/hours', async (req, res) => {
  try {
    const { hours } = req.body;

    if (!hours || typeof hours !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid hours format' });
    }

    const shop = await Shopkeeper.findByIdAndUpdate(
      req.params.shopId,
      { openHours: JSON.stringify(hours) },
      { new: true }
    ).select('openHours');

    return res.json({ success: true, hours });
  } catch (error) {
    console.error('Update hours error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Get Payment Settings
router.get('/:shopId/payment', async (req, res) => {
  try {
    const shop = await Shopkeeper.findById(req.params.shopId)
      .select('razorpayContactId')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({
      success: true,
      payment: {
        razorpayConnected: !!shop.razorpayContactId,
        methods: ['cash', 'card', 'upi', 'wallet']
      }
    });
  } catch (error) {
    console.error('Get payment settings error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Update Payment Settings
router.put('/:shopId/payment', async (req, res) => {
  try {
    const { methods } = req.body;

    // TODO: Connect Razorpay if not already done
    return res.json({
      success: true,
      payment: {
        razorpayConnected: true,
        methods: methods || ['cash', 'card', 'upi']
      }
    });
  } catch (error) {
    console.error('Update payment error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Get Notification Settings
router.get('/:shopId/notifications', async (req, res) => {
  try {
    // TODO: Store notification preferences in database
    const notifications = {
      newOrders: true,
      lowInventory: true,
      customerReviews: true,
      analyticsEmail: true
    };

    return res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get notifications error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Update Notification Settings
router.put('/:shopId/notifications', async (req, res) => {
  try {
    const { newOrders, lowInventory, customerReviews, analyticsEmail } = req.body;

    // TODO: Save notification preferences to database
    return res.json({
      success: true,
      notifications: {
        newOrders: newOrders !== undefined ? newOrders : true,
        lowInventory: lowInventory !== undefined ? lowInventory : true,
        customerReviews: customerReviews !== undefined ? customerReviews : true,
        analyticsEmail: analyticsEmail !== undefined ? analyticsEmail : true
      }
    });
  } catch (error) {
    console.error('Update notifications error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Get Delivery Settings
router.get('/:shopId/delivery', async (req, res) => {
  try {
    const delivery = {
      deliveryEnabled: true,
      maxDeliveryRadius: 5,
      deliveryCharge: 75,
      freeDeliveryAbove: 500,
      estimatedTime: '30-45 mins'
    };

    return res.json({ success: true, delivery });
  } catch (error) {
    console.error('Get delivery settings error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Update Delivery Settings
router.put('/:shopId/delivery', async (req, res) => {
  try {
    const { deliveryEnabled, maxDeliveryRadius, deliveryCharge, freeDeliveryAbove } = req.body;

    // TODO: Save to database
    return res.json({
      success: true,
      delivery: {
        deliveryEnabled: deliveryEnabled !== undefined ? deliveryEnabled : true,
        maxDeliveryRadius: maxDeliveryRadius || 5,
        deliveryCharge: deliveryCharge || 75,
        freeDeliveryAbove: freeDeliveryAbove || 500
      }
    });
  } catch (error) {
    console.error('Update delivery error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Get Generic Section Settings
router.get('/:shopId/:section', async (req, res) => {
  try {
    // Generic endpoint for any settings section
    return res.json({
      success: true,
      section: req.params.section,
      data: {}
    });
  } catch (error) {
    console.error('Get section settings error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Update Generic Section Settings
router.put('/:shopId/:section', async (req, res) => {
  try {
    const { data } = req.body;

    // TODO: Generic setting update for any section
    return res.json({
      success: true,
      section: req.params.section,
      data: data || {}
    });
  } catch (error) {
    console.error('Update section error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Get Settings Dashboard
router.get('/:shopId/dashboard', async (req, res) => {
  try {
    const shop = await Shopkeeper.findById(req.params.shopId)
      .select('shopName email contactPhone openHours address')
      .lean();

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({
      success: true,
      dashboard: {
        profile: {
          shopName: shop.shopName,
          email: shop.email,
          phone: shop.contactPhone,
          address: shop.address
        },
        operatingHours: shop.openHours,
        paymentMethods: ['cash', 'card', 'upi'],
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
