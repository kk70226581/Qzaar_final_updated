import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BadgePercent,
  Bell,
  ChefHat,
  Clock3,
  CreditCard,
  Flame,
  ImageOff,
  Heart,
  Leaf,
  MapPin,
  Moon,
  Phone,
  Plus,
  Search,
  Sun,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  X
} from 'lucide-react';
import PaymentGateway from './PaymentGateway';
import CouponApplier from './CouponApplier';
import { createOrder, getMenu } from '../api';
import './MenuView.css';

const paymentOptions = [
  { id: 'cash', label: 'Pay at counter', description: 'Cash on delivery or counter payment', icon: Wallet },
  { id: 'razorpay', label: 'Pay Online', description: 'Card, UPI, Net Banking via Razorpay', icon: CreditCard }
];

const FAVORITES_STORAGE_PREFIX = 'streetqr:favorites:';
const PROFILE_STORAGE_PREFIX = 'streetqr:profile:';

const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;

const getEstimatedPrepMinutes = (selectedItems) => {
  if (!selectedItems.length) {
    return 0;
  }

  return selectedItems.reduce((maxTime, item) => Math.max(maxTime, Number(item.prepTime) || 10), 0);
};

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

function MenuView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState({});
  const [shop, setShop] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [dietFilter, setDietFilter] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [theme, setTheme] = useState(() => window.localStorage.getItem('qzaar-theme') || 'light');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem('qzaar-recent-searches') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    setIsLoading(true);
    setError('');

    getMenu(id)
      .then((response) => {
        if (!response.data.success) {
          setError(response.data.message || 'Failed to load menu. Please try again.');
          return;
        }

        setMenuData(response.data.menu || {});
        setShop({
          shopName: response.data.shopName,
          ownerName: response.data.ownerName,
          tagline: response.data.tagline,
          cuisineType: response.data.cuisineType,
          contactPhone: response.data.contactPhone,
          logo: response.data.logo,
          openHours: response.data.openHours,
          address: response.data.address,
          brandColor: response.data.brandColor || '#f97316'
        });
      })
      .catch(() => setError('Failed to load menu. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    const scannedTable = new URLSearchParams(window.location.search).get('table');
    if (scannedTable) setTableNumber(scannedTable);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('qzaar-theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedFavorites = window.localStorage.getItem(`${FAVORITES_STORAGE_PREFIX}${id}`);
    const savedProfile = window.localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${id}`);

    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch {
        setFavorites(new Set());
      }
    }

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCustomerName(profile.customerName || '');
        setTableNumber(profile.tableNumber || '');
        setCustomerPhone(profile.customerPhone || '');
        setCustomerEmail(profile.customerEmail || '');
      } catch {
        // Ignore malformed saved profile data.
      }
    }
  }, [id]);

  useEffect(() => {
    window.localStorage.setItem(`${FAVORITES_STORAGE_PREFIX}${id}`, JSON.stringify(Array.from(favorites)));
  }, [favorites, id]);

  useEffect(() => {
    window.localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${id}`, JSON.stringify({
      customerName,
      tableNumber,
      customerPhone,
      customerEmail
    }));
  }, [customerEmail, customerName, customerPhone, id, tableNumber]);

  const categories = useMemo(() => ['All', ...Object.keys(menuData || {})], [menuData]);

  const flatItems = useMemo(() => (
    Object.entries(menuData || {}).flatMap(([category, items]) =>
      (items || []).map((item) => ({ ...item, category }))
    )
  ), [menuData]);

  const availableItems = useMemo(
    () => flatItems.filter((item) => item.available !== false),
    [flatItems]
  );

  const featuredItems = useMemo(
    () => availableItems.filter((item) => item.featured),
    [availableItems]
  );

  const highlightedItems = useMemo(() => {
    if (featuredItems.length) {
      return featuredItems.slice(0, 3);
    }

    return [...availableItems]
      .sort((left, right) => (Number(right.discount) || 0) - (Number(left.discount) || 0))
      .slice(0, 3);
  }, [availableItems, featuredItems]);

  const visibleItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return flatItems.filter((item) => {
      const matchesSearch = !query || [item.name, item.remarks, item.category]
        .some((value) => String(value || '').toLowerCase().includes(query));
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesFeatured = !featuredOnly || item.featured;
      const matchesFavorites = !favoritesOnly || favorites.has(item.name);
      const matchesDiet = dietFilter === 'all'
        || (dietFilter === 'veg' && item.isVeg)
        || (dietFilter === 'spicy' && String(item.spiceLevel).toLowerCase() === 'hot')
        || (dietFilter === 'quick' && Number(item.prepTime || 10) <= 15);

      return matchesSearch && matchesCategory && matchesFeatured && matchesFavorites && matchesDiet;
    });
  }, [activeCategory, dietFilter, favorites, favoritesOnly, featuredOnly, flatItems, searchTerm]);

  const groupedVisibleItems = useMemo(() => {
    const grouped = {};
    visibleItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [visibleItems]);

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return flatItems
      .filter((item) => [item.name, item.category, item.remarks]
        .some((value) => String(value || '').toLowerCase().includes(query)))
      .slice(0, 5);
  }, [flatItems, searchTerm]);

  const chooseSearch = (value) => {
    setSearchTerm(value);
    setSearchFocused(false);
    setRecentSearches((current) => {
      const next = [value, ...current.filter((entry) => entry !== value)].slice(0, 5);
      window.localStorage.setItem('qzaar-recent-searches', JSON.stringify(next));
      return next;
    });
  };

  const requestService = (service) => {
    if (!tableNumber.trim()) {
      toast.error('Add your table number before requesting service.');
      setIsCartOpen(true);
      return;
    }
    toast.success(`${service} request sent for table ${tableNumber}.`);
  };

  const getItemQuantity = (itemName) => selectedItems.find((item) => item.name === itemName)?.quantity || 0;
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const taxes = Math.round(subtotal * 0.05 * 100) / 100;
  const safeDiscountAmount = Math.min(discountAmount, subtotal);
  const finalAmount = Math.max(subtotal - safeDiscountAmount + taxes, 0);
  const estimatedPrepMinutes = getEstimatedPrepMinutes(selectedItems);
  const averagePrepTime = availableItems.length
    ? Math.round(availableItems.reduce((sum, item) => sum + (Number(item.prepTime) || 10), 0) / availableItems.length)
    : 0;
  const heroImage = shop.logo || highlightedItems[0]?.image || availableItems[0]?.image || '';
  const topCategory = useMemo(() => {
    const counts = Object.entries(menuData || {}).map(([category, items]) => ({
      category,
      count: (items || []).filter((item) => item.available !== false).length
    }));
    return counts.sort((left, right) => right.count - left.count)[0]?.category || 'Chef specials';
  }, [menuData]);

  useEffect(() => {
    if (discountAmount > subtotal) {
      setDiscountAmount(subtotal);
    }

    if (!selectedItems.length && appliedCoupon) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [appliedCoupon, discountAmount, selectedItems.length, subtotal]);

  const addToCart = (item) => {
    if (item.available === false) {
      return;
    }

    setSelectedItems((current) => {
      const existing = current.find((entry) => entry.name === item.name);
      if (existing) {
        return current.map((entry) => (
          entry.name === item.name ? { ...entry, quantity: entry.quantity + 1 } : entry
        ));
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemName, quantity) => {
    setSelectedItems((current) => {
      if (quantity < 1) {
        return current.filter((item) => item.name !== itemName);
      }

      return current.map((item) => (
        item.name === itemName ? { ...item, quantity } : item
      ));
    });
  };

  const toggleFavorite = (itemName) => {
    setFavorites((current) => {
      const nextFavorites = new Set(current);

      if (nextFavorites.has(itemName)) {
        nextFavorites.delete(itemName);
      } else {
        nextFavorites.add(itemName);
      }

      return nextFavorites;
    });
  };

  const handleCheckout = async () => {
    if (!customerName.trim() || !tableNumber.trim() || !customerPhone.trim() || !selectedItems.length) {
      toast.error('Please fill in customer name, phone, table number and select at least one item.');
      return;
    }

    setIsPlacingOrder(true);

    const payload = {
      shopId: id,
      shopName: shop.shopName,
      shopAddress: shop.address,
      customerName,
      customerPhone,
      customerEmail,
      tableNumber,
      customerNote,
      items: selectedItems,
      subtotal,
      subTotal: subtotal,
      discountAmount: safeDiscountAmount,
      couponCode: appliedCoupon?.code,
      taxes,
      total: finalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      estimatedPrepMinutes
    };

    try {
      if (paymentMethod === 'razorpay') {
        setCurrentOrder(payload);
        setShowPaymentGateway(true);
        setIsPlacingOrder(false);
        return;
      }

      const response = await createOrder(payload);

      if (response.data.success) {
        toast.success('Order placed successfully!');
        setIsCartOpen(false);
        navigate(`/track-order/${response.data.orderId}`, {
          state: {
            ...payload,
            orderId: response.data.orderId,
            estimatedReadyAt: response.data.estimatedReadyAt
          }
        });
      } else {
        toast.error(response.data.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (verifiedOrder) => {
    if (!currentOrder || !verifiedOrder?._id) {
      toast.error('Payment succeeded, but the order details were incomplete.');
      return;
    }

    toast.success('Payment successful! Order placed.');
    setShowPaymentGateway(false);
    setIsCartOpen(false);
    setCurrentOrder(null);

    navigate(`/track-order/${verifiedOrder._id}`, {
      state: {
        ...currentOrder,
        orderId: verifiedOrder._id,
        paymentStatus: verifiedOrder.paymentStatus || 'paid',
        paymentReference: verifiedOrder.paymentReference,
        estimatedReadyAt: verifiedOrder.estimatedReadyAt
      }
    });
  };

  const handlePaymentClose = () => {
    setShowPaymentGateway(false);
  };

  if (isLoading) {
    return (
      <div className="menu-view-state">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="menu-view-state">{error}</div>;
  }

  return (
    <div className={`menu-view menu-view--${theme}`} style={{ '--menu-accent': shop.brandColor || '#f97316' }}>
      <header className="menu-view__hero">
        <div className="menu-view__hero-background" />
        <div className="menu-view__hero-overlay" />
        <button
          type="button"
          className="menu-view__theme-toggle"
          onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="menu-view__hero-content">
          <div className="menu-view__hero-copy">
            <motion.div
              className="menu-view__logo-hero"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SmartImage
                src={shop.logo}
                alt={shop.shopName || 'Shop'}
                className="menu-view__logo-image"
                fallbackClassName="menu-view__logo-fallback"
                fallbackContent={<ChefHat size={40} />}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="menu-view__hero-tag">{shop.cuisineType || 'Digital Menu'}</p>
              <h1 className="menu-view__hero-title">{shop.shopName || 'Restaurant'}</h1>
              <p className="menu-view__hero-tagline">{shop.tagline || 'Delicious food, real-time ordering'}</p>
              <div className="menu-view__hero-quickline">
                <span>{availableItems.length} dishes ready to order</span>
                <span>{topCategory}</span>
              </div>
            </motion.div>

            <motion.div
              className="menu-view__hero-stats"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {shop.openHours && (
                <div className="hero-stat">
                  <Clock3 size={16} className="stat-icon" />
                  <span>{shop.openHours}</span>
                </div>
              )}
              {shop.address && (
                <div className="hero-stat">
                  <MapPin size={16} className="stat-icon" />
                  <span>{shop.address}</span>
                </div>
              )}
              {shop.contactPhone && (
                <div className="hero-stat">
                  <Phone size={16} className="stat-icon" />
                  <span>{shop.contactPhone}</span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="menu-view__hero-visual"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            <div className="menu-view__hero-board">
              <SmartImage
                src={heroImage}
                alt={shop.shopName || 'Restaurant'}
                className="menu-view__hero-board-image"
                fallbackClassName="menu-view__hero-board-fallback"
                fallbackContent={<ChefHat size={48} />}
              />
              <div className="menu-view__hero-board-sheen" />
              <div className="menu-view__hero-board-content">
                <strong>{shop.shopName || 'Your restaurant'}</strong>
                <span>{shop.tagline || 'Add stronger branding to make the menu feel premium.'}</span>
                <div className="menu-view__hero-board-badges">
                  <span>{availableItems.length} dishes live</span>
                  <span>{featuredItems.length || highlightedItems.length} picks highlighted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="menu-view__main-content">
        <div className="menu-view__container">
          <section className="menu-view__meta-grid">
            <div className="menu-view__meta-card">
              <span>Available items</span>
              <strong>{availableItems.length}</strong>
            </div>
            <div className="menu-view__meta-card">
              <span>Featured picks</span>
              <strong>{featuredItems.length || highlightedItems.length}</strong>
            </div>
            <div className="menu-view__meta-card">
              <span>Average prep</span>
              <strong>{averagePrepTime} min</strong>
            </div>
            <div className="menu-view__meta-card">
              <span>Cart status</span>
              <strong>{totalItems ? `${totalItems} item${totalItems > 1 ? 's' : ''}` : 'Ready to order'}</strong>
            </div>
          </section>

          <section className="menu-view__service-bar" aria-label="Table service">
            <div><Bell size={18} /><span>Need something at table {tableNumber || '—'}?</span></div>
            <div>
              <button type="button" onClick={() => requestService('Waiter')}>Call waiter</button>
              <button type="button" onClick={() => requestService('Water')}>Request water</button>
              <button type="button" onClick={() => requestService('Bill')}>Request bill</button>
            </div>
          </section>

          <motion.div
            className="menu-view__search-container"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="menu-view__search-bar"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setSearchFocused(false);
              }}
            >
              <Search size={18} className="search-icon" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search for your favorite dishes..."
                className="search-input"
              />
              {searchTerm && (
                <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>
                  Clear
                </button>
              )}
              {searchFocused && (
                <div className="menu-view__search-suggestions">
                  <strong>{searchTerm ? 'Matching dishes' : 'Recent searches'}</strong>
                  {(searchTerm ? searchSuggestions : recentSearches.map((name) => ({ name }))).length ? (
                    (searchTerm ? searchSuggestions : recentSearches.map((name) => ({ name }))).map((item) => (
                      <button type="button" key={`${item.category || 'recent'}-${item.name}`} onMouseDown={() => chooseSearch(item.name)}>
                        <Search size={14} /><span>{item.name}</span>{item.category && <small>{item.category}</small>}
                      </button>
                    ))
                  ) : <span className="menu-view__search-empty">Start typing a dish or category.</span>}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="menu-view__filters"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="filters-scroll">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  className={`filter-chip ${activeCategory === category ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}

              {[
                ['veg', 'Veg only'],
                ['spicy', 'Spicy'],
                ['quick', 'Under 15 min']
              ].map(([value, label]) => (
                <motion.button
                  key={value}
                  type="button"
                  className={`filter-chip ${dietFilter === value ? 'is-active' : ''}`}
                  onClick={() => setDietFilter((current) => current === value ? 'all' : value)}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}

              <motion.button
                type="button"
                className={`filter-chip ${featuredOnly ? 'is-active' : ''}`}
                onClick={() => setFeaturedOnly((current) => !current)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame size={16} /> Featured only
              </motion.button>

              {favorites.size > 0 && (
                <motion.button
                  type="button"
                  className={`filter-chip ${favoritesOnly ? 'is-active' : ''}`}
                  onClick={() => setFavoritesOnly((current) => !current)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={16} /> Favorites
                </motion.button>
              )}
            </div>
          </motion.div>

          {!featuredOnly && !searchTerm && activeCategory === 'All' && highlightedItems.length > 0 && (
            <motion.section
              className="menu-view__featured-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="featured-header">
                <h2><Sparkles size={20} /> Today's Specials</h2>
                <p>Hand-picked favorites and best value dishes</p>
              </div>

              <div className="featured-items-grid">
                {highlightedItems.map((item) => (
                  <motion.div
                    key={`featured-${item.name}`}
                    className="featured-item-card"
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="featured-item-image">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        className="featured-item-photo"
                        fallbackClassName="featured-item-fallback"
                        fallbackContent={
                          <div className="menu-card__image-fallback-copy">
                            <ChefHat size={34} />
                            <span>Freshly prepared</span>
                          </div>
                        }
                      />
                      <div className="featured-item-image__gradient" />
                      <div className="featured-badge">{item.featured ? 'FEATURED' : 'SPECIAL'}</div>
                    </div>

                    <div className="featured-item-content">
                      <h3>{item.name}</h3>
                      <p className="featured-item-desc">{item.remarks || 'Delicious choice'}</p>
                      <div className="featured-item-footer">
                        <span className="featured-price">{formatCurrency(item.price)}</span>
                        <motion.button
                          className="featured-add-btn"
                          onClick={() => addToCart(item)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          <div className="menu-view__content-grid">
            {Object.keys(groupedVisibleItems).length === 0 ? (
              <motion.div
                className="menu-view__empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <UtensilsCrossed size={48} />
                <p>No items match this view yet</p>
                <small>Try another category, clear the search, or turn off featured-only mode.</small>
              </motion.div>
            ) : (
              Object.entries(groupedVisibleItems).map(([category, items], categoryIndex) => (
                <motion.div
                  key={category}
                  className="menu-view__category"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <h2 className="category-title"><TrendingUp size={18} /> {category}</h2>
                  <div className="menu-view__grid">
                    {items.map((item, itemIndex) => {
                      const itemQuantity = getItemQuantity(item.name);
                      const isAvailable = item.available !== false;
                      const isFavorited = favorites.has(item.name);

                      return (
                        <motion.article
                          key={`${category}-${item.name}`}
                          className={`menu-card ${!isAvailable ? 'is-unavailable' : ''}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: itemIndex * 0.05 }}
                          whileHover={isAvailable ? { y: -8 } : {}}
                          role="button"
                          tabIndex={0}
                          onClick={() => isAvailable && setSelectedFood(item)}
                          onKeyDown={(event) => {
                            if (isAvailable && (event.key === 'Enter' || event.key === ' ')) {
                              event.preventDefault();
                              setSelectedFood(item);
                            }
                          }}
                          style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                        >
                          <div className="menu-card__image-wrapper">
                            <SmartImage
                              src={item.image}
                              alt={item.name}
                              className="menu-card__image"
                              fallbackClassName="menu-card__image-fallback"
                              fallbackContent={
                                <div className="menu-card__image-fallback-copy">
                                  <ImageOff size={24} />
                                  <span>Image coming soon</span>
                                </div>
                              }
                            />
                            <div className="menu-card__image-overlay" />

                            {item.featured && (
                              <div className="menu-card__badge">
                                <Sparkles size={12} /> FEATURED
                              </div>
                            )}

                            {item.discount ? (
                              <div className="menu-card__discount">
                                -{item.discount}%
                              </div>
                            ) : null}

                            {!isAvailable && (
                              <div className="menu-card__sold-out">Sold out</div>
                            )}

                            <motion.button
                              className={`menu-card__favorite ${isFavorited ? 'is-favorited' : ''}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(item.name);
                              }}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                            </motion.button>
                          </div>

                          <div className="menu-card__body">
                            <div className="menu-card__labels">
                              {item.isVeg && <span className="label label--veg"><Leaf size={11} /> Veg</span>}
                              {item.spiceLevel && <span className={`label label--spice label--spice-${String(item.spiceLevel).toLowerCase()}`}>{item.spiceLevel}</span>}
                              <span className="label label--time"><Clock3 size={11} /> {item.prepTime || 10}m</span>
                            </div>

                            <h3 className="menu-card__name">{item.name}</h3>
                            {item.remarks && <p className="menu-card__description">{item.remarks}</p>}

                            <div className="menu-card__meta-line">
                              <span>{item.category}</span>
                              <span>{isAvailable ? 'Made fresh' : 'Unavailable'}</span>
                            </div>

                            <div className="menu-card__footer">
                              <div className="menu-card__pricing">
                                <span className="menu-card__price">{formatCurrency(item.price)}</span>
                                {item.originalPrice && (
                                  <span className="menu-card__original-price">{formatCurrency(item.originalPrice)}</span>
                                )}
                              </div>

                              <AnimatePresence>
                                {itemQuantity > 0 ? (
                                  <motion.div
                                    className="menu-card__quantity"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                  >
                                    <motion.button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        updateQuantity(item.name, itemQuantity - 1);
                                      }}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      -
                                    </motion.button>
                                    <span className="quantity-display">{itemQuantity}</span>
                                    <motion.button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        updateQuantity(item.name, itemQuantity + 1);
                                      }}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      +
                                    </motion.button>
                                  </motion.div>
                                ) : (
                                  <motion.button
                                    type="button"
                                    className="menu-card__add"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      addToCart(item);
                                    }}
                                    disabled={!isAvailable}
                                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <Plus size={16} />
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFood && (
          <motion.div
            className="food-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFood(null)}
          >
            <motion.article
              className="food-detail"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedFood.name} details`}
            >
              <button type="button" className="food-detail__close" onClick={() => setSelectedFood(null)} aria-label="Close details">
                <X size={20} />
              </button>
              <SmartImage
                src={selectedFood.image}
                alt={selectedFood.name}
                className="food-detail__image"
                fallbackClassName="food-detail__image food-detail__image--fallback"
                fallbackContent={<ChefHat size={42} />}
              />
              <div className="food-detail__body">
                <div className="menu-card__labels">
                  {selectedFood.isVeg && <span className="label label--veg"><Leaf size={11} /> Veg</span>}
                  {selectedFood.featured && <span className="label"><Sparkles size={11} /> Chef pick</span>}
                  <span className="label label--time"><Clock3 size={11} /> {selectedFood.prepTime || 10} min</span>
                </div>
                <h2>{selectedFood.name}</h2>
                <p>{selectedFood.remarks || 'Freshly prepared by the restaurant kitchen.'}</p>
                <div className="food-detail__facts">
                  <div><span>Category</span><strong>{selectedFood.category}</strong></div>
                  <div><span>Spice</span><strong>{selectedFood.spiceLevel || 'Regular'}</strong></div>
                  <div><span>Calories</span><strong>{selectedFood.calories || 'Ask kitchen'}</strong></div>
                </div>
                <div className="food-detail__footer">
                  <strong>{formatCurrency(selectedFood.price)}</strong>
                  <button type="button" onClick={() => { addToCart(selectedFood); setSelectedFood(null); }}>
                    <Plus size={17} /> Add to order
                  </button>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.button
            type="button"
            className="order-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          />
        )}
      </AnimatePresence>

      <aside className={`order-drawer ${isCartOpen ? 'is-open' : ''}`}>
        <div className="order-drawer__header">
          <div>
            <h2>Checkout and tracking</h2>
            <p>{shop.shopName ? `Ordering from ${shop.shopName}` : 'Review your items and confirm details.'}</p>
          </div>
          <button type="button" className="order-drawer__close" onClick={() => setIsCartOpen(false)}>x</button>
        </div>

        <div className="order-drawer__summary">
          <div className="order-drawer__summary-list">
            <div className="order-drawer__summary-row">
              <span><ShoppingBag size={14} style={{ display: 'inline', marginRight: '4px' }} /> Items subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="order-drawer__summary-row">
              <span><Clock3 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Estimated prep</span>
              <span>{estimatedPrepMinutes || 0} min</span>
            </div>
            {safeDiscountAmount > 0 && (
              <div className="order-drawer__summary-row order-drawer__summary-row--discount">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(safeDiscountAmount)}</span>
              </div>
            )}
            <div className="order-drawer__summary-row">
              <span><BadgePercent size={14} style={{ display: 'inline', marginRight: '4px' }} /> Taxes</span>
              <span>{formatCurrency(taxes)}</span>
            </div>
            <div className="order-drawer__summary-row order-drawer__summary-row--total">
              <span>Total to pay</span>
              <span>{formatCurrency(finalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="order-drawer__inputs">
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" />
          <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Phone number" type="tel" />
          <input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Email (optional)" type="email" />
          <input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} placeholder="Table number" />
          <textarea rows="3" value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} placeholder="Special note (optional)" />
        </div>

        <div className="order-drawer__payment">
          <h3>Payment</h3>
          <div className="order-drawer__payment-grid">
            {paymentOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`payment-card ${paymentMethod === option.id ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  <Icon size={16} />
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <CouponApplier
          shopId={id}
          cartTotal={subtotal}
          onCouponApplied={(coupon) => {
            if (!coupon) {
              setDiscountAmount(0);
              setAppliedCoupon(null);
              return;
            }

            setDiscountAmount(Number(coupon.discountAmount) || 0);
            setAppliedCoupon(coupon);
          }}
        />

        <div className="order-drawer__timeline">
          <h3>What happens next</h3>
          <div className="timeline-step"><strong>1.</strong><span>{paymentMethod === 'cash' ? 'Place the order and pay when it arrives.' : 'Complete payment and confirm the order.'}</span></div>
          <div className="timeline-step"><strong>2.</strong><span>The kitchen moves your order from pending to preparing.</span></div>
          <div className="timeline-step"><strong>3.</strong><span>You can track status and remaining time on the next screen.</span></div>
        </div>

        <div className="order-drawer__items">
          {selectedItems.length === 0 ? (
            <p className="order-drawer__empty">Your cart is empty.</p>
          ) : (
            selectedItems.map((item) => (
              <div className="order-drawer__item" key={item.name}>
                <div className="order-drawer__item-details">
                  <strong>{item.name}</strong>
                  <span>{formatCurrency(item.price)}</span>
                </div>
                <div className="menu-card__quantity">
                  <button type="button" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <button type="button" className="order-drawer__submit" onClick={handleCheckout} disabled={isPlacingOrder || !selectedItems.length}>
          {isPlacingOrder ? 'Processing order...' : paymentMethod === 'cash' ? 'Place order' : 'Pay and place order'}
        </button>
      </aside>

      {selectedItems.length > 0 && (
        <button type="button" className="menu-view__floating-cart" onClick={() => setIsCartOpen(true)}>
          <span>{totalItems} items</span>
          <strong>{formatCurrency(finalAmount)}</strong>
        </button>
      )}

      <AnimatePresence mode="wait">
        {showPaymentGateway && currentOrder && (
          <PaymentGateway
            orderId={currentOrder.shopId}
            amount={currentOrder.total}
            customerName={currentOrder.customerName}
            customerEmail={currentOrder.customerEmail}
            customerPhone={currentOrder.customerPhone}
            tableNumber={currentOrder.tableNumber}
            shopId={currentOrder.shopId}
            items={currentOrder.items}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MenuView;
