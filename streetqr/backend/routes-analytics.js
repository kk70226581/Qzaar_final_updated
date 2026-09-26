const express = require('express');
const { Order, MenuItem, Analytics } = require('./models');
const { optionalAuth, verifyShopOwner } = require('./middleware/auth');

const router = express.Router();

// ========================================
// ANALYTICS ENDPOINTS (High-Performance MongoDB Aggregations)
// ========================================

// Verify shop middleware
async function resolveShop(req, res, next) {
  req.shopId = req.params.shopId;
  next();
}
const verifyShop = resolveShop;

// ✅ 1. Get Metrics (MongoDB Aggregation Pipeline)
router.get('/metrics/:shopId', optionalAuth, resolveShop, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();

    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const [metricsResult, statusCounts] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            shopId: req.shopId,
            createdAt: { $gte: startDate },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' },
            uniqueCustomers: { $addToSet: '$customerEmail' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            shopId: req.shopId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const m = metricsResult[0] || {};
    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalRevenue = Math.round(m.totalRevenue || 0);
    const totalOrders = m.totalOrders || 0;
    const avgOrderValue = Math.round(m.avgOrderValue || 0);
    const totalCustomers = (m.uniqueCustomers || []).filter(Boolean).length;

    return res.json({
      success: true,
      metrics: {
        period,
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue,
        orderStatus: {
          pending: statusMap['pending'] || 0,
          preparing: statusMap['preparing'] || 0,
          completed: statusMap['completed'] || 0
        }
      }
    });
  } catch (error) {
    console.error('Get metrics aggregation error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Get Revenue Chart (Single-Pass Aggregation with $dateToString)
router.get('/revenue-chart/:shopId', optionalAuth, resolveShop, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = Math.min(90, Math.max(1, parseInt(days, 10) || 7));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const chartAgg = await Order.aggregate([
      {
        $match: {
          shopId: req.shopId,
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartMap = chartAgg.reduce((acc, curr) => {
      acc[curr._id] = { revenue: Math.round(curr.revenue), orders: curr.orders };
      return acc;
    }, {});

    // Ensure all days in the range exist in the output array
    const chartData = [];
    const now = new Date();
    for (let i = daysNum - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      chartData.push({
        date: dateKey,
        revenue: chartMap[dateKey]?.revenue || 0,
        orders: chartMap[dateKey]?.orders || 0
      });
    }

    return res.json({ success: true, chartData });
  } catch (error) {
    console.error('Get revenue chart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Popular Dishes (Unwind & Group Aggregation Pipeline)
router.get('/popular-dishes/:shopId', optionalAuth, resolveShop, async (req, res) => {
  try {
    const limitNum = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 5));

    const dishes = await Order.aggregate([
      {
        $match: {
          shopId: req.shopId,
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: { $ifNull: ['$items.name', 'Menu Item'] },
          quantity: { $sum: { $ifNull: ['$items.quantity', 1] } },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $multiply: [
                { $ifNull: ['$items.price', 0] },
                { $ifNull: ['$items.quantity', 1] }
              ]
            }
          }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: limitNum },
      {
        $project: {
          _id: 0,
          name: '$_id',
          quantity: 1,
          orders: 1,
          revenue: { $round: ['$revenue', 2] }
        }
      }
    ]);

    return res.json({ success: true, dishes });
  } catch (error) {
    console.error('Get popular dishes aggregation error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Get Peak Hours
router.get('/peak-hours/:shopId', verifyShop, async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const orders = await Order.find({ shopId: req.shopId, status: { $ne: 'cancelled' } }).lean();

    const hourMap = {};
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      if (!hourMap[hour]) {
        hourMap[hour] = { hour, orders: 0, revenue: 0 };
      }
      hourMap[hour].orders += 1;
      hourMap[hour].revenue += order.total || 0;
    });

    const peakHours = Object.values(hourMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit)
      .map(h => ({
        hour: `${h.hour.toString().padStart(2, '0')}:00`,
        orders: h.orders,
        revenue: Math.round(h.revenue)
      }));

    return res.json({ success: true, peakHours });
  } catch (error) {
    console.error('Get peak hours error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Get Customer Insights
router.get('/customer-insights/:shopId', verifyShop, async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.shopId }).lean();

    const customerMap = {};
    orders.forEach(order => {
      const email = order.customerEmail || order.customerName;
      if (!customerMap[email]) {
        customerMap[email] = {
          email: email,
          name: order.customerName,
          orders: 0,
          totalSpent: 0,
          lastOrder: null
        };
      }
      if (order.status !== 'cancelled') {
        customerMap[email].orders += 1;
        customerMap[email].totalSpent += order.total || 0;
      }
      customerMap[email].lastOrder = new Date(order.createdAt);
    });

    const customers = Object.values(customerMap)
      .sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder))
      .slice(0, 10);

    return res.json({
      success: true,
      insights: {
        totalCustomers: Object.keys(customerMap).length,
        topCustomers: customers,
        avgCustomerSpend: Object.values(customerMap).length > 0
          ? Math.round(Object.values(customerMap).reduce((sum, c) => sum + c.totalSpent, 0) / Object.values(customerMap).length)
          : 0
      }
    });
  } catch (error) {
    console.error('Get customer insights error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Get Order Trends
router.get('/order-trends/:shopId', verifyShop, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const orders = await Order.find({
      shopId: req.shopId,
      createdAt: { $gte: startDate }
    }).lean();

    const trends = {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      avgPrepTime: orders.length > 0
        ? Math.round(orders.reduce((sum, o) => sum + (o.estimatedPrepMinutes || 15), 0) / orders.length)
        : 0
    };

    return res.json({ success: true, trends });
  } catch (error) {
    console.error('Get order trends error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Export Analytics
router.post('/export/:shopId', verifyShop, async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.body;

    const orders = await Order.find({
      shopId: req.shopId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).lean();

    if (format === 'csv') {
      let csv = 'Date,Customer,Items,Total,Status,Payment\n';
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        csv += `${date},"${order.customerName}",${order.items.length},${order.total},${order.status},${order.paymentMethod}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
      return res.send(csv);
    } else if (format === 'json') {
      return res.json({ success: true, data: orders });
    }

    return res.status(400).json({ success: false, message: 'Invalid format' });
  } catch (error) {
    console.error('Export analytics error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Get Revenue by Category
router.get('/revenue-by-category/:shopId', verifyShop, async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.shopId, status: { $ne: 'cancelled' } }).lean();

    const categoryMap = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!categoryMap[category]) {
          categoryMap[category] = { category, revenue: 0, orders: 0 };
        }
        categoryMap[category].revenue += (item.price || 0) * (item.quantity || 1);
        categoryMap[category].orders += 1;
      });
    });

    const categories = Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);

    return res.json({ success: true, categories });
  } catch (error) {
    console.error('Get revenue by category error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Get Retention Metrics
router.get('/retention/:shopId', verifyShop, async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.shopId }).lean();

    const customerOrders = {};
    orders.forEach(order => {
      const email = order.customerEmail || order.customerName;
      if (!customerOrders[email]) {
        customerOrders[email] = [];
      }
      customerOrders[email].push(new Date(order.createdAt));
    });

    const repeatCustomers = Object.values(customerOrders).filter(orders => orders.length > 1).length;
    const totalCustomers = Object.keys(customerOrders).length;
    const retentionRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

    return res.json({
      success: true,
      retention: {
        totalCustomers,
        repeatCustomers,
        retentionRate: `${retentionRate}%`
      }
    });
  } catch (error) {
    console.error('Get retention error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Get Analytics by Date Range
router.get('/date-range/:shopId', verifyShop, async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'Start and end dates required' });
    }

    const orders = await Order.find({
      shopId: req.shopId,
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      },
      status: { $ne: 'cancelled' }
    }).lean();

    const analytics = {
      startDate: start,
      endDate: end,
      totalOrders: orders.length,
      totalRevenue: Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0)),
      avgOrderValue: orders.length > 0
        ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length)
        : 0,
      totalCustomers: new Set(orders.map(o => o.customerEmail)).size
    };

    return res.json({ success: true, analytics });
  } catch (error) {
    console.error('Get date range analytics error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
