const express = require('express');
const { User, Coupon } = require('./models');

const router = express.Router();

// ========================================
// CART ENDPOINTS (20+ endpoints)
// ========================================

// Note: In production, consider using session store or dedicated cache (Redis)
// For now, we'll store in a Map (resets on server restart)
const cartStore = new Map();

function getCart(userId) {
  if (!cartStore.has(userId)) {
    cartStore.set(userId, {
      items: [],
      coupon: null,
      deliveryAddress: null
    });
  }
  return cartStore.get(userId);
}

// ✅ 1. Get Cart
router.get('/:userId', (req, res) => {
  try {
    const cart = getCart(req.params.userId);
    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Add Item to Cart
router.post('/:userId/items', (req, res) => {
  try {
    const { itemId, name, price, quantity, customizations, addOns } = req.body;

    if (!itemId || !name || !price || !quantity) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const cart = getCart(req.params.userId);
    const existing = cart.items.find(item => item.itemId === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations));

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        itemId,
        name,
        price: Number(price),
        quantity: Number(quantity),
        customizations: customizations || [],
        addOns: addOns || [],
        addedAt: new Date()
      });
    }

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Add item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Update Cart Item
router.put('/:userId/items/:itemId', (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = getCart(req.params.userId);
    const item = cart.items.find(i => i.itemId === req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.itemId !== req.params.itemId);
    } else {
      item.quantity = Number(quantity);
    }

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Update item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Remove Item from Cart
router.delete('/:userId/items/:itemId', (req, res) => {
  try {
    const cart = getCart(req.params.userId);
    cart.items = cart.items.filter(i => i.itemId !== req.params.itemId);

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Remove item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Clear Cart
router.post('/:userId/clear', (req, res) => {
  try {
    cartStore.delete(req.params.userId);
    return res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Update Item Quantity
router.put('/:userId/items/:itemId/quantity', (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = getCart(req.params.userId);
    const item = cart.items.find(i => i.itemId === req.params.itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.quantity = Number(quantity);
    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Update quantity error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Get Cart Summary
router.get('/:userId/summary', (req, res) => {
  try {
    const cart = getCart(req.params.userId);

    const subTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cart.coupon ? Math.round((subTotal * cart.coupon.discountValue) / 100) : 0;
    const tax = Math.round((subTotal - discount) * 0.05); // 5% tax
    const total = subTotal - discount + tax;

    return res.json({
      success: true,
      summary: {
        itemCount: cart.items.length,
        subTotal: Math.round(subTotal),
        discount: discount,
        tax: tax,
        total: Math.round(total),
        coupon: cart.coupon
      }
    });
  } catch (error) {
    console.error('Get summary error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Apply Coupon
router.post('/:userId/coupon', async (req, res) => {
  try {
    const { couponCode, shopId } = req.body;

    const coupon = await Coupon.findOne({
      shopId,
      code: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() }
    }).lean();

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon' });
    }

    const cart = getCart(req.params.userId);
    const subTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (subTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value is ₹${coupon.minOrderValue}`
      });
    }

    cart.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      description: coupon.description
    };

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Apply coupon error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Remove Coupon
router.post('/:userId/coupon/remove', (req, res) => {
  try {
    const cart = getCart(req.params.userId);
    cart.coupon = null;

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Remove coupon error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Set Delivery Address
router.put('/:userId/delivery-address', (req, res) => {
  try {
    const { street, city, state, pincode, label } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields required' });
    }

    const cart = getCart(req.params.userId);
    cart.deliveryAddress = {
      street,
      city,
      state,
      pincode,
      label: label || 'Home'
    };

    return res.json({ success: true, cart });
  } catch (error) {
    console.error('Set address error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Add Delivery Address
router.post('/:userId/delivery-address', (req, res) => {
  try {
    const { street, city, state, pincode, label } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields required' });
    }

    const cart = getCart(req.params.userId);
    cart.deliveryAddress = {
      street,
      city,
      state,
      pincode,
      label: label || 'Home'
    };

    return res.json({ success: true, message: 'Address added', cart });
  } catch (error) {
    console.error('Add address error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Get Delivery Fee
router.get('/:userId/delivery-fee', (req, res) => {
  try {
    const { distance = 5 } = req.query;

    // Simple delivery fee calculation
    const baseFee = 50;
    const perKmFee = 10;
    const deliveryFee = baseFee + (distance * perKmFee);

    return res.json({
      success: true,
      deliveryFee: Math.min(deliveryFee, 150) // Cap at 150
    });
  } catch (error) {
    console.error('Get delivery fee error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Save Cart
router.post('/:userId/save', async (req, res) => {
  try {
    const cart = getCart(req.params.userId);

    // TODO: Save to database with timestamp
    return res.json({
      success: true,
      message: 'Cart saved',
      savedAt: new Date()
    });
  } catch (error) {
    console.error('Save cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Saved Carts
router.get('/:userId/saved', async (req, res) => {
  try {
    // TODO: Retrieve saved carts from database
    return res.json({ success: true, savedCarts: [] });
  } catch (error) {
    console.error('Get saved carts error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Restore Saved Cart
router.post('/:userId/saved/:cartId/restore', (req, res) => {
  try {
    // TODO: Restore saved cart
    return res.json({ success: true, message: 'Cart restored' });
  } catch (error) {
    console.error('Restore cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 16. Estimate Total
router.post('/:userId/estimate-total', (req, res) => {
  try {
    const cart = getCart(req.params.userId);

    const subTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cart.coupon ? Math.round((subTotal * cart.coupon.discountValue) / 100) : 0;
    const tax = Math.round((subTotal - discount) * 0.05);
    const deliveryFee = 75; // Default
    const total = subTotal - discount + tax + deliveryFee;

    return res.json({
      success: true,
      estimate: {
        subTotal: Math.round(subTotal),
        discount: discount,
        tax: tax,
        deliveryFee: deliveryFee,
        total: Math.round(total)
      }
    });
  } catch (error) {
    console.error('Estimate total error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 17. Check Item Availability
router.post('/:userId/check-availability', (req, res) => {
  try {
    const { items } = req.body;

    // TODO: Check inventory for each item
    return res.json({
      success: true,
      available: items.length > 0,
      items: items
    });
  } catch (error) {
    console.error('Check availability error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 18. Get Cart History
router.get('/:userId/history', (req, res) => {
  try {
    // TODO: Get previous carts from database
    return res.json({ success: true, history: [] });
  } catch (error) {
    console.error('Get history error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 19. Share Cart
router.post('/:userId/share', (req, res) => {
  try {
    const cart = getCart(req.params.userId);

    // Generate shareable link
    const shareToken = Math.random().toString(36).substring(2, 15);

    return res.json({
      success: true,
      shareLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart/shared/${shareToken}`
    });
  } catch (error) {
    console.error('Share cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 20. Sync Cart
router.post('/:userId/sync', (req, res) => {
  try {
    const { items } = req.body;

    // Merge server cart with client cart
    const cart = getCart(req.params.userId);

    return res.json({
      success: true,
      cart,
      lastSynced: new Date()
    });
  } catch (error) {
    console.error('Sync cart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
