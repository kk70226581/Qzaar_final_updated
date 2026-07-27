import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Search,
  MoreVertical,
  TrendingDown,
  Check,
} from 'lucide-react';
import {
  ModernCard,
  ModernButton,
  ModernInput,
  ModernBadge,
  ModernModal,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/InventoryPage.css';

/**
 * InventoryPage - Restaurant inventory management
 * 
 * Features:
 * - Inventory tracking
 * - Low stock alerts
 * - Stock level management
 * - Item categories
 * - Reorder automation
 * - Stock history
 * - Expiry tracking
 * - Search and filters
 */

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Paneer',
      category: 'dairy',
      unit: 'kg',
      currentStock: 8,
      minStock: 10,
      maxStock: 30,
      costPerUnit: 350,
      expiryDate: '2024-07-15',
      lastUpdated: '2024-07-05',
      status: 'low',
    },
    {
      id: 2,
      name: 'Chicken Breast',
      category: 'meat',
      unit: 'kg',
      currentStock: 15,
      minStock: 10,
      maxStock: 40,
      costPerUnit: 280,
      expiryDate: '2024-07-07',
      lastUpdated: '2024-07-05',
      status: 'optimal',
    },
    {
      id: 3,
      name: 'Basmati Rice',
      category: 'grains',
      unit: 'kg',
      currentStock: 25,
      minStock: 20,
      maxStock: 60,
      costPerUnit: 80,
      expiryDate: '2025-01-01',
      lastUpdated: '2024-07-04',
      status: 'optimal',
    },
    {
      id: 4,
      name: 'Olive Oil',
      category: 'oils',
      unit: 'liters',
      currentStock: 3,
      minStock: 5,
      maxStock: 15,
      costPerUnit: 600,
      expiryDate: '2025-06-01',
      lastUpdated: '2024-07-05',
      status: 'low',
    },
    {
      id: 5,
      name: 'Garlic',
      category: 'vegetables',
      unit: 'kg',
      currentStock: 2,
      minStock: 3,
      maxStock: 10,
      costPerUnit: 120,
      expiryDate: '2024-07-20',
      lastUpdated: '2024-07-03',
      status: 'critical',
    },
    {
      id: 6,
      name: 'All-Purpose Flour',
      category: 'grains',
      unit: 'kg',
      currentStock: 42,
      minStock: 30,
      maxStock: 80,
      costPerUnit: 45,
      expiryDate: '2024-12-01',
      lastUpdated: '2024-07-02',
      status: 'optimal',
    },
  ]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'meat', label: 'Meat' },
    { id: 'grains', label: 'Grains' },
    { id: 'oils', label: 'Oils & Ghee' },
    { id: 'vegetables', label: 'Vegetables' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return { variant: 'danger', label: 'Critical' };
      case 'low':
        return { variant: 'warning', label: 'Low Stock' };
      case 'optimal':
        return { variant: 'success', label: 'In Stock' };
      default:
        return { variant: 'default', label: 'Unknown' };
    }
  };

  const getStockPercentage = (current, min, max) => {
    if (current <= min) return 25;
    if (current >= max) return 100;
    return ((current - min) / (max - min)) * 100;
  };

  const filteredItems = inventoryItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return b.currentStock - a.currentStock;
      if (sortBy === 'status') {
        const statusOrder = { critical: 0, low: 1, optimal: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });

  const lowStockCount = inventoryItems.filter(item => item.status !== 'optimal').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  const handleAddStock = (itemId, amount) => {
    setInventoryItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, currentStock: Math.min(item.currentStock + amount, item.maxStock) }
          : item
      )
    );
  };

  const handleRemoveStock = (itemId, amount) => {
    setInventoryItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, currentStock: Math.max(item.currentStock - amount, 0) }
          : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setInventoryItems(items => items.filter(item => item.id !== itemId));
  };

  return (
    <AdminLayout title="Inventory Management">
      <motion.div
        className="inventory"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="inventory__controls-row">
          <div className="inventory__hero-copy">
            <p className="inventory__eyebrow"><span /> Stock control centre</p>
            <h2>Keep every ingredient service-ready.</h2>
            <p>Track stock levels, item costs and expiry alerts from one place.</p>
          </div>
          <ModernButton
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            Add Item
          </ModernButton>
        </div>

        <div className="inventory__container-inner">
        {/* STATS CARDS */}
        <motion.div
          className="inventory__stats"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="inventory__stat-card" variants={itemVariants}>
            <div className="inventory__stat-icon inventory__stat-icon--info">
              <Package size={24} />
            </div>
            <div className="inventory__stat-content">
              <p className="inventory__stat-label">Total Items</p>
              <p className="inventory__stat-value">{inventoryItems.length}</p>
            </div>
          </motion.div>

          <motion.div className="inventory__stat-card" variants={itemVariants}>
            <div className="inventory__stat-icon inventory__stat-icon--warning">
              <AlertTriangle size={24} />
            </div>
            <div className="inventory__stat-content">
              <p className="inventory__stat-label">Low Stock</p>
              <p className="inventory__stat-value">{lowStockCount}</p>
            </div>
          </motion.div>

          <motion.div className="inventory__stat-card" variants={itemVariants}>
            <div className="inventory__stat-icon inventory__stat-icon--success">
              <TrendingDown size={24} />
            </div>
            <div className="inventory__stat-content">
              <p className="inventory__stat-label">Stock Value</p>
              <p className="inventory__stat-value">₹{(totalValue / 1000).toFixed(1)}K</p>
            </div>
          </motion.div>
        </motion.div>

        {/* FILTERS & SEARCH */}
        <motion.div
          className="inventory__filters"
          variants={itemVariants}
        >
          <ModernCard variant="flat">
            <div className="inventory__filter-row">
              <div className="inventory__search">
                <Search size={18} />
                <ModernInput
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="inventory__search-input"
                />
              </div>

              <div className="inventory__filter-controls">
                <select
                  className="inventory__filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>

                <select
                  className="inventory__filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="stock">Sort by Stock</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* ITEMS LIST */}
        <motion.div
          className="inventory__items"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const statusBadge = getStatusBadge(item.status);
              const stockPercentage = getStockPercentage(item.currentStock, item.minStock, item.maxStock);

              return (
                <motion.div
                  key={item.id}
                  className="inventory__item"
                  variants={itemVariants}
                >
                  <ModernCard variant="elevated">
                    <div className="inventory__item-header">
                      <div className="inventory__item-title">
                        <h3 className="inventory__item-name">{item.name}</h3>
                        <ModernBadge variant={statusBadge.variant} size="sm">
                          {statusBadge.label}
                        </ModernBadge>
                      </div>
                      <button
                        className="inventory__item-menu"
                        onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                        aria-label="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="inventory__item-content">
                      <div className="inventory__item-meta">
                        <span className="inventory__meta-label">Unit:</span>
                        <span className="inventory__meta-value">{item.unit}</span>
                      </div>
                      <div className="inventory__item-meta">
                        <span className="inventory__meta-label">Cost:</span>
                        <span className="inventory__meta-value">₹{item.costPerUnit}/{item.unit}</span>
                      </div>
                      <div className="inventory__item-meta">
                        <span className="inventory__meta-label">Expiry:</span>
                        <span className={`inventory__meta-value ${new Date(item.expiryDate) < new Date() ? 'expired' : ''}`}>
                          {item.expiryDate}
                        </span>
                      </div>
                    </div>

                    <div className="inventory__stock-section">
                      <div className="inventory__stock-header">
                        <span className="inventory__stock-label">Stock Level</span>
                        <span className="inventory__stock-range">
                          {item.currentStock}/{item.maxStock} {item.unit}
                        </span>
                      </div>
                      <div className="inventory__stock-bar">
                        <div
                          className="inventory__stock-fill"
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="inventory__stock-info">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>

                    <div className="inventory__item-actions">
                      <button
                        className="inventory__qty-btn inventory__qty-btn--decrease"
                        onClick={() => handleRemoveStock(item.id, 1)}
                        disabled={item.currentStock <= 0}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="inventory__qty-display">{item.currentStock}</span>
                      <button
                        className="inventory__qty-btn inventory__qty-btn--increase"
                        onClick={() => handleAddStock(item.id, 1)}
                        disabled={item.currentStock >= item.maxStock}
                      >
                        <Plus size={16} />
                      </button>

                      <div className="inventory__item-buttons">
                        <ModernButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <Edit2 size={16} />
                          Edit
                        </ModernButton>
                        <ModernButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </ModernButton>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              );
            })
          ) : (
            <ModernCard variant="flat">
              <div className="inventory__empty">
                <Package size={48} />
                <p>No items found</p>
                <ModernButton
                  variant="primary"
                  size="md"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add First Item
                </ModernButton>
              </div>
            </ModernCard>
          )}
        </motion.div>
      </div>

      {/* ADD ITEM MODAL */}
      <ModernModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Inventory Item"
      >
        <div className="inventory__modal-content">
          <div className="inventory__form-group">
            <label>Item Name</label>
            <ModernInput placeholder="e.g., Paneer" />
          </div>
          <div className="inventory__form-group">
            <label>Category</label>
            <select className="inventory__modal-select">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="inventory__form-group">
            <label>Unit (kg, liters, pcs, etc.)</label>
            <ModernInput placeholder="e.g., kg" />
          </div>
          <div className="inventory__form-group">
            <label>Current Stock</label>
            <ModernInput type="number" placeholder="0" />
          </div>
          <div className="inventory__form-group">
            <label>Min Stock</label>
            <ModernInput type="number" placeholder="0" />
          </div>
          <div className="inventory__form-group">
            <label>Max Stock</label>
            <ModernInput type="number" placeholder="0" />
          </div>
          <div className="inventory__form-group">
            <label>Cost Per Unit (₹)</label>
            <ModernInput type="number" placeholder="0" />
          </div>
          <div className="inventory__form-group">
            <label>Expiry Date</label>
            <ModernInput type="date" />
          </div>
          <div className="inventory__modal-actions">
            <ModernButton
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </ModernButton>
            <ModernButton
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              <Check size={18} />
              Add Item
            </ModernButton>
          </div>
        </div>
      </ModernModal>
    </motion.div>
  </AdminLayout>
);
};



export default InventoryPage;
