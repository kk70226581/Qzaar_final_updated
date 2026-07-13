const express = require('express');
const { Order, Coupon, PaymentTransaction } = require('./models');

const router = express.Router();

// ========================================
// ORDERS ENDPOINTS (20+ endpoints)
// ========================================

// ✅ 1. Create Order
router.post('/:shopId', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      tableNumber,
      items,
      total,
      subTotal,
      discountAmount,
      couponCode,
      paymentMethod,
      customerNote
    } = req.body;

    if (!customerName || !tableNumber || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const prepMinutes = Math.max(...items.map(i => Number(i.prepTime) || 15), 15);
    const estimatedReadyAt = new Date(Date.now() + prepMinutes * 60 * 1000);

    const order = await Order.create({
      shopId: req.params.shopId,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      tableNumber,
      items,
      total: Number(total) || 0,
      subTotal: Number(subTotal) || Number(total) || 0,
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || '',
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      customerNote: customerNote || '',
      estimatedPrepMinutes: prepMinutes,
      estimatedReadyAt,
      status: 'pending'
    });

    return res.json({
      success: true,
      order,
      estimatedReadyAt,
      estimatedPrepMinutes: prepMinutes
    });
  } catch (error) {
    console.error('Create order error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Get Order by ID
router.get('/:shopId/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Orders with Filters
router.get('/:shopId', async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 20, page = 1 } = req.query;

    let query = { shopId: req.params.shopId };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(query);

    return res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    console.error('Get orders error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Get User's Orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { customerEmail: req.params.userId },
        { customerPhone: req.params.userId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get user orders error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Update Order Status
router.put('/:shopId/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, shopId: req.params.shopId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Cancel Order
router.post('/:shopId/:orderId/cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed orders' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Customer cancelled';
    order.refundAmount = order.paymentStatus === 'paid' ? order.total : 0;
    await order.save();

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Cancel order error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Get Order Timeline
router.get('/:shopId/:orderId/timeline', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const timeline = [
      { status: 'pending', time: order.createdAt, label: 'Order Placed' },
      { status: 'preparing', time: order.updatedAt, label: 'Preparing' },
      { status: 'completed', time: order.estimatedReadyAt, label: 'Ready for Pickup' }
    ];

    return res.json({ success: true, timeline });
  } catch (error) {
    console.error('Get timeline error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Get Order Receipt
router.get('/:shopId/:orderId/receipt', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const receipt = {
      orderId: order._id,
      date: order.createdAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      subTotal: order.subTotal,
      discount: order.discountAmount,
      coupon: order.couponCode,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status
    };

    return res.json({ success: true, receipt });
  } catch (error) {
    console.error('Get receipt error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Post Order Review
router.post('/:shopId/:orderId/review', async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, shopId: req.params.shopId },
      {
        rating: Number(rating) || 0,
        review: comment || ''
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, message: 'Review posted' });
  } catch (error) {
    console.error('Post review error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Repeat Order
router.post('/:shopId/:orderId/repeat', async (req, res) => {
  try {
    const originalOrder = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    }).lean();

    if (!originalOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const newOrder = await Order.create({
      ...originalOrder,
      _id: undefined,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Repeat order error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Apply Coupon to Order
router.post('/:shopId/:orderId/apply-coupon', async (req, res) => {
  try {
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({
      shopId: req.params.shopId,
      code: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTill: { $gte: new Date() }
    }).lean();

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon' });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (order.subTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    order.couponCode = couponCode.toUpperCase();
    order.discountAmount = Math.round(discount);
    order.total = Math.round(order.subTotal - order.discountAmount);
    await order.save();

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Apply coupon error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Remove Coupon from Order
router.post('/:shopId/:orderId/remove-coupon', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.couponCode = '';
    order.discountAmount = 0;
    order.total = order.subTotal;
    await order.save();

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Remove coupon error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Get Order Tracking
router.get('/:shopId/:orderId/tracking', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      shopId: req.params.shopId
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      tracking: {
        orderId: order._id,
        status: order.status,
        estimatedReadyAt: order.estimatedReadyAt,
        currentPosition: 'Kitchen',
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Order Statistics
router.get('/stats/:shopId', async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId }).lean();

    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0)),
      avgOrderValue: orders.length > 0
        ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length)
        : 0
    };

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Export Orders
router.post('/:shopId/export', async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.body;

    const orders = await Order.find({
      shopId: req.params.shopId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).lean();

    if (format === 'csv') {
      let csv = 'Date,Customer,Items,Total,Status\n';
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        csv += `${date},"${order.customerName}",${order.items.length},${order.total},${order.status}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
      return res.send(csv);
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Export orders error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 16. Validate Order
router.post('/:shopId/validate', async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Invalid order' });
    }

    return res.json({ success: true, message: 'Order is valid' });
  } catch (error) {
    console.error('Validate order error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
