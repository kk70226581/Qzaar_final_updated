import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Copy,
  Camera,
  ChevronDown,
  Clock3,
  ImageOff,
  ImagePlus,
  Leaf,
  LoaderCircle,
  LogOut,
  Plus,
  Search,
  Sparkles,
  Star,
  Store,
  Trash2,
  AlertCircle,
  X
} from 'lucide-react';
import Navbar from './Navbar';
import './MenuBuilder.css';

const DEFAULT_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

const createEmptyItem = () => ({
  name: '',
  price: '',
  remarks: '',
  category: DEFAULT_CATEGORIES[0],
  image: '',
  prepTime: 12,
  spiceLevel: 'Medium',
  featured: false,
  isVeg: false,
  available: true
});

const createDefaultProfile = () => ({
  shopName: '',
  ownerName: '',
  tagline: '',
  heroHeadline: '',
  qualityPromise: '',
  cuisineType: '',
  contactPhone: '',
  openHours: '',
  address: '',
  logo: '',
  brandColor: '#f97316'
});

const demoProfile = {
  shopName: 'Kashi Chaat Corner',
  ownerName: 'Aman Verma',
  tagline: 'Fast-moving North Indian street food with QR ordering',
  heroHeadline: 'Varanasi street food, served with pride.',
  qualityPromise: 'Fresh ingredients, made to order every time.',
  cuisineType: 'Street Food',
  contactPhone: '+91 98765 43210',
  openHours: '11:00 AM - 11:00 PM',
  address: 'Assi Ghat Road, Varanasi',
  logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  brandColor: '#f97316'
};

const demoItems = [
  {
    name: 'Tandoori Paneer Wrap',
    price: '180',
    remarks: 'Creamy mint chutney, onions, and smoky paneer tikka.',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=80',
    prepTime: 14,
    spiceLevel: 'Medium',
    featured: true,
    isVeg: true,
    available: true
  },
  {
    name: 'Masala Lemon Soda',
    price: '60',
    remarks: 'Fresh lemon, black salt, mint, and soda.',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    prepTime: 4,
    spiceLevel: 'Mild',
    featured: false,
    isVeg: true,
    available: true
  },
  {
    name: 'Butter Kulhad Pasta',
    price: '190',
    remarks: 'A crowd favorite fusion dish served in a clay cup.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=900&q=80',
    prepTime: 11,
    spiceLevel: 'Hot',
    featured: true,
    isVeg: true,
    available: true
  }
];

const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;
const getTodayIso = () => new Date().toISOString().split('T')[0];
const createCouponDraft = () => ({
  code: '',
  discountType: 'percentage',
  discountValue: '10',
  minOrderValue: '0',
  maxDiscount: '',
  validFrom: getTodayIso(),
  validTill: getTodayIso(),
  description: ''
});

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Failed to read file.'));
  reader.readAsDataURL(file);
});

function SmartImage({ src, alt, className, fallbackClassName, fallbackContent }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return <div className={fallbackClassName}>{fallbackContent}</div>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
}

