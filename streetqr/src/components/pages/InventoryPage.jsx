import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarClock,
  Check,
  IndianRupee,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ModernBadge,
  ModernButton,
  ModernInput,
  ModernModal,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/InventoryPage.css';

const categories = [
  { id: 'all', label: 'All items' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'meat', label: 'Meat' },
  { id: 'grains', label: 'Grains' },
  { id: 'oils', label: 'Oils & ghee' },
  { id: 'vegetables', label: 'Vegetables' },
];

const initialItems = [
  { id: 1, name: 'Paneer', category: 'dairy', unit: 'kg', currentStock: 8, minStock: 10, maxStock: 30, costPerUnit: 350, expiryDate: '2026-08-20' },
  { id: 2, name: 'Chicken Breast', category: 'meat', unit: 'kg', currentStock: 15, minStock: 10, maxStock: 40, costPerUnit: 280, expiryDate: '2026-08-11' },
  { id: 3, name: 'Basmati Rice', category: 'grains', unit: 'kg', currentStock: 25, minStock: 20, maxStock: 60, costPerUnit: 80, expiryDate: '2027-03-15' },
  { id: 4, name: 'Olive Oil', category: 'oils', unit: 'liters', currentStock: 4, minStock: 5, maxStock: 15, costPerUnit: 600, expiryDate: '2027-01-20' },
  { id: 5, name: 'Garlic', category: 'vegetables', unit: 'kg', currentStock: 1, minStock: 3, maxStock: 10, costPerUnit: 120, expiryDate: '2026-08-12' },
  { id: 6, name: 'All-Purpose Flour', category: 'grains', unit: 'kg', currentStock: 42, minStock: 30, maxStock: 80, costPerUnit: 45, expiryDate: '2027-05-30' },
];

const emptyForm = {
  name: '',
  category: 'dairy',
  unit: 'kg',
  currentStock: '',
  minStock: '',
  maxStock: '',
  costPerUnit: '',
  expiryDate: '',
};

const getStockStatus = (item) => {
  if (item.currentStock <= Math.max(1, item.minStock * 0.5)) return 'critical';
  if (item.currentStock <= item.minStock) return 'low';
  return 'optimal';
};

const getStatusBadge = (status) => ({
  critical: { variant: 'danger', label: 'Critical' },
  low: { variant: 'warning', label: 'Low stock' },
  optimal: { variant: 'success', label: 'Healthy' },
}[status] || { variant: 'default', label: 'Unknown' });

const getExpiryDetails = (dateValue) => {
  if (!dateValue) return { label: 'No date', tone: 'neutral', days: Infinity };
  const expiry = new Date(`${dateValue}T23:59:59`);
  const days = Math.ceil((expiry.getTime() - Date.now()) / 86400000);

  if (days < 0) return { label: 'Expired', tone: 'danger', days };
  if (days === 0) return { label: 'Expires today', tone: 'danger', days };
  if (days <= 7) return { label: `${days}d left`, tone: 'warning', days };
  if (days <= 14) return { label: `${days}d left`, tone: 'soon', days };
  return { label: 'Fresh', tone: 'neutral', days };
};

