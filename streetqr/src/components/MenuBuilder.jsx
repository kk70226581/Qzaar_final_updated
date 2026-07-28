import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  UtensilsCrossed,
  CheckCircle,
  Check,
  Rocket
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
  brandColor: '#4f46e5'
};

const demoItems = [
  // === BREAKFAST ===
  { name: 'Masala Dosa', price: '150', remarks: 'Crisp rice crepe filled with spiced potato masala, served with sambar and chutneys.', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=900&q=80', prepTime: 13, spiceLevel: 'Medium', featured: true, isVeg: true, available: true },
  { name: 'Chole Bhature', price: '170', remarks: 'Fluffy deep-fried bread with richly spiced chickpea curry and pickle.', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80', prepTime: 15, spiceLevel: 'Hot', featured: true, isVeg: true, available: true },
  { name: 'Aloo Paratha', price: '110', remarks: 'Stuffed whole-wheat flatbread with spiced potato, yogurt, and pickle.', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80', prepTime: 12, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },
  { name: 'Poha', price: '80', remarks: 'Light flattened rice with peanuts, curry leaves, and a squeeze of lemon.', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=900&q=80', prepTime: 8, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },

  // === LUNCH ===
  { name: 'Tandoori Paneer Wrap', price: '180', remarks: 'Creamy mint chutney, onions, and smoky paneer tikka in a soft wrap.', category: 'Lunch', image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=80', prepTime: 14, spiceLevel: 'Medium', featured: true, isVeg: true, available: true },
  { name: 'Veg Biryani', price: '280', remarks: 'Fragrant basmati rice with seasonal vegetables, herbs, and fried onions.', category: 'Lunch', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80', prepTime: 18, spiceLevel: 'Medium', featured: false, isVeg: true, available: true },
  { name: 'Veg Hakka Noodles', price: '220', remarks: 'Wok-tossed noodles with crunchy vegetables and aromatic herbs.', category: 'Lunch', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80', prepTime: 15, spiceLevel: 'Medium', featured: false, isVeg: true, available: true },
  { name: 'Paneer Tikka', price: '280', remarks: 'Chargrilled cottage cheese with peppers and smoky tandoori spices.', category: 'Lunch', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80', prepTime: 16, spiceLevel: 'Medium', featured: true, isVeg: true, available: true },

  // === DINNER ===
  { name: 'Butter Chicken', price: '390', remarks: 'Tandoori chicken in a silky tomato-butter gravy — our bestseller.', category: 'Dinner', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80', prepTime: 20, spiceLevel: 'Medium', featured: true, isVeg: false, available: true },
  { name: 'Dal Makhani', price: '240', remarks: 'Slow-simmered black lentils finished with butter and cream.', category: 'Dinner', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80', prepTime: 15, spiceLevel: 'Mild', featured: true, isVeg: true, available: true },
  { name: 'Kadai Paneer', price: '270', remarks: 'Paneer and peppers in a bold tomato-coriander masala.', category: 'Dinner', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', prepTime: 17, spiceLevel: 'Hot', featured: false, isVeg: true, available: true },
  { name: 'Chicken Biryani', price: '350', remarks: 'Aromatic basmati rice layered with tender spiced chicken.', category: 'Dinner', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80', prepTime: 22, spiceLevel: 'Medium', featured: true, isVeg: false, available: true },
  { name: 'Garlic Naan', price: '65', remarks: 'Tandoor-baked bread brushed with aromatic garlic butter.', category: 'Dinner', image: 'https://images.unsplash.com/photo-1601050690294-397f3c324515?auto=format&fit=crop&w=900&q=80', prepTime: 6, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },

  // === SNACKS ===
  { name: 'Pani Puri Platter', price: '120', remarks: 'Crisp puris with tangy tamarind and spicy mint water.', category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', prepTime: 8, spiceLevel: 'Medium', featured: true, isVeg: true, available: true },
  { name: 'Samosa Chaat', price: '110', remarks: 'Crushed samosa, curd, chutneys, and fresh sev.', category: 'Snacks', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80', prepTime: 9, spiceLevel: 'Medium', featured: false, isVeg: true, available: true },
  { name: 'Butter Kulhad Pasta', price: '190', remarks: 'A crowd favorite fusion dish served in a clay cup.', category: 'Snacks', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=900&q=80', prepTime: 11, spiceLevel: 'Hot', featured: true, isVeg: true, available: true },
  { name: 'Pav Bhaji', price: '160', remarks: 'Buttery spiced vegetable mash served with toasted pav buns.', category: 'Snacks', image: 'https://images.unsplash.com/photo-1606491048802-8342506d6471?auto=format&fit=crop&w=900&q=80', prepTime: 14, spiceLevel: 'Medium', featured: true, isVeg: true, available: true },

  // === BEVERAGES ===
  { name: 'Masala Lemon Soda', price: '60', remarks: 'Fresh lemon, black salt, mint, and chilled soda.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', prepTime: 4, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },
  { name: 'Mango Lassi', price: '90', remarks: 'Thick mango yogurt cooler with a hint of cardamom.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80', prepTime: 4, spiceLevel: 'Mild', featured: true, isVeg: true, available: true },
  { name: 'Cold Coffee', price: '120', remarks: 'Cold brewed coffee blended with milk, ice, and cream.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', prepTime: 5, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },
  { name: 'Masala Chai', price: '40', remarks: 'Freshly brewed tea with ginger, cardamom, and warming spices.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80', prepTime: 3, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },

  // === DESSERTS ===
  { name: 'Gulab Jamun', price: '100', remarks: 'Warm milk-solid dumplings soaked in rose-cardamom syrup.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1666190092481-b94f1ee4bfbf?auto=format&fit=crop&w=900&q=80', prepTime: 5, spiceLevel: 'Mild', featured: true, isVeg: true, available: true },
  { name: 'Sizzling Brownie', price: '180', remarks: 'Warm chocolate brownie with vanilla ice cream and chocolate sauce.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', prepTime: 8, spiceLevel: 'Mild', featured: true, isVeg: true, available: true },
  { name: 'Kulfi Falooda', price: '140', remarks: 'Creamy kulfi layered with vermicelli, rose syrup, and nuts.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=80', prepTime: 6, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },
  { name: 'Rasmalai', price: '120', remarks: 'Soft cheese patties in saffron milk with pistachios.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1595246140625-5736f7c1a74c?auto=format&fit=crop&w=900&q=80', prepTime: 5, spiceLevel: 'Mild', featured: false, isVeg: true, available: true },
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
            </>
          }
        />
      </div>

      <div className="builder-image-field__body">
        <label className="builder-image-field__label">
          Image URL
        </label>
        <input className="builder-input" value={image} onChange={(event) => onUrlChange(event.target.value)} placeholder="Paste a direct image URL" />
        <div className="builder-image-field__actions" style={{ marginTop: '0.5rem' }}>
          <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0 0.5rem', height: '32px' }}>
            <ImagePlus size={14} />
            {uploadLabel}
            <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
          </label>
          <button type="button" className="btn btn-ghost" style={{ padding: '0 0.5rem', height: '32px' }} onClick={onClear}>
            <ImageOff size={14} /> Remove
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
      try {
        const response = await axios.get(`${API_BASE}/api/coupons/${shopId}`);
        if (response.data.success) {
          setCoupons(response.data.coupons || []);
        }
      } catch (error) {
        showMessage('danger', 'Unable to load campaign offers right now.');
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
    if (!file) return;
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
    if (!file) return;
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
    if (!file) return;
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
        code, discountType: couponForm.discountType, discountValue,
        minOrderValue, maxDiscount, validFrom: couponForm.validFrom,
        validTill: couponForm.validTill, description: couponForm.description.trim()
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
    { id: 1, label: 'Brand', hint: 'Your identity', icon: Store },
    { id: 2, label: 'Menu', hint: 'Your dishes', icon: UtensilsCrossed },
    { id: 3, label: 'Offers', hint: 'Discount codes', icon: BadgePercent },
    { id: 4, label: 'Publish', hint: 'Go live', icon: Sparkles }
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
        name: item.name, price: item.price, remarks: item.remarks,
        image: item.image, prepTime: Number(item.prepTime) || 0,
        spiceLevel: item.spiceLevel, featured: Boolean(item.featured),
        isVeg: Boolean(item.isVeg), available: item.available !== false
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

  const stepVariants = {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { x: -40, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }
  };

  return (
    <>
      <Navbar showAuthLinks={false} />
      <div className="builder-shell">
        
        {/* HEADER BAR */}
        <header className="builder-header">
          <div className="builder-header__left">
            <div className="builder-header__logo">Q</div>
            <span className="builder-header__title">Menu Builder</span>
            <span className="builder-header__step-indicator">Step {activeStep} of 4</span>
          </div>
          <div className="builder-header__right">
            <div className="builder-stats-row">
              <span>{stats.totalItems} Items</span>
              <span className="builder-score-badge">{stats.readinessScore}% Ready</span>
            </div>
            <button className="builder-logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="builder-container">
          {statusMessage && (
            <div className={`builder-alert builder-alert--${statusMessage.type}`}>
              {statusMessage.type === 'danger' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {statusMessage.text}
            </div>
          )}

          {/* STEP WIZARD */}
          <div className="builder-stepper">
            <div className="builder-stepper__line">
              <div className="builder-stepper__progress" style={{ width: `${((activeStep - 1) / 3) * 100}%` }}></div>
            </div>
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`builder-step-item ${activeStep === step.id ? 'builder-step-item--active' : ''} ${activeStep > step.id ? 'builder-step-item--done' : ''}`}
                  onClick={() => goToStep(step.id)}
                >
                  <div className="builder-step-circle">
                    {activeStep > step.id ? <Check size={24} /> : step.id}
                  </div>
                  <div className="builder-step-label">
                    <div className="builder-step-title"><Icon size={14} /> {step.label}</div>
                    <div className="builder-step-hint">{step.hint}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="builder-step-content">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: BRAND */}
              {activeStep === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="builder-grid-2col">
                  
                  {/* Left Column */}
                  <div>
                    <div className="builder-card">
                      <div className="builder-card-header">
                        <Store size={24} color="#4f46e5" />
                        <h2>Restaurant Identity</h2>
                      </div>
                      
                      <div className="builder-form-grid">
                        <div className="builder-input-group builder-form-col-full">
                          <label>Shop name</label>
                          <input className="builder-input" value={shopProfile.shopName} onChange={(e) => handleProfileChange('shopName', e.target.value)} placeholder="e.g. Kashi Chaat Corner" />
                        </div>
                        <div className="builder-input-group">
                          <label>Cuisine</label>
                          <input className="builder-input" value={shopProfile.cuisineType} onChange={(e) => handleProfileChange('cuisineType', e.target.value)} placeholder="Street Food, Cafe..." />
                        </div>
                        <div className="builder-input-group">
                          <label>Phone</label>
                          <input className="builder-input" value={shopProfile.contactPhone} onChange={(e) => handleProfileChange('contactPhone', e.target.value)} placeholder="+91 ..." />
                        </div>
                        <div className="builder-input-group builder-form-col-full">
                          <label>Tagline</label>
                          <input className="builder-input" value={shopProfile.tagline} onChange={(e) => handleProfileChange('tagline', e.target.value)} placeholder="Fresh food, made your way" />
                        </div>
                      </div>
                    </div>

                    <div className="builder-card">
                      <div className="builder-card-header">
                        <Sparkles size={24} color="#4f46e5" />
                        <h2>Visual & Content</h2>
                      </div>
                      <div className="builder-form-grid">
                        <div className="builder-input-group builder-form-col-full">
                          <label>Brand Color</label>
                          <div className="builder-color-picker">
                            <input type="color" className="builder-color-swatch" value={shopProfile.brandColor} onChange={(e) => handleProfileChange('brandColor', e.target.value)} />
                            <input className="builder-input" value={shopProfile.brandColor} onChange={(e) => handleProfileChange('brandColor', e.target.value)} placeholder="#4f46e5" />
                          </div>
                        </div>
                        <div className="builder-input-group builder-form-col-full">
                          <label>Cover Image (Logo)</label>
                          <label className="builder-dropzone">
                            <ImagePlus size={32} />
                            <span>Click to upload image</span>
                            <input type="file" accept="image/*" onChange={(e) => handleProfileImageUpload(e, 'logo')} />
                          </label>
                          <input className="builder-input" style={{ marginTop: '0.5rem' }} value={shopProfile.logo} onChange={(e) => handleProfileChange('logo', e.target.value)} placeholder="Or paste image URL" />
                        </div>
                        <div className="builder-input-group builder-form-col-full">
                          <label>Open Hours</label>
                          <input className="builder-input" value={shopProfile.openHours} onChange={(e) => handleProfileChange('openHours', e.target.value)} placeholder="11 AM - 11 PM" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Live Preview) */}
                  <div>
                    <div className="builder-live-preview">
                      <div className="builder-preview-accent" style={{ background: shopProfile.brandColor }}></div>
                      <div className="builder-preview-content">
                        <SmartImage 
                          src={shopProfile.logo} 
                          alt="Logo" 
                          className="builder-preview-logo" 
                          fallbackClassName="builder-preview-logo"
                          fallbackContent={<Store size={32} color="#94a3b8" />}
                        />
                        <h3 className="builder-preview-name">{shopProfile.shopName || 'Your Shop Name'}</h3>
                        {shopProfile.cuisineType && <div className="builder-preview-cuisine">{shopProfile.cuisineType}</div>}
                        <div className="builder-preview-tagline">{shopProfile.tagline || 'Your catchy tagline goes here.'}</div>
                        <div className="builder-preview-meta">
                          {shopProfile.openHours && <span><Clock3 size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/>{shopProfile.openHours}</span>}
                        </div>
                      </div>
                      <div className="builder-quick-actions">
                        <button className="btn btn-ghost" onClick={loadDemoMenu}><Sparkles size={16}/> Sample</button>
                        <button className="btn btn-ghost" onClick={restoreDraft}><Copy size={16}/> Restore</button>
                        <button className="btn btn-ghost" onClick={clearDraft}><Trash2 size={16}/> Clear</button>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* STEP 2: MENU */}
              {activeStep === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                  <div className="builder-toolbar">
                    <div className="builder-search-wrapper">
                      <Search size={18} color="#64748b" />
                      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search dishes..." />
                    </div>
                    <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                      <option value="All">All Categories</option>
                      {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                      <option value="category">Sort by category</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="featured">Featured first</option>
                    </select>
                    
                    {/* Add Item Desktop Button */}
                    <button className="btn btn-primary" style={{ display: window.innerWidth > 900 ? 'flex' : 'none' }} onClick={() => setIsAddingItem(true)}>
                      <Plus size={18} /> Add Dish
                    </button>
                  </div>

                  {/* Add Item FAB (Mobile) */}
                  <button className="btn btn-primary fab-btn" style={{ display: window.innerWidth <= 900 ? 'flex' : 'none' }} onClick={() => setIsAddingItem(true)}>
                    <Plus size={20} /> Add Dish
                  </button>

                  <div className="builder-menu-grid">
                    {filteredItems.length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>No dishes found.</div>
                    ) : (
                      filteredItems.map((item) => {
                        const originalIndex = items.findIndex((c, i) => c.name === item.name && c.category === item.category && c.price === item.price);
                        return (
                          <div className="builder-menu-card" key={`${item.name}-${originalIndex}`}>
                            <SmartImage 
                              src={item.image} 
                              alt={item.name} 
                              className="builder-menu-card__image"
                              fallbackClassName="builder-menu-card__image"
                              fallbackContent={<div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',background:'#f1f5f9'}}><Camera size={24} color="#94a3b8"/></div>}
                            />
                            <div className="builder-menu-card__content">
                              <div className="builder-menu-card__header">
                                <h4 className="builder-menu-card__title">{item.name || 'Untitled'}</h4>
                                <span className="builder-menu-card__price">{formatCurrency(item.price)}</span>
                              </div>
                              <div className="builder-menu-card__badges">
                                <span className="builder-badge builder-badge--category">{item.category}</span>
                                {item.isVeg && <span className="builder-badge builder-badge--veg">Veg</span>}
                                {item.featured && <span className="builder-badge builder-badge--featured" style={{background:'#fffbeb', color:'#d97706', border:'1px solid #fde68a'}}>Featured</span>}
                              </div>
                              <div className="builder-menu-card__meta">
                                <span><Clock3 size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/>{item.prepTime}m</span>
                                <div style={{flex: 1}}></div>
                                <div className={`builder-status-dot ${item.available ? 'active' : 'inactive'}`}></div>
                                <span>{item.available ? 'Available' : 'Unavailable'}</span>
                              </div>
                              <div className="builder-menu-card__actions">
                                <button className="btn btn-icon" onClick={() => duplicateItem(originalIndex)} title="Duplicate"><Copy size={16}/></button>
                                <button className="btn btn-icon" onClick={() => setExpandedItem(expandedItem === originalIndex ? null : originalIndex)} title="Edit">
                                  {expandedItem === originalIndex ? <ChevronDown size={16}/> : <span style={{fontSize:'0.875rem', fontWeight:600, padding:'0 0.5rem', width:'auto'}}>Edit</span>}
                                </button>
                                <button className="btn btn-icon danger" style={{marginLeft:'auto'}} onClick={() => removeItem(originalIndex)} title="Delete"><Trash2 size={16}/></button>
                              </div>
                              
                              {/* In-place editor */}
                              {expandedItem === originalIndex && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                  <div className="builder-form-grid" style={{ gap: '1rem' }}>
                                    <div className="builder-input-group builder-form-col-full">
                                      <label>Name</label>
                                      <input className="builder-input" value={item.name} onChange={(e) => handleItemChange(originalIndex, 'name', e.target.value)} />
                                    </div>
                                    <div className="builder-input-group">
                                      <label>Price</label>
                                      <input className="builder-input" value={item.price} onChange={(e) => handleItemChange(originalIndex, 'price', e.target.value)} />
                                    </div>
                                    <div className="builder-input-group">
                                      <label>Category</label>
                                      <select className="builder-input" value={item.category} onChange={(e) => handleItemChange(originalIndex, 'category', e.target.value)}>
                                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                      </select>
                                    </div>
                                    <div className="builder-input-group builder-form-col-full">
                                      <ItemImageField
                                        itemName={item.name}
                                        image={item.image}
                                        onUrlChange={(val) => handleItemChange(originalIndex, 'image', val)}
                                        onUpload={(e) => handleExistingItemImageUpload(e, originalIndex)}
                                        onClear={() => clearExistingItemImage(originalIndex)}
                                        uploadLabel="Upload"
                                      />
                                    </div>
                                    <div className="builder-input-group builder-form-col-full">
                                      <label>Description</label>
                                      <textarea className="builder-input" rows="2" value={item.remarks} onChange={(e) => handleItemChange(originalIndex, 'remarks', e.target.value)}></textarea>
                                    </div>
                                    <div className="builder-pill-toggles builder-form-col-full">
                                      <label className={`builder-pill-toggle ${item.featured ? 'active' : ''}`}>
                                        <input type="checkbox" checked={item.featured} onChange={(e) => handleItemChange(originalIndex, 'featured', e.target.checked)} />
                                        <Star size={14} /> Featured
                                      </label>
                                      <label className={`builder-pill-toggle ${item.isVeg ? 'active' : ''}`}>
                                        <input type="checkbox" checked={item.isVeg} onChange={(e) => handleItemChange(originalIndex, 'isVeg', e.target.checked)} />
                                        <Leaf size={14} /> Veg
                                      </label>
                                      <label className={`builder-pill-toggle ${item.available ? 'active' : ''}`}>
                                        <input type="checkbox" checked={item.available} onChange={(e) => handleItemChange(originalIndex, 'available', e.target.checked)} />
                                        Available
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: OFFERS */}
              {activeStep === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="builder-grid-offers">
                  <div>
                    <div className="builder-card">
                      <div className="builder-card-header">
                        <BadgePercent size={24} color="#4f46e5" />
                        <h2>Create Coupon</h2>
                      </div>
                      
                      <div className="builder-coupon-preview">
                        <div>PREVIEW</div>
                        <div className="builder-coupon-code">{couponForm.code || 'CODE'}</div>
                        <div className="builder-coupon-val">
                          {couponForm.discountType === 'percentage' ? `${couponForm.discountValue || 0}% OFF` : `${formatCurrency(couponForm.discountValue)} OFF`}
                        </div>
                      </div>

                      <div className="builder-form-grid">
                        <div className="builder-input-group">
                          <label>Code</label>
                          <input className="builder-input" value={couponForm.code} onChange={(e) => handleCouponFormChange('code', e.target.value.toUpperCase())} placeholder="SUMMER10" />
                        </div>
                        <div className="builder-input-group">
                          <label>Type</label>
                          <select className="builder-input" value={couponForm.discountType} onChange={(e) => handleCouponFormChange('discountType', e.target.value)}>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                          </select>
                        </div>
                        <div className="builder-input-group">
                          <label>Value</label>
                          <input className="builder-input" type="number" value={couponForm.discountValue} onChange={(e) => handleCouponFormChange('discountValue', e.target.value)} />
                        </div>
                        <div className="builder-input-group">
                          <label>Min Order</label>
                          <input className="builder-input" type="number" value={couponForm.minOrderValue} onChange={(e) => handleCouponFormChange('minOrderValue', e.target.value)} />
                        </div>
                        <div className="builder-input-group">
                          <label>Valid From</label>
                          <input className="builder-input" type="date" value={couponForm.validFrom} onChange={(e) => handleCouponFormChange('validFrom', e.target.value)} />
                        </div>
                        <div className="builder-input-group">
                          <label>Valid Till</label>
                          <input className="builder-input" type="date" value={couponForm.validTill} onChange={(e) => handleCouponFormChange('validTill', e.target.value)} />
                        </div>
                        <div className="builder-input-group builder-form-col-full">
                          <label>Description</label>
                          <textarea className="builder-input" rows="2" value={couponForm.description} onChange={(e) => handleCouponFormChange('description', e.target.value)} placeholder="E.g. Valid on all orders above Rs 199" />
                        </div>
                        <div className="builder-form-col-full" style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
                          <button className="btn btn-primary" onClick={handleCreateCoupon} disabled={isSavingCoupon} style={{flex: 1}}>
                            {isSavingCoupon ? 'Saving...' : 'Create Offer'}
                          </button>
                          <button className="btn btn-secondary" onClick={() => setCouponForm(createCouponDraft())}>Reset</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="builder-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                      <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Active Offers</h3>
                      {activeCoupons.length === 0 ? (
                        <div style={{ color: '#64748b' }}>No active offers yet.</div>
                      ) : (
                        activeCoupons.map((c, i) => (
                          <div className={`builder-ticket ${c.discountType}`} key={i}>
                            <div className="builder-ticket-content">
                              <h4 className="builder-ticket-code">{c.code}</h4>
                              <p className="builder-ticket-desc">{c.description || 'Valid offer'}</p>
                              <div className="builder-ticket-meta">
                                <span>Min: {formatCurrency(c.minOrderValue)}</span>
                                <span>Till: {new Date(c.validTill).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div style={{fontWeight: 700, color: c.discountType === 'percentage' ? '#16a34a' : '#4f46e5', fontSize: '1.1rem'}}>
                              {c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PUBLISH */}
              {activeStep === 4 && (
                <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="builder-grid-publish">
                  <div>
                    <div className="builder-card">
                      <div className="builder-card-header">
                        <CheckCircle size={24} color="#4f46e5" />
                        <h2>Readiness</h2>
                      </div>
                      <div className="builder-readiness-widget">
                        <div className="builder-progress-circle">
                          <svg className="builder-progress-svg" viewBox="0 0 80 80">
                            <circle className="builder-progress-bg" cx="40" cy="40" r="32" />
                            <circle className="builder-progress-bar" cx="40" cy="40" r="32" style={{ strokeDashoffset: 200 - (200 * stats.readinessScore) / 100 }} />
                          </svg>
                          <div className="builder-progress-text">{stats.readinessScore}%</div>
                        </div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Menu Score</div>
                      </div>
                      
                      <div className="builder-checklist">
                        <div className={`builder-check-item ${shopProfile.shopName ? 'ready' : 'warning'}`}>
                          {shopProfile.shopName ? <CheckCircle size={20} color="#16a34a" /> : <AlertCircle size={20} color="#ca8a04" />}
                          <span className="builder-check-text">Brand Profile</span>
                        </div>
                        <div className={`builder-check-item ${stats.totalItems >= 4 ? 'ready' : 'warning'}`}>
                          {stats.totalItems >= 4 ? <CheckCircle size={20} color="#16a34a" /> : <AlertCircle size={20} color="#ca8a04" />}
                          <span className="builder-check-text">{stats.totalItems} Items Added</span>
                        </div>
                        <div className={`builder-check-item ${stats.featuredItems > 0 ? 'ready' : 'warning'}`}>
                          {stats.featuredItems > 0 ? <CheckCircle size={20} color="#16a34a" /> : <AlertCircle size={20} color="#ca8a04" />}
                          <span className="builder-check-text">Featured Dishes</span>
                        </div>
                      </div>

                      <button className="btn btn-primary builder-publish-btn" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? <><LoaderCircle className="builder-spin" size={20}/> Publishing...</> : <><Rocket size={20}/> Publish Menu</>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="builder-phone-mockup">
                      <div className="builder-phone-header" style={{ backgroundImage: `url(${shopProfile.logo || previewItems[0]?.image})` }}>
                        <div className="builder-phone-title">{shopProfile.shopName || 'Your Shop'}</div>
                      </div>
                      <div className="builder-phone-body">
                        {previewItems.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No items added yet.</div>
                        ) : (
                          previewItems.map((item, idx) => (
                            <div className="builder-phone-item" key={idx}>
                              <img src={item.image} alt={item.name} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category}</div>
                                <div style={{ fontWeight: 700, color: shopProfile.brandColor, marginTop: '0.25rem' }}>{formatCurrency(item.price)}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="builder-footer">
          <button className="btn btn-secondary" onClick={() => goToStep(activeStep - 1)} disabled={activeStep === 1}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="builder-footer-info">
            <span>Step {activeStep} of 4</span>
            <strong>{steps[activeStep - 1].label}</strong>
          </div>

          {activeStep < 4 ? (
            <button className="btn btn-primary" onClick={() => goToStep(activeStep + 1)}>
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSaving}>
              <Rocket size={18} /> Publish
            </button>
          )}
        </div>

        {/* Add Item Modal Overlay */}
        {isAddingItem && (
          <div className="builder-modal-overlay" onClick={() => setIsAddingItem(false)}>
            <div className="builder-modal-panel" onClick={(e) => e.stopPropagation()}>
              <div className="builder-modal-header">
                <h3>Add Dish</h3>
                <button className="btn btn-icon" onClick={() => setIsAddingItem(false)}><X size={20} /></button>
              </div>
              <div className="builder-form-grid" style={{ gap: '1.25rem' }}>
                <div className="builder-input-group builder-form-col-full">
                  <ItemImageField
                    itemName={newItem.name}
                    image={newItem.image}
                    onUrlChange={(val) => handleNewItemChange('image', val)}
                    onUpload={handleNewItemImageUpload}
                    onClear={clearNewItemImage}
                    uploadLabel="Upload Image"
                  />
                </div>
                <div className="builder-input-group builder-form-col-full">
                  <label>Name</label>
                  <input className="builder-input" value={newItem.name} onChange={(e) => handleNewItemChange('name', e.target.value)} placeholder="Paneer Tikka" />
                </div>
                <div className="builder-input-group">
                  <label>Price</label>
                  <input className="builder-input" value={newItem.price} onChange={(e) => handleNewItemChange('price', e.target.value)} placeholder="180" />
                </div>
                <div className="builder-input-group">
                  <label>Category</label>
                  <select className="builder-input" value={newItem.category} onChange={(e) => handleNewItemChange('category', e.target.value)}>
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="builder-input-group">
                  <label>Prep Time (min)</label>
                  <input type="number" className="builder-input" value={newItem.prepTime} onChange={(e) => handleNewItemChange('prepTime', e.target.value)} />
                </div>
                <div className="builder-input-group">
                  <label>Spice Level</label>
                  <select className="builder-input" value={newItem.spiceLevel} onChange={(e) => handleNewItemChange('spiceLevel', e.target.value)}>
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Hot">Hot</option>
                  </select>
                </div>
                <div className="builder-input-group builder-form-col-full">
                  <label>Description</label>
                  <textarea className="builder-input" rows="2" value={newItem.remarks} onChange={(e) => handleNewItemChange('remarks', e.target.value)} placeholder="Describe the dish..." />
                </div>
                <div className="builder-pill-toggles builder-form-col-full">
                  <label className={`builder-pill-toggle ${newItem.featured ? 'active' : ''}`}>
                    <input type="checkbox" checked={newItem.featured} onChange={(e) => handleNewItemChange('featured', e.target.checked)} />
                    <Star size={14} /> Featured
                  </label>
                  <label className={`builder-pill-toggle ${newItem.isVeg ? 'active' : ''}`}>
                    <input type="checkbox" checked={newItem.isVeg} onChange={(e) => handleNewItemChange('isVeg', e.target.checked)} />
                    <Leaf size={14} /> Veg
                  </label>
                  <label className={`builder-pill-toggle ${newItem.available ? 'active' : ''}`}>
                    <input type="checkbox" checked={newItem.available} onChange={(e) => handleNewItemChange('available', e.target.checked)} />
                    Available
                  </label>
                </div>
                <div className="builder-form-col-full" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, height: '48px' }} onClick={addItemToList}>Save Item</button>
                  <button className="btn btn-secondary" style={{ height: '48px' }} onClick={() => setNewItem(createEmptyItem())}>Reset</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="builder-dialog-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="builder-dialog" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <AlertCircle size={32} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Delete Item?</h3>
              </div>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>
                Are you sure you want to remove <strong>"{deleteConfirm.itemName}"</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ background: '#dc2626' }} onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MenuBuilder;