function ItemImageField({
  itemName,
  image,
  onUrlChange,
  onUpload,
  onClear,
  uploadLabel
}) {
  return (
    <div className="builder-image-field">
      <div className="builder-image-field__preview">
        <SmartImage
          src={image}
          alt={itemName || 'Item preview'}
          className="builder-image-field__image"
          fallbackClassName="builder-image-field__fallback"
          fallbackContent={
            <>
              <Camera size={20} />
              <span>{itemName ? 'Preview image' : 'Add item image'}</span>
            </>
          }
        />
      </div>

      <div className="builder-image-field__body">
        <label className="builder-image-field__label">
          <span>Image URL</span>
          <input value={image} onChange={(event) => onUrlChange(event.target.value)} placeholder="Paste a direct image URL" />
        </label>

        <div className="builder-image-field__actions">
          <label className="builder-upload-btn builder-upload-btn--inline">
            <ImagePlus size={16} />
            {uploadLabel}
            <input type="file" accept="image/*" onChange={onUpload} />
          </label>

          <button type="button" className="builder-chip builder-chip--ghost" onClick={onClear}>
            <ImageOff size={16} />
            Remove image
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuBuilder() {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const [items, setItems] = useState([]);
  const [shopProfile, setShopProfile] = useState(createDefaultProfile());
  const [newItem, setNewItem] = useState(createEmptyItem());
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortMode, setSortMode] = useState('category');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState(createCouponDraft());
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const shopId = localStorage.getItem('shopId') || '';
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true' || Boolean(shopId);
  const draftKey = shopId ? `streetqr-menu-draft-${shopId}` : 'streetqr-menu-draft';

  useEffect(() => {
    if (!isLoggedIn || !shopId) {
      navigate('/login');
      return;
    }

    const loadMenu = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/menu/${shopId}`);
        if (!response.data.success) {
          return;
        }

        const nextItems = [];
        Object.entries(response.data.menu || {}).forEach(([category, categoryItems]) => {
          (categoryItems || []).forEach((item) => {
            nextItems.push({ ...createEmptyItem(), ...item, category });
          });
        });

        setItems(nextItems);
        setShopProfile({
          shopName: response.data.shopName || '',
          ownerName: response.data.ownerName || '',
          tagline: response.data.tagline || '',
          heroHeadline: response.data.heroHeadline || '',
          qualityPromise: response.data.qualityPromise || '',
          cuisineType: response.data.cuisineType || '',
          contactPhone: response.data.contactPhone || '',
          openHours: response.data.openHours || '',
          address: response.data.address || '',
          logo: response.data.logo || '',
          brandColor: response.data.brandColor || '#f97316'
        });
      } catch (error) {
        setStatusMessage({ type: 'danger', text: 'Unable to load your published menu.' });
      }
    };

    loadMenu();
  }, [API_BASE, isLoggedIn, navigate, shopId]);

  useEffect(() => {
    if (!shopId) {
      return;
    }

    const loadCoupons = async () => {
      setIsLoadingCoupons(true);
      try {
        const response = await axios.get(`${API_BASE}/api/coupons/${shopId}`);
        if (response.data.success) {
          setCoupons(response.data.coupons || []);
        }
      } catch (error) {
        showMessage('danger', 'Unable to load campaign offers right now.');
      } finally {
        setIsLoadingCoupons(false);
      }
    };

    loadCoupons();
  }, [API_BASE, shopId]);

  useEffect(() => {
    if (shopId) {
      localStorage.setItem(draftKey, JSON.stringify({ items, shopProfile }));
    }
  }, [draftKey, items, shopId, shopProfile]);

  const categoryOptions = useMemo(() => Array.from(new Set([
    ...DEFAULT_CATEGORIES,
    ...items.map((item) => item.category).filter(Boolean),
    newItem.category
  ])), [items, newItem.category]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const nextItems = items.filter((item) => {
      const matchesSearch = !query || [item.name, item.remarks, item.category]
        .some((value) => String(value || '').toLowerCase().includes(query));
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return nextItems.sort((left, right) => {
      if (sortMode === 'price-high') return Number(right.price || 0) - Number(left.price || 0);
      if (sortMode === 'price-low') return Number(left.price || 0) - Number(right.price || 0);
      if (sortMode === 'featured') return Number(Boolean(right.featured)) - Number(Boolean(left.featured));
      if (left.category === right.category) return left.name.localeCompare(right.name);
      return left.category.localeCompare(right.category);
    });
  }, [activeCategory, items, searchTerm, sortMode]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const featuredItems = items.filter((item) => item.featured).length;
    const availableItems = items.filter((item) => item.available !== false).length;
    const averagePrice = totalItems ? items.reduce((sum, item) => sum + Number(item.price || 0), 0) / totalItems : 0;
    const profileSignals = [
      shopProfile.shopName,
      shopProfile.tagline,
      shopProfile.openHours,
      shopProfile.address,
      shopProfile.contactPhone
    ].filter(Boolean).length;
    const readinessScore = Math.round(((Math.min(profileSignals, 5) / 5) * 45) + ((Math.min(totalItems, 8) / 8) * 40) + ((Math.min(featuredItems, 3) / 3) * 15));

    return { totalItems, featuredItems, availableItems, averagePrice, readinessScore: Math.min(100, readinessScore || 0) };
  }, [items, shopProfile]);

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    window.setTimeout(() => setStatusMessage((current) => (current?.text === text ? null : current)), 2800);
  };

  const handleProfileChange = (field, value) => {
    setShopProfile((current) => ({ ...current, [field]: value }));
  };

  const handleProfileImageUpload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showMessage('danger', 'Please choose a valid image file.');
      return;
    }

    try {
      const imageData = await fileToDataUrl(file);
      handleProfileChange(field, imageData);
      showMessage('success', 'Image uploaded from your device.');
    } catch (error) {
      showMessage('danger', 'Could not read the selected image.');
    } finally {
      event.target.value = '';
    }
  };

  const handleItemChange = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((current) => ({ ...current, [field]: value }));
  };

  const handleCouponFormChange = (field, value) => {
    setCouponForm((current) => ({ ...current, [field]: value }));
  };

  const clearNewItemImage = () => {
    handleNewItemChange('image', '');
  };

  const handleNewItemImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showMessage('danger', 'Please choose a valid image file.');
      return;
    }

    try {
      const imageData = await fileToDataUrl(file);
      handleNewItemChange('image', imageData);
      showMessage('success', 'Item image added from your device.');
    } catch (error) {
      showMessage('danger', 'Could not read the selected image.');
    } finally {
      event.target.value = '';
    }
  };

  const handleExistingItemImageUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showMessage('danger', 'Please choose a valid image file.');
      return;
    }

    try {
      const imageData = await fileToDataUrl(file);
      handleItemChange(index, 'image', imageData);
      showMessage('success', 'Item image updated from your device.');
    } catch (error) {
      showMessage('danger', 'Could not read the selected image.');
    } finally {
      event.target.value = '';
    }
  };

  const clearExistingItemImage = (index) => {
    handleItemChange(index, 'image', '');
  };

  const addItemToList = () => {
    if (!newItem.name.trim() || !newItem.price) {
      showMessage('danger', 'Add at least an item name and price before saving.');
      return;
    }

    setItems((current) => [...current, { ...newItem, name: newItem.name.trim() }]);
    setNewItem(createEmptyItem());
    setIsAddingItem(false);
    showMessage('success', 'Menu item added to your draft.');
  };

  const duplicateItem = (index) => {
    setItems((current) => {
      const source = current[index];
      if (!source) return current;
      const next = [...current];
      next.splice(index + 1, 0, { ...source, name: `${source.name} Copy` });
      return next;
    });
  };

  const removeItem = (index) => {
    const itemName = items[index]?.name || 'this item';
    setDeleteConfirm({ index, itemName });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setItems((current) => current.filter((_, itemIndex) => itemIndex !== deleteConfirm.index));
      setDeleteConfirm(null);
      toast.success(`"${deleteConfirm.itemName}" removed from menu`);
    }
  };

  const restoreDraft = () => {
    const rawDraft = localStorage.getItem(draftKey);
    if (!rawDraft) {
      showMessage('danger', 'No local draft found for this account.');
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft);
      setItems(parsedDraft.items || []);
      setShopProfile({ ...createDefaultProfile(), ...(parsedDraft.shopProfile || {}) });
      showMessage('success', 'Local draft restored.');
    } catch (error) {
      showMessage('danger', 'The saved draft could not be restored.');
    }
  };

  const loadDemoMenu = () => {
    setShopProfile(demoProfile);
    setItems(demoItems);
    showMessage('success', 'Demo content loaded. Edit anything before publishing.');
  };

  const clearDraft = () => {
    setItems([]);
    setShopProfile(createDefaultProfile());
    setNewItem(createEmptyItem());
    localStorage.removeItem(draftKey);
    showMessage('success', 'Working draft cleared.');
  };

  const handleCreateCoupon = async () => {
    const code = couponForm.code.trim().toUpperCase();
    const discountValue = Number(couponForm.discountValue);
    const minOrderValue = Number(couponForm.minOrderValue || 0);
    const maxDiscount = couponForm.maxDiscount ? Number(couponForm.maxDiscount) : undefined;

    if (!code || !discountValue || !couponForm.validFrom || !couponForm.validTill) {
      showMessage('danger', 'Complete the coupon code, discount, and validity dates.');
      return;
    }

    if (new Date(couponForm.validTill) < new Date(couponForm.validFrom)) {
      showMessage('danger', 'Coupon end date cannot be before the start date.');
      return;
    }

    setIsSavingCoupon(true);
    try {
      const response = await axios.post(`${API_BASE}/api/coupons/${shopId}`, {
        code,
        discountType: couponForm.discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        validFrom: couponForm.validFrom,
        validTill: couponForm.validTill,
        description: couponForm.description.trim()
      });

      if (response.data.success) {
        setCoupons((current) => [response.data.coupon, ...current]);
        setCouponForm(createCouponDraft());
        showMessage('success', `Coupon ${code} created successfully.`);
        return;
      }

      showMessage('danger', response.data.message || 'Unable to create coupon.');
    } catch (error) {
      showMessage('danger', error.response?.data?.message || 'Unable to create coupon.');
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const steps = [
    { id: 1, label: 'Brand', hint: 'Your place' },
    { id: 2, label: 'Menu', hint: 'Your dishes' },
    { id: 3, label: 'Offers', hint: 'Optional' },
    { id: 4, label: 'Publish', hint: 'Go live' }
  ];

  const goToStep = (nextStep) => {
    if (nextStep > activeStep && activeStep === 1 && !shopProfile.shopName.trim()) {
      showMessage('danger', 'Add your shop name to continue.');
      return;
    }
    if (nextStep > activeStep && activeStep === 2 && items.length === 0) {
      showMessage('danger', 'Add at least one menu item to continue.');
      return;
    }
    setActiveStep(Math.max(1, Math.min(4, nextStep)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!items.length) {
      showMessage('danger', 'Add at least one menu item before publishing.');
      return;
    }

    if (!shopProfile.shopName.trim()) {
      showMessage('danger', 'Add the shop name before publishing.');
      return;
    }

    const groupedMenu = {};
    items.forEach((item) => {
      const category = item.category || 'Uncategorized';
      if (!groupedMenu[category]) groupedMenu[category] = [];
      groupedMenu[category].push({
        name: item.name,
        price: item.price,
        remarks: item.remarks,
        image: item.image,
        prepTime: Number(item.prepTime) || 0,
        spiceLevel: item.spiceLevel,
        featured: Boolean(item.featured),
        isVeg: Boolean(item.isVeg),
        available: item.available !== false
      });
    });

    setIsSaving(true);
    try {
      const response = await axios.post(`${API_BASE}/api/menu/${shopId}`, { ...shopProfile, menu: groupedMenu });
      if (response.data.success) {
        localStorage.setItem('qr_id', response.data._id);
        navigate('/qrcode', { state: { id: response.data._id } });
      } else {
        showMessage('danger', 'Menu publishing failed. Please try again.');
      }
    } catch (error) {
      showMessage('danger', 'Menu publishing failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewItems = filteredItems.slice(0, 3);
  const activeCoupons = coupons.filter((coupon) => coupon.isActive !== false);

  return (
    <>
      <Navbar showAuthLinks={false} />
      <div className="builder-shell">
        <div className="builder-container">
          <header className="builder-workbench-header">
            <div>
              <span>Menu builder</span>
              <strong>{steps[activeStep - 1].label}</strong>
            </div>
            <button type="button" className="builder-icon-button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut size={17} /></button>
          </header>

          {statusMessage && <div className={`builder-alert builder-alert--${statusMessage.type}`}>{statusMessage.text}</div>}

          <nav className="builder-steps" aria-label="Menu setup progress">
            {steps.map((step) => (
              <button
                type="button"
                key={step.id}
                className={`builder-step ${activeStep === step.id ? 'builder-step--active' : ''} ${activeStep > step.id ? 'builder-step--done' : ''}`}
                onClick={() => goToStep(step.id)}
                aria-current={activeStep === step.id ? 'step' : undefined}
              >
                <span className="builder-step__number">{activeStep > step.id ? '✓' : step.id}</span>
                <span><strong>{step.label}</strong><small>{step.hint}</small></span>
              </button>
            ))}
          </nav>

          <div className={`builder-layout builder-layout--step-${activeStep}`}>
            <div className="builder-main">
              <section className="builder-panel builder-step-panel builder-step-panel--1">
                <div className="builder-panel__header">
                  <div><h2>Your place</h2><p>What customers see first.</p></div>
                  <div className="builder-panel__header-icon"><Store size={18} /></div>
                </div>

                <div className="builder-profile-layout">
                <div className="builder-form-grid">
                  <label><span>Shop name</span><input value={shopProfile.shopName} onChange={(event) => handleProfileChange('shopName', event.target.value)} placeholder="Street stall or cafe name" /></label>
                  <label><span>Cuisine</span><input value={shopProfile.cuisineType} onChange={(event) => handleProfileChange('cuisineType', event.target.value)} placeholder="Street food, cafe..." /></label>
                  <label className="builder-form-grid__wide"><span>One-line description</span><input value={shopProfile.tagline} onChange={(event) => handleProfileChange('tagline', event.target.value)} placeholder="Fresh food, made your way" /></label>
                  <label className="builder-form-grid__wide"><span>Hero headline</span><input value={shopProfile.heroHeadline} onChange={(event) => handleProfileChange('heroHeadline', event.target.value)} placeholder="What makes your restaurant memorable?" /></label>
                  <label><span>Brand color</span><div className="builder-color-input"><input type="color" value={shopProfile.brandColor} onChange={(event) => handleProfileChange('brandColor', event.target.value)} /><input value={shopProfile.brandColor} onChange={(event) => handleProfileChange('brandColor', event.target.value)} placeholder="#f97316" /></div></label>
                  <details className="builder-advanced-fields builder-form-grid__wide">
                    <summary>More details</summary>
                    <div className="builder-form-grid">
                      <label><span>Owner</span><input value={shopProfile.ownerName} onChange={(event) => handleProfileChange('ownerName', event.target.value)} placeholder="Owner name" /></label>
                      <label><span>Hours</span><input value={shopProfile.openHours} onChange={(event) => handleProfileChange('openHours', event.target.value)} placeholder="11 AM - 11 PM" /></label>
                      <label><span>Phone</span><input value={shopProfile.contactPhone} onChange={(event) => handleProfileChange('contactPhone', event.target.value)} placeholder="+91 ..." /></label>
                      <label><span>Image URL</span><input value={shopProfile.logo} onChange={(event) => handleProfileChange('logo', event.target.value)} placeholder="Paste image URL" /></label>
                      <label className="builder-form-grid__wide"><span>Address</span><input value={shopProfile.address} onChange={(event) => handleProfileChange('address', event.target.value)} placeholder="Location customers recognize" /></label>
                      <label className="builder-form-grid__wide"><span>Quality promise</span><input value={shopProfile.qualityPromise} onChange={(event) => handleProfileChange('qualityPromise', event.target.value)} placeholder="Fresh ingredients, made to order" /></label>
                    </div>
                  </details>
                </div>

                <div className="builder-brand-stage" style={{ '--builder-brand': shopProfile.brandColor }}>
                  <SmartImage src={shopProfile.logo || '/images/showcase/showcase-2.png'} alt={shopProfile.shopName || 'Brand cover'} className="builder-brand-stage__image" fallbackClassName="builder-brand-stage__fallback" fallbackContent={<Store size={34} />} />
                  <div className="builder-brand-stage__overlay">
                    <span>{shopProfile.cuisineType || 'Your cuisine'}</span>
                    <strong>{shopProfile.shopName || 'Your shop'}</strong>
                    <small>{shopProfile.tagline || 'A short description goes here.'}</small>
                  </div>
                </div>
                </div>

                <div className="builder-upload-panel">
                  <div className="builder-upload-panel__copy">
                    <strong>Cover image</strong>
                    <span>Food photo or logo.</span>
                  </div>
                  <div className="builder-upload-panel__actions">
                    <label className="builder-upload-btn">
                      <ImagePlus size={16} />
                      Upload image
                      <input type="file" accept="image/*" onChange={(event) => handleProfileImageUpload(event, 'logo')} />
                    </label>
                  </div>
                </div>

              </section>

              <section className="builder-panel builder-step-panel builder-step-panel--1">
                <div className="builder-panel__header">
                  <div>
                    <h2>Quick actions</h2>
                    <p>Fast setup tools.</p>
                  </div>
                  <div className="builder-panel__header-icon"><Sparkles size={18} /></div>
                </div>

                <div className="builder-action-row">
                  <button type="button" className="builder-chip" onClick={loadDemoMenu}><Sparkles size={16} /> Sample</button>
                  <button type="button" className="builder-chip builder-chip--ghost" onClick={restoreDraft}><Copy size={16} /> Restore draft</button>
                  <button type="button" className="builder-chip builder-chip--ghost" onClick={clearDraft}><Trash2 size={16} /> Clear draft</button>
                </div>
              </section>

              <section className="builder-panel builder-step-panel builder-step-panel--3">
                <div className="builder-panel__header">
                  <div>
                    <h2>Offers and campaigns</h2>
                    <p>Discount codes and dates.</p>
                  </div>
                  <div className="builder-panel__header-icon"><BadgePercent size={18} /></div>
                </div>

                <div className="builder-coupon-layout">
                  <div className="builder-coupon-form">
                    <div className="builder-item-editor__grid">
                      <label>
                        <span>Coupon code</span>
                        <input
                          value={couponForm.code}
                          onChange={(event) => handleCouponFormChange('code', event.target.value.toUpperCase())}
                          placeholder="WELCOME10"
                        />
                      </label>
                      <label>
                        <span>Discount type</span>
                        <select
                          value={couponForm.discountType}
                          onChange={(event) => handleCouponFormChange('discountType', event.target.value)}
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed amount</option>
                        </select>
                      </label>
                      <label>
                        <span>Discount value</span>
                        <input
                          type="number"
                          min="1"
                          value={couponForm.discountValue}
                          onChange={(event) => handleCouponFormChange('discountValue', event.target.value)}
                          placeholder="10"
                        />
                      </label>
                      <label>
                        <span>Minimum order value</span>
                        <input
                          type="number"
                          min="0"
                          value={couponForm.minOrderValue}
                          onChange={(event) => handleCouponFormChange('minOrderValue', event.target.value)}
                          placeholder="199"
                        />
                      </label>
                      <label>
                        <span>Max discount cap</span>
                        <input
                          type="number"
                          min="0"
                          value={couponForm.maxDiscount}
                          onChange={(event) => handleCouponFormChange('maxDiscount', event.target.value)}
                          placeholder="80"
                        />
                      </label>
                      <label>
                        <span>Valid from</span>
                        <input
                          type="date"
                          value={couponForm.validFrom}
                          onChange={(event) => handleCouponFormChange('validFrom', event.target.value)}
                        />
                      </label>
                      <label>
                        <span>Valid till</span>
                        <input
                          type="date"
                          value={couponForm.validTill}
                          onChange={(event) => handleCouponFormChange('validTill', event.target.value)}
                        />
                      </label>
                      <label className="builder-item-editor__grid-wide">
                        <span>Offer description</span>
                        <textarea
                          rows="3"
                          value={couponForm.description}
                          onChange={(event) => handleCouponFormChange('description', event.target.value)}
                          placeholder="Example: Flat savings for first-time diners this weekend."
                        />
                      </label>
                    </div>

                    <div className="builder-action-row">
                      <button type="button" className="builder-primary-btn" onClick={handleCreateCoupon} disabled={isSavingCoupon}>
                        {isSavingCoupon ? 'Creating coupon...' : 'Create campaign offer'}
                      </button>
                      <button type="button" className="builder-chip builder-chip--ghost" onClick={() => setCouponForm(createCouponDraft())}>
                        Reset offer form
                      </button>
                    </div>
                  </div>

                  <div className="builder-coupon-list">
                    <div className="builder-coupon-list__header">
                      <strong>Active offers</strong>
                      <span>{isLoadingCoupons ? 'Loading...' : `${activeCoupons.length} live`}</span>
                    </div>

                    {activeCoupons.length === 0 ? (
                      <div className="builder-empty-state">
                        <p>No offers yet.</p>
                      </div>
                    ) : (
                      activeCoupons.map((coupon) => (
                        <article className="builder-coupon-card" key={coupon._id || coupon.code}>
                          <div className="builder-coupon-card__top">
                            <strong>{coupon.code}</strong>
                            <span>
                              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `${formatCurrency(coupon.discountValue)} off`}
                            </span>
                          </div>
                          <p>{coupon.description || 'Offer available on eligible orders.'}</p>
                          <div className="builder-coupon-card__meta">
                            <span>Min order {formatCurrency(coupon.minOrderValue)}</span>
                            <span>Valid till {new Date(coupon.validTill).toLocaleDateString()}</span>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section className="builder-panel builder-step-panel builder-step-panel--2">
                <div className="builder-panel__header">
                  <div><h2>Add a dish</h2></div>
                  <div className="builder-panel__header-icon"><Plus size={18} /></div>
                </div>

                {!isAddingItem ? (
                  <button type="button" className="builder-primary-btn" onClick={() => setIsAddingItem(true)}>
                    <Plus size={18} /> Add new menu item
                  </button>
                ) : (
                  <div className="builder-item-editor builder-item-editor--new">
                    <div className="builder-item-editor__header">
                      <div>
                        <strong>New dish</strong>
                        <span>Add details and photo.</span>
                      </div>
                      <button
                        type="button"
                        className="builder-editor-close"
                        onClick={() => {
                          setIsAddingItem(false);
                          setNewItem(createEmptyItem());
                        }}
                        aria-label="Close new item form"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <ItemImageField
                      itemName={newItem.name}
                      image={newItem.image}
                      onUrlChange={(value) => handleNewItemChange('image', value)}
                      onUpload={handleNewItemImageUpload}
                      onClear={clearNewItemImage}
                      uploadLabel="Upload from device"
                    />

                    <div className="builder-item-editor__grid">
                      <label><span>Item name</span><input value={newItem.name} onChange={(event) => handleNewItemChange('name', event.target.value)} placeholder="Paneer tikka wrap" /></label>
                      <label><span>Price</span><input value={newItem.price} onChange={(event) => handleNewItemChange('price', event.target.value)} placeholder="180" /></label>
                      <label><span>Category</span><select value={newItem.category} onChange={(event) => handleNewItemChange('category', event.target.value)}>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                      <label><span>Prep time</span><input type="number" min="1" value={newItem.prepTime} onChange={(event) => handleNewItemChange('prepTime', event.target.value)} /></label>
                      <label><span>Spice level</span><select value={newItem.spiceLevel} onChange={(event) => handleNewItemChange('spiceLevel', event.target.value)}><option value="Mild">Mild</option><option value="Medium">Medium</option><option value="Hot">Hot</option></select></label>
                      <label className="builder-item-editor__grid-wide"><span>Description</span><textarea rows="3" value={newItem.remarks} onChange={(event) => handleNewItemChange('remarks', event.target.value)} placeholder="Describe the taste, ingredients, or serving style" /></label>
                    </div>

                    <div className="builder-toggle-row">
                      <label className="builder-toggle"><input type="checkbox" checked={newItem.featured} onChange={(event) => handleNewItemChange('featured', event.target.checked)} /><span><Star size={14} /> Featured</span></label>
                      <label className="builder-toggle"><input type="checkbox" checked={newItem.isVeg} onChange={(event) => handleNewItemChange('isVeg', event.target.checked)} /><span><Leaf size={14} /> Vegetarian</span></label>
                      <label className="builder-toggle"><input type="checkbox" checked={newItem.available} onChange={(event) => handleNewItemChange('available', event.target.checked)} /><span>Available now</span></label>
                    </div>

                    <div className="builder-action-row">
                      <button type="button" className="builder-primary-btn" onClick={addItemToList}>Save item to draft</button>
                      <button type="button" className="builder-chip builder-chip--ghost" onClick={() => setNewItem(createEmptyItem())}>Reset fields</button>
                    </div>
                  </div>
                )}
              </section>

              <section className="builder-panel builder-step-panel builder-step-panel--2">
                <div className="builder-panel__header">
                  <div>
                    <h2>Current menu</h2>
                    <p>{filteredItems.length} items</p>
                  </div>
                </div>

                <div className="builder-toolbar">
                  <label className="builder-search"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by item, note, or category" /></label>
                  <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}><option value="All">All categories</option>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select>
                  <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}><option value="category">Sort by category</option><option value="price-high">Price high to low</option><option value="price-low">Price low to high</option><option value="featured">Featured first</option></select>
                </div>

                <div className="builder-item-list">
                  {filteredItems.length === 0 ? (
                    <div className="builder-empty-state"><p>No matching items.</p></div>
                  ) : (
                    filteredItems.map((item) => {
                      const originalIndex = items.findIndex((candidate, index) =>
                        index >= 0 &&
                        candidate.name === item.name &&
                        candidate.category === item.category &&
                        candidate.price === item.price &&
                        candidate.image === item.image
                      );

                      return (
                          <article className={`builder-item-editor builder-menu-card ${expandedItem === originalIndex ? 'builder-menu-card--expanded' : ''}`} key={`${item.name}-${originalIndex}`}>
                            <div className="builder-menu-card__summary">
                              <SmartImage
                                src={item.image}
                                alt={item.name || 'Menu item'}
                                className="builder-menu-card__image"
                                fallbackClassName="builder-menu-card__image builder-menu-card__fallback"
                                fallbackContent={<Camera size={22} />}
                              />
                              <div className="builder-menu-card__details">
                                <div className="builder-menu-card__title-row">
                                  <strong>{item.name || 'Untitled item'}</strong>
                                  <b>{formatCurrency(item.price || 0)}</b>
                                </div>
                                <div className="builder-menu-card__meta">
                                  <span>{item.category}</span><span><Clock3 size={13} /> {item.prepTime || 0}m</span>
                                  {item.isVeg && <span className="builder-menu-card__veg"><Leaf size={13} /> Veg</span>}
                                  {item.featured && <span className="builder-menu-card__feature"><Star size={13} /> Featured</span>}
                                </div>
                              </div>
                              <div className="builder-menu-card__actions">
                                <button type="button" className="builder-icon-button" onClick={() => duplicateItem(originalIndex)} aria-label={`Duplicate ${item.name || 'item'}`} title="Duplicate"><Copy size={16} /></button>
                                <button type="button" className="builder-icon-button builder-icon-button--danger" onClick={() => removeItem(originalIndex)} aria-label={`Remove ${item.name || 'item'}`} title="Remove"><Trash2 size={16} /></button>
                                <button type="button" className="builder-expand-button" onClick={() => setExpandedItem(expandedItem === originalIndex ? null : originalIndex)} aria-expanded={expandedItem === originalIndex}>
                                  <span>{expandedItem === originalIndex ? 'Close' : 'Edit'}</span><ChevronDown size={17} />
                                </button>
                              </div>
                            </div>

                            {expandedItem === originalIndex && <div className="builder-menu-card__editor">
                              <div className="builder-item-editor__grid">
                              <label><span>Item name</span><input value={item.name} onChange={(event) => handleItemChange(originalIndex, 'name', event.target.value)} /></label>
                              <label><span>Price</span><input value={item.price} onChange={(event) => handleItemChange(originalIndex, 'price', event.target.value)} /></label>
                              <label><span>Category</span><select value={item.category} onChange={(event) => handleItemChange(originalIndex, 'category', event.target.value)}>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                              <label><span>Prep time</span><input type="number" min="1" value={item.prepTime} onChange={(event) => handleItemChange(originalIndex, 'prepTime', event.target.value)} /></label>
                              <label><span>Spice level</span><select value={item.spiceLevel} onChange={(event) => handleItemChange(originalIndex, 'spiceLevel', event.target.value)}><option value="Mild">Mild</option><option value="Medium">Medium</option><option value="Hot">Hot</option></select></label>
                              <label className="builder-item-editor__grid-wide"><span>Description</span><textarea rows="3" value={item.remarks} onChange={(event) => handleItemChange(originalIndex, 'remarks', event.target.value)} /></label>
                              </div>

                          <ItemImageField
                            itemName={item.name}
                            image={item.image}
                            onUrlChange={(value) => handleItemChange(originalIndex, 'image', value)}
                            onUpload={(event) => handleExistingItemImageUpload(event, originalIndex)}
                            onClear={() => clearExistingItemImage(originalIndex)}
                            uploadLabel="Replace from device"
                          />

                          <div className="builder-item-editor__footer">
                            <div className="builder-toggle-row">
                              <label className="builder-toggle"><input type="checkbox" checked={item.featured} onChange={(event) => handleItemChange(originalIndex, 'featured', event.target.checked)} /><span><Star size={14} /> Featured</span></label>
                              <label className="builder-toggle"><input type="checkbox" checked={item.isVeg} onChange={(event) => handleItemChange(originalIndex, 'isVeg', event.target.checked)} /><span><Leaf size={14} /> Vegetarian</span></label>
                              <label className="builder-toggle"><input type="checkbox" checked={item.available} onChange={(event) => handleItemChange(originalIndex, 'available', event.target.checked)} /><span>Available now</span></label>
                            </div>
                          </div>
                            </div>}
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            <aside className="builder-sidebar builder-step-panel builder-step-panel--4">
              <section className="builder-panel builder-panel--sticky">
                <div className="builder-panel__header">
                  <div>
                    <h2>Publish preview</h2>
                    <p>Final customer view.</p>
                  </div>
                </div>

                <div className="builder-preview-card" style={{ '--builder-brand': shopProfile.brandColor }}>
                  <div className="builder-preview-card__visual">
                    <SmartImage
                      src={shopProfile.logo || previewItems[0]?.image}
                      alt={shopProfile.shopName || 'Shop preview'}
                      className="builder-preview-card__visual-image"
                      fallbackClassName="builder-preview-card__visual-fallback"
                      fallbackContent={<Store size={34} />}
                    />
                  </div>
                  <div className="builder-preview-card__brand">
                    <div className="builder-preview-card__logo">
                      <SmartImage
                        src={shopProfile.logo}
                        alt={shopProfile.shopName || 'Logo'}
                        className="builder-preview-card__logo-image"
                        fallbackClassName="builder-preview-card__logo-fallback"
                        fallbackContent={<Store size={20} />}
                      />
                    </div>
                    <div>
                      <strong>{shopProfile.shopName || 'Your shop name'}</strong>
                      <span>{shopProfile.tagline || 'Add a short tagline.'}</span>
                    </div>
                  </div>

                  <div className="builder-preview-card__meta">
                    <span>{shopProfile.cuisineType || 'Cuisine type'}</span>
                    <span>{shopProfile.openHours || 'Operating hours'}</span>
                  </div>
                </div>

                <div className="builder-checklist">
                  <div><span>Brand profile</span><strong>{shopProfile.shopName ? 'Ready' : 'Needs work'}</strong></div>
                  <div><span>Menu depth</span><strong>{stats.totalItems >= 4 ? 'Strong' : 'Add more items'}</strong></div>
                  <div><span>Spotlight items</span><strong>{stats.featuredItems > 0 ? 'Included' : 'Add featured dishes'}</strong></div>
                </div>

                <div className="builder-mini-list">
                  <h3>First look</h3>
                  {previewItems.length === 0 ? (
                    <p>Add items to preview.</p>
                  ) : (
                    previewItems.map((item) => (
                      <div className="builder-mini-list__item" key={`${item.name}-${item.category}`}>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.category} • {item.prepTime || 0} min</span>
                        </div>
                        <b>{formatCurrency(item.price)}</b>
                      </div>
                    ))
                  )}
                </div>

                <button type="button" className="builder-primary-btn builder-primary-btn--wide" onClick={handleSubmit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <LoaderCircle size={18} className="builder-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Save and publish menu
                    </>
                  )}
                </button>
              </section>
            </aside>

            {deleteConfirm && (
              <div className="builder-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                <div className="builder-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="builder-modal__header">
                    <AlertCircle size={24} style={{ color: '#ef4444' }} />
                    <h3>Remove item?</h3>
                  </div>
                  <p className="builder-modal__message">
                    Are you sure you want to remove <strong>"{deleteConfirm.itemName}"</strong> from the menu? This action cannot be undone.
                  </p>
                  <div className="builder-modal__actions">
                    <button
                      type="button"
                      className="builder-chip builder-chip--ghost"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button
                      type="button"
                      className="builder-chip builder-chip--danger"
                      onClick={confirmDelete}
                    >
                      <Trash2 size={16} /> Remove item
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="builder-wizard-actions">
            <button type="button" className="builder-chip builder-chip--ghost" onClick={() => goToStep(activeStep - 1)} disabled={activeStep === 1}>
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <span>Step {activeStep} of 4</span>
              <strong>{steps[activeStep - 1].label}</strong>
            </div>
            {activeStep < 4 && (
              <button type="button" className="builder-primary-btn" onClick={() => goToStep(activeStep + 1)}>
                {activeStep === 3 ? 'Review menu' : 'Continue'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuBuilder;