const formatDate = (dateValue) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${dateValue}T00:00:00`));

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [inventoryItems, setInventoryItems] = useState(initialItems);

  const filteredItems = useMemo(() => inventoryItems
    .filter((item) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.category.includes(query);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return a.currentStock - b.currentStock;
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      const statusOrder = { critical: 0, low: 1, optimal: 2 };
      return statusOrder[getStockStatus(a)] - statusOrder[getStockStatus(b)];
    }), [inventoryItems, searchTerm, selectedCategory, sortBy]);

  const lowStockCount = inventoryItems.filter((item) => getStockStatus(item) !== 'optimal').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);
  const expiringSoonCount = inventoryItems.filter((item) => getExpiryDetails(item.expiryDate).days <= 14).length;

  const updateStock = (itemId, delta) => {
    setInventoryItems((items) => items.map((item) => (
      item.id === itemId
        ? { ...item, currentStock: Math.min(Math.max(item.currentStock + delta, 0), item.maxStock) }
        : item
    )));
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: String(item.currentStock),
      minStock: String(item.minStock),
      maxStock: String(item.maxStock),
      costPerUnit: String(item.costPerUnit),
      expiryDate: item.expiryDate,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItemId(null);
    setFormData(emptyForm);
  };

  const handleFormChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSaveItem = () => {
    const nextItem = {
      name: formData.name.trim(),
      category: formData.category,
      unit: formData.unit.trim() || 'units',
      currentStock: Math.max(0, Number(formData.currentStock) || 0),
      minStock: Math.max(0, Number(formData.minStock) || 0),
      maxStock: Math.max(1, Number(formData.maxStock) || 1),
      costPerUnit: Math.max(0, Number(formData.costPerUnit) || 0),
      expiryDate: formData.expiryDate,
    };

    if (!nextItem.name || !nextItem.expiryDate) return;
    nextItem.currentStock = Math.min(nextItem.currentStock, nextItem.maxStock);

    if (editingItemId) {
      setInventoryItems((items) => items.map((item) => (
        item.id === editingItemId ? { ...item, ...nextItem } : item
      )));
    } else {
      setInventoryItems((items) => [...items, { ...nextItem, id: Date.now() }]);
    }
    closeModal();
  };

  const summaryCards = [
    { label: 'Tracked items', value: inventoryItems.length, detail: `${categories.length - 1} categories`, icon: Package, tone: 'blue' },
    { label: 'Needs attention', value: lowStockCount, detail: 'At or below minimum', icon: AlertTriangle, tone: 'amber' },
    { label: 'Inventory value', value: `₹${(totalValue / 1000).toFixed(1)}K`, detail: 'Current stock value', icon: IndianRupee, tone: 'green' },
    { label: 'Expiring soon', value: expiringSoonCount, detail: 'Within the next 14 days', icon: CalendarClock, tone: 'violet' },
  ];

  return (
    <AdminLayout title="Inventory">
      <motion.div className="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <section className="inventory__hero">
          <div className="inventory__hero-copy">
            <p className="inventory__eyebrow"><span /> Stock control centre</p>
            <h2>Everything you need for the next service.</h2>
            <p>Monitor stock, catch expiry risks, and update quantities without leaving the floor.</p>
          </div>
          <ModernButton variant="primary" size="md" onClick={openAddModal}>
            <Plus size={18} /> Add item
          </ModernButton>
        </section>

        <section className="inventory__stats" aria-label="Inventory overview">
          {summaryCards.map(({ icon: Icon, ...card }, index) => (
            <motion.article
              className={`inventory__stat-card inventory__stat-card--${card.tone}`}
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="inventory__stat-icon"><Icon size={20} /></span>
              <div><p>{card.label}</p><strong>{card.value}</strong><small>{card.detail}</small></div>
            </motion.article>
          ))}
        </section>

        <section className="inventory__toolbar" aria-label="Inventory filters">
          <div className="inventory__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search ingredients or categories"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search inventory"
            />
          </div>
          <div className="inventory__category-tabs" role="group" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={selectedCategory === category.id ? 'is-active' : ''}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort inventory">
            <option value="status">Attention first</option>
            <option value="name">Name A–Z</option>
            <option value="stock">Lowest stock</option>
            <option value="expiry">Expiry date</option>
          </select>
        </section>

        <div className="inventory__result-line">
          <span><strong>{filteredItems.length}</strong> of {inventoryItems.length} items</span>
          {lowStockCount > 0 && <span className="inventory__attention"><AlertTriangle size={14} /> {lowStockCount} need attention</span>}
        </div>

        <section className="inventory__items" aria-live="polite">
          {filteredItems.length > 0 ? filteredItems.map((item, index) => {
            const status = getStockStatus(item);
            const statusBadge = getStatusBadge(status);
            const expiry = getExpiryDetails(item.expiryDate);
            const stockPercentage = Math.min((item.currentStock / item.maxStock) * 100, 100);
            const categoryLabel = categories.find((category) => category.id === item.category)?.label || item.category;

            return (
              <motion.article
                className={`inventory__item inventory__item--${status}`}
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
              >
                <div className="inventory__item-topline" />
                <header className="inventory__item-header">
                  <span className="inventory__item-icon"><Package size={19} /></span>
                  <div className="inventory__item-title">
                    <h3>{item.name}</h3>
                    <span>{categoryLabel}</span>
                  </div>
                  <ModernBadge variant={statusBadge.variant} size="sm">{statusBadge.label}</ModernBadge>
                </header>

                <div className="inventory__stock-overview">
                  <div><strong>{item.currentStock}</strong><span>{item.unit} available</span></div>
                  <span>{Math.round(stockPercentage)}% of capacity</span>
                </div>
                <div className="inventory__stock-bar" aria-label={`${Math.round(stockPercentage)} percent stocked`}>
                  <span style={{ width: `${stockPercentage}%` }} />
                </div>
                <div className="inventory__stock-limits">
                  <span>Reorder at {item.minStock} {item.unit}</span>
                  <span>Capacity {item.maxStock} {item.unit}</span>
                </div>

                <div className="inventory__details">
                  <div><span>Unit cost</span><strong>₹{item.costPerUnit}/{item.unit}</strong></div>
                  <div><span>Stock value</span><strong>₹{(item.currentStock * item.costPerUnit).toLocaleString('en-IN')}</strong></div>
                  <div className={`inventory__expiry inventory__expiry--${expiry.tone}`}>
                    <span>Expiry · {expiry.label}</span><strong>{formatDate(item.expiryDate)}</strong>
                  </div>
                </div>

                <footer className="inventory__item-actions">
                  <div className="inventory__stepper" aria-label={`Update ${item.name} stock`}>
                    <button type="button" onClick={() => updateStock(item.id, -1)} disabled={item.currentStock <= 0} aria-label={`Decrease ${item.name} stock`}><Minus size={15} /></button>
                    <strong>{item.currentStock}</strong>
                    <button type="button" onClick={() => updateStock(item.id, 1)} disabled={item.currentStock >= item.maxStock} aria-label={`Increase ${item.name} stock`}><Plus size={15} /></button>
                  </div>
                  <div className="inventory__quick-actions">
                    <button type="button" onClick={() => openEditModal(item)} aria-label={`Edit ${item.name}`} title="Edit item"><Pencil size={16} /></button>
                    <button type="button" className="is-danger" onClick={() => setInventoryItems((items) => items.filter((entry) => entry.id !== item.id))} aria-label={`Delete ${item.name}`} title="Delete item"><Trash2 size={16} /></button>
                  </div>
                </footer>
              </motion.article>
            );
          }) : (
            <div className="inventory__empty">
              <span><Search size={25} /></span>
              <h3>No matching ingredients</h3>
              <p>Try another search or clear the active category.</p>
              <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>Clear filters</button>
            </div>
          )}
        </section>

        <ModernModal isOpen={isModalOpen} onClose={closeModal} title={editingItemId ? 'Edit inventory item' : 'Add inventory item'}>
          <div className="inventory__modal-content">
            <label className="inventory__form-group inventory__form-group--wide">
              <span>Item name</span>
              <ModernInput value={formData.name} onChange={(event) => handleFormChange('name', event.target.value)} placeholder="e.g., Paneer" />
            </label>
            <label className="inventory__form-group">
              <span>Category</span>
              <select value={formData.category} onChange={(event) => handleFormChange('category', event.target.value)}>
                {categories.filter((category) => category.id !== 'all').map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              </select>
            </label>
            <label className="inventory__form-group">
              <span>Unit</span>
              <ModernInput value={formData.unit} onChange={(event) => handleFormChange('unit', event.target.value)} placeholder="kg, liters, pcs" />
            </label>
            <label className="inventory__form-group">
              <span>Current stock</span>
              <ModernInput type="number" min="0" value={formData.currentStock} onChange={(event) => handleFormChange('currentStock', event.target.value)} />
            </label>
            <label className="inventory__form-group">
              <span>Reorder level</span>
              <ModernInput type="number" min="0" value={formData.minStock} onChange={(event) => handleFormChange('minStock', event.target.value)} />
            </label>
            <label className="inventory__form-group">
              <span>Maximum capacity</span>
              <ModernInput type="number" min="1" value={formData.maxStock} onChange={(event) => handleFormChange('maxStock', event.target.value)} />
            </label>
            <label className="inventory__form-group">
              <span>Cost per unit (₹)</span>
              <ModernInput type="number" min="0" value={formData.costPerUnit} onChange={(event) => handleFormChange('costPerUnit', event.target.value)} />
            </label>
            <label className="inventory__form-group inventory__form-group--wide">
              <span>Expiry date</span>
              <ModernInput type="date" value={formData.expiryDate} onChange={(event) => handleFormChange('expiryDate', event.target.value)} />
            </label>
            <div className="inventory__modal-actions">
              <ModernButton variant="secondary" size="md" onClick={closeModal}>Cancel</ModernButton>
              <ModernButton variant="primary" size="md" onClick={handleSaveItem} disabled={!formData.name.trim() || !formData.expiryDate}>
                <Check size={17} /> {editingItemId ? 'Save changes' : 'Add item'}
              </ModernButton>
            </div>
          </div>
        </ModernModal>
      </motion.div>
    </AdminLayout>
  );
};

export default InventoryPage;
