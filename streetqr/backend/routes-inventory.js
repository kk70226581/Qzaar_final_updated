const express = require('express');
const { Inventory } = require('./models');
const { authenticateToken, verifyShopOwner } = require('./middleware/auth');

const router = express.Router();

// ========================================
// INVENTORY ENDPOINTS (15 endpoints)
// ========================================

// ✅ 1. Get Inventory with Server-Side Sorting & Pagination
router.get('/:shopId', async (req, res) => {
  try {
    const { category, search, sortBy = 'name', page = 1, limit = 20 } = req.query;

    let query = { restaurantId: req.params.shopId };

    if (category) query.category = category;
    if (search) {
      query.itemName = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Database-level sorting before pagination (O(log N) indexed sort)
    let sortQuery = { itemName: 1 };
    if (sortBy === 'quantity-asc') sortQuery = { quantity: 1 };
    else if (sortBy === 'quantity-desc') sortQuery = { quantity: -1 };
    else if (sortBy === 'expiry') sortQuery = { expiryDate: 1 };
    else if (sortBy === 'updatedAt') sortQuery = { updatedAt: -1 };

    const [inventory, total] = await Promise.all([
      Inventory.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Inventory.countDocuments(query)
    ]);

    return res.json({
      success: true,
      inventory,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Create Inventory Item (Protected)
router.post('/:shopId', authenticateToken, verifyShopOwner, async (req, res) => {
  try {
    const { itemId, itemName, quantity, unit, costPerUnit } = req.body;

    if (!itemId || !itemName || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const item = await Inventory.create({
      restaurantId: req.params.shopId,
      itemId,
      itemName,
      quantity: Number(quantity),
      unit: unit || 'pieces',
      costPerUnit: costPerUnit || 0
    });

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Create inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Inventory Item
router.get('/:shopId/:itemId', async (req, res) => {
  try {
    const item = await Inventory.findOne({
      restaurantId: req.params.shopId,
      _id: req.params.itemId
    }).lean();

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Get item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Update Inventory Item (Protected)
router.put('/:shopId/:itemId', authenticateToken, verifyShopOwner, async (req, res) => {
  try {
    const { itemName, quantity, unit, costPerUnit, reorderLevel, supplier } = req.body;

    const item = await Inventory.findOneAndUpdate(
      { restaurantId: req.params.shopId, _id: req.params.itemId },
      {
        itemName: itemName || undefined,
        quantity: quantity !== undefined ? quantity : undefined,
        unit: unit || undefined,
        costPerUnit: costPerUnit || undefined,
        reorderLevel: reorderLevel || undefined,
        supplier: supplier || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Update inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Delete Inventory Item (Protected)
router.delete('/:shopId/:itemId', authenticateToken, verifyShopOwner, async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({
      restaurantId: req.params.shopId,
      _id: req.params.itemId
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Delete inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Add Stock (Protected)
router.post('/:shopId/:itemId/add-stock', authenticateToken, verifyShopOwner, async (req, res) => {
  try {
    const { quantity, reason } = req.body;

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const item = await Inventory.findOne({
      restaurantId: req.params.shopId,
      _id: req.params.itemId
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.quantity += Number(quantity);
    item.lastRestocked = new Date();
    item.history.push({
      action: 'added',
      quantity: Number(quantity),
      reason: reason || 'Restocking',
      timestamp: new Date()
    });

    await item.save();

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Add stock error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Remove Stock
router.post('/:shopId/:itemId/remove-stock', async (req, res) => {
  try {
    const { quantity, reason } = req.body;

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const item = await Inventory.findOne({
      restaurantId: req.params.shopId,
      _id: req.params.itemId
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    item.quantity -= Number(quantity);
    item.history.push({
      action: 'used',
      quantity: Number(quantity),
      reason: reason || 'Usage',
      timestamp: new Date()
    });

    await item.save();

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Remove stock error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Get Low Stock Items
router.get('/:shopId/low-stock', async (req, res) => {
  try {
    const items = await Inventory.find({
      restaurantId: req.params.shopId,
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    }).lean();

    return res.json({ success: true, lowStockItems: items });
  } catch (error) {
    console.error('Get low stock error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Search Inventory
router.get('/:shopId/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const items = await Inventory.find({
      restaurantId: req.params.shopId,
      itemName: { $regex: q, $options: 'i' }
    }).limit(10).lean();

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Search inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Bulk Update Inventory
router.post('/:shopId/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates array required' });
    }

    const results = [];
    for (const update of updates) {
      const item = await Inventory.findOneAndUpdate(
        { restaurantId: req.params.shopId, _id: update.itemId },
        { quantity: update.quantity, updatedAt: new Date() },
        { new: true }
      );
      if (item) results.push(item);
    }

    return res.json({ success: true, updated: results.length });
  } catch (error) {
    console.error('Bulk update error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Export Inventory
router.post('/:shopId/export', async (req, res) => {
  try {
    const { format = 'csv' } = req.body;

    const items = await Inventory.find({
      restaurantId: req.params.shopId
    }).lean();

    if (format === 'csv') {
      let csv = 'Item Name,Unit,Quantity,Cost Per Unit,Reorder Level,Last Restocked\n';
      items.forEach(item => {
        const lastRestocked = item.lastRestocked ? new Date(item.lastRestocked).toISOString().split('T')[0] : 'N/A';
        csv += `"${item.itemName}","${item.unit}",${item.quantity},${item.costPerUnit},${item.reorderLevel},"${lastRestocked}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
      return res.send(csv);
    }

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Export inventory error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Get Inventory Stats
router.get('/:shopId/stats', async (req, res) => {
  try {
    const items = await Inventory.find({
      restaurantId: req.params.shopId
    }).lean();

    const stats = {
      totalItems: items.length,
      lowStockCount: items.filter(i => i.quantity <= i.reorderLevel).length,
      expiringCount: items.filter(i => {
        if (!i.expiryDate) return false;
        const days = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        return days <= 7;
      }).length,
      totalValue: Math.round(items.reduce((sum, i) => sum + (i.costPerUnit * i.quantity), 0))
    };

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Get Expiring Items
router.get('/:shopId/expiring', async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(days));

    const items = await Inventory.find({
      restaurantId: req.params.shopId,
      expiryDate: {
        $gte: new Date(),
        $lte: expiryDate
      }
    }).lean();

    return res.json({ success: true, expiringItems: items });
  } catch (error) {
    console.error('Get expiring error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Item History
router.get('/:shopId/:itemId/history', async (req, res) => {
  try {
    const item = await Inventory.findOne({
      restaurantId: req.params.shopId,
      _id: req.params.itemId
    }).select('history').lean();

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, history: item.history || [] });
  } catch (error) {
    console.error('Get history error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Get Inventory Dashboard
router.get('/:shopId/dashboard', async (req, res) => {
  try {
    const items = await Inventory.find({
      restaurantId: req.params.shopId
    }).lean();

    const dashboard = {
      totalItems: items.length,
      lowStock: items.filter(i => i.quantity <= i.reorderLevel),
      recentlyUsed: items
        .filter(i => i.history && i.history.length > 0)
        .sort((a, b) => new Date(b.history[b.history.length - 1]?.timestamp) - new Date(a.history[a.history.length - 1]?.timestamp))
        .slice(0, 5),
      alerts: {
        lowStock: items.filter(i => i.quantity <= i.reorderLevel).length,
        expiring: items.filter(i => {
          if (!i.expiryDate) return false;
          const days = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
          return days <= 7 && days >= 0;
        }).length
      }
    };

    return res.json({ success: true, dashboard });
  } catch (error) {
    console.error('Get dashboard error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
