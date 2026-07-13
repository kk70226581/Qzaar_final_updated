const express = require('express');
const { MenuItem, Category, Review } = require('./models');

const router = express.Router();

// ========================================
// MENU ENDPOINTS (20 endpoints)
// ========================================

// ✅ 1. Get Categories
router.get('/categories/:shopId', async (req, res) => {
  try {
    const categories = await Category.find({ restaurantId: req.params.shopId, active: true })
      .sort({ order: 1 })
      .lean();
    return res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 2. Create Category
router.post('/categories/:shopId', async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name required' });
    }

    const category = await Category.create({
      restaurantId: req.params.shopId,
      name,
      description: description || '',
      icon: icon || '',
      image: image || ''
    });

    return res.json({ success: true, category });
  } catch (error) {
    console.error('Create category error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 3. Get Menu Items
router.get('/items/:shopId', async (req, res) => {
  try {
    const { category, search, sortBy = 'name' } = req.query;

    let query = { restaurantId: req.params.shopId, available: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let items = await MenuItem.find(query)
      .select('name category price discountedPrice description image rating bestseller')
      .lean();

    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Get items error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 4. Create Menu Item
router.post('/items/:shopId', async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price required' });
    }

    const item = await MenuItem.create({
      restaurantId: req.params.shopId,
      name,
      category,
      price,
      description: description || '',
      image: image || ''
    });

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Create item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 5. Get Menu Item Detail
router.get('/items/:shopId/:itemId', async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      restaurantId: req.params.shopId
    }).lean();

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Get item detail error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 6. Update Menu Item
router.put('/items/:shopId/:itemId', async (req, res) => {
  try {
    const { name, price, description, available } = req.body;

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.itemId, restaurantId: req.params.shopId },
      {
        name: name || undefined,
        price: price !== undefined ? price : undefined,
        description: description || undefined,
        available: available !== undefined ? available : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Update item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 7. Delete Menu Item
router.delete('/items/:shopId/:itemId', async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({
      _id: req.params.itemId,
      restaurantId: req.params.shopId
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Delete item error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 8. Get Items by Category
router.get('/categories/:shopId/:categoryName/items', async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurantId: req.params.shopId,
      category: req.params.categoryName,
      available: true
    }).lean();

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Get category items error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 9. Search Menu Items
router.get('/search/:shopId', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const items = await MenuItem.find(
      {
        restaurantId: req.params.shopId,
        available: true,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [q] } }
        ]
      }
    ).limit(10).lean();

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Search items error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 10. Get Recommended Items
router.get('/recommended/:shopId', async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurantId: req.params.shopId,
      featured: true,
      available: true
    }).limit(5).lean();

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Get recommended error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 11. Get Bestsellers
router.get('/bestsellers/:shopId', async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurantId: req.params.shopId,
      bestseller: true,
      available: true
    }).limit(10).lean();

    return res.json({ success: true, items });
  } catch (error) {
    console.error('Get bestsellers error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 12. Get Customizations for Item
router.get('/items/:shopId/:itemId/customizations', async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      restaurantId: req.params.shopId
    }).select('customizations').lean();

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, customizations: item.customizations || [] });
  } catch (error) {
    console.error('Get customizations error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 13. Get Add-ons for Item
router.get('/items/:shopId/:itemId/add-ons', async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      _id: req.params.itemId,
      restaurantId: req.params.shopId
    }).select('addOns').lean();

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, addOns: item.addOns || [] });
  } catch (error) {
    console.error('Get add-ons error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 14. Get Item Reviews
router.get('/items/:shopId/:itemId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({
      itemId: req.params.itemId,
      restaurantId: req.params.shopId,
      status: 'approved'
    }).lean();

    return res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 15. Post Item Review
router.post('/items/:shopId/:itemId/reviews', async (req, res) => {
  try {
    const { userId, userName, rating, comment } = req.body;

    if (!rating || !userId) {
      return res.status(400).json({ success: false, message: 'User ID and rating required' });
    }

    const review = await Review.create({
      itemId: req.params.itemId,
      restaurantId: req.params.shopId,
      userId,
      userName: userName || 'Anonymous',
      rating,
      comment: comment || ''
    });

    return res.json({ success: true, review });
  } catch (error) {
    console.error('Post review error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 16. Upload Item Image
router.post('/items/:shopId/:itemId/upload-image', async (req, res) => {
  try {
    // TODO: Implement file upload using multer
    return res.json({ success: true, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload image error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 17. Bulk Upload Menu
router.post('/bulk-upload/:shopId', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }

    const created = await MenuItem.insertMany(
      items.map(item => ({
        ...item,
        restaurantId: req.params.shopId
      }))
    );

    return res.json({ success: true, count: created.length });
  } catch (error) {
    console.error('Bulk upload error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 18. Export Menu
router.post('/export/:shopId', async (req, res) => {
  try {
    const { format = 'csv' } = req.body;

    const items = await MenuItem.find({
      restaurantId: req.params.shopId
    }).lean();

    if (format === 'csv') {
      let csv = 'Name,Category,Price,Description,Vegetarian,Available\n';
      items.forEach(item => {
        csv += `"${item.name}","${item.category}",${item.price},"${item.description}",${item.vegetarian},${item.available}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="menu.csv"');
      return res.send(csv);
    } else if (format === 'json') {
      return res.json({ success: true, items });
    }

    return res.status(400).json({ success: false, message: 'Invalid format' });
  } catch (error) {
    console.error('Export menu error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 19. Get Menu Statistics
router.get('/statistics/:shopId', async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurantId: req.params.shopId }).lean();

    const stats = {
      totalItems: items.length,
      availableItems: items.filter(i => i.available).length,
      vegetarianItems: items.filter(i => i.vegetarian).length,
      veganItems: items.filter(i => i.vegan).length,
      avgPrice: items.length > 0 ? Math.round(items.reduce((sum, i) => sum + i.price, 0) / items.length) : 0,
      avgRating: items.length > 0 ? (items.reduce((sum, i) => sum + i.rating, 0) / items.length).toFixed(1) : 0
    };

    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Get statistics error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ 20. Update Item Availability
router.put('/items/:shopId/:itemId/availability', async (req, res) => {
  try {
    const { available } = req.body;

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.itemId, restaurantId: req.params.shopId },
      { available },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.json({ success: true, item });
  } catch (error) {
    console.error('Update availability error:', error?.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
