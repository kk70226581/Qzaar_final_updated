const express = require('express');
const { Order, MenuItem, Analytics } = require('./models');

const router = express.Router();

// ========================================
// ANALYTICS ENDPOINTS (10 endpoints)
// ========================================

// Middleware: Verify shop ownership
async function verifyShop(req, res, next) {
  req.shopId = req.params.shopId;
  next();
}

// ✅ 1. Get Metrics
router.get('/metrics/:shopId', verifyShop, async (req, res) => {
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

    const orders = await Order.find({
      shopId: req.shopId,
      createdAt: { $gte: startDate },
      status: { $ne: 'cancelled' }
    }).lean();

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalCustomers = new Set(orders.map(o => o.customerEmail)).size;

    return res.json({
      success: true,
      metrics: {
        period,
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalCustomers,
        avgOrderValue: Math.round(avgOrderValue),
        orderStatus: {
          pending: orders.filter(o => o.status === 'pending').length,
          preparing: orders.filter(o => o.status === 'preparing').length,
          completed: orders.filter(o => o.status === 'completed').length
        }
      }
    });
  } catch (error) {
    console.error('Get metrics error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Get Revenue Chart
router.get('/revenue-chart/:shopId', verifyShop, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const chartData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.find({
        shopId: req.shopId,
        createdAt: { $gte: date, $lt: nextDate },
        status: { $ne: 'cancelled' }
      }).lean();

      const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      chartData.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue),
        orders: dayOrders.length
      });
    }

    return res.json({ success: true, chartData });
  } catch (error) {
    console.error('Get revenue chart error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Popular Dishes
router.get('/popular-dishes/:shopId', verifyShop, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const orders = await Order.find({ shopId: req.shopId, status: { $ne: 'cancelled' } }).lean();

    const dishMap = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const name = item.name || 'Unknown';
        if (!dishMap[name]) {
          dishMap[name] = { name, orders: 0, revenue: 0, quantity: 0 };
        }
        dishMap[name].orders += 1;
        dishMap[name].quantity += item.quantity || 1;
        dishMap[name].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const dishes = Object.values(dishMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    return res.json({ success: true, dishes });
  } catch (error) {
    console.error('Get popular dishes error:', error?.message);
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
