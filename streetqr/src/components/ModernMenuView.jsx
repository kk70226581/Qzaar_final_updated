import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Clock3,
  Heart,
  Leaf,
  MapPin,
  Moon,
  Phone,
  Search,
  Sun,
  ShoppingBag,
  Sparkles,
  X,
  Utensils,
  Star,
} from 'lucide-react';

import {
  Button,
  Card,
  CardImage,
  CardContent,
  Input,
  Loading,
  Modal,
  SearchBar,
  CategoryFilter,
  FoodCard,
} from './ui';
import Toast from './ui/Toast';
import CouponApplier from './CouponApplier';
import PaymentGateway from './PaymentGateway';
import { createOrder, getMenu } from '../api';

const FAVORITES_STORAGE_PREFIX = 'streetqr:favorites:';
const PROFILE_STORAGE_PREFIX = 'streetqr:profile:';

const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(0)}`;

function ModernMenuView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Menu & Shop State
  const [menuData, setMenuData] = useState({});
  const [shop, setShop] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Cart State
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qzaar-recent-searches') || '[]');
    } catch {
      return [];
    }
  });

  // UI State
  const [theme, setTheme] = useState(() => localStorage.getItem('qzaar-theme') || 'light');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedFood, setSelectedFood] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Load Menu
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
          brandColor: response.data.brandColor || '#e29d67',
        });
      })
      .catch(() => setError('Failed to load menu. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Load table from query params
  useEffect(() => {
    const scannedTable = new URLSearchParams(window.location.search).get('table');
    if (scannedTable) setTableNumber(scannedTable);
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('qzaar-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`${FAVORITES_STORAGE_PREFIX}${id}`);
    const savedProfile = localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${id}`);

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
        setCustomerName(profile.name || '');
        setCustomerPhone(profile.phone || '');
        setCustomerEmail(profile.email || '');
      } catch {
        // Continue regardless
      }
    }
  }, [id]);

  // Calculate stats
  const allMenuItems = useMemo(() => {
    return Object.entries(menuData).flatMap(([category, items]) =>
      (items || []).map((item) => ({ ...item, category }))
    );
  }, [menuData]);

  const filteredItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allMenuItems, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(allMenuItems.map((item) => item.category)));
  }, [allMenuItems]);

  const cartTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedItems]);

  const finalTotal = useMemo(() => {
    const subtotal = cartTotal;
    const gst = Math.round(subtotal * 0.05);
    const packingCharges = selectedItems.length > 0 ? 10 : 0;
    return subtotal + gst + packingCharges - discountAmount;
  }, [cartTotal, selectedItems, discountAmount]);

  // Handlers
  const handleAddItem = useCallback((itemId, quantity) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty <= 0) {
          return prev.filter((item) => item.id !== itemId);
        }
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        );
      }

      const foodItem = allMenuItems.find((item) => item.id === itemId || item.name === itemId);
      if (!foodItem) return prev;

      return [...prev, { ...foodItem, quantity: Math.max(0, quantity) }];
    });
  }, [allMenuItems]);

  const handleFavorite = useCallback((itemId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      localStorage.setItem(
        `${FAVORITES_STORAGE_PREFIX}${id}`,
        JSON.stringify(Array.from(next))
      );
      return next;
    });
  }, [id]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      const newRecent = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecent);
      localStorage.setItem('qzaar-recent-searches', JSON.stringify(newRecent));
    }
  }, [recentSearches]);

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      Toast.error('Please provide your name and table number');
      return;
    }

    if (selectedItems.length === 0) {
      Toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod === 'razorpay' && !customerEmail) {
      Toast.error('Email is required for online payment');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderPayload = {
        shopId: id,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        tableNumber,
        customerNote: customerNote || '',
        items: selectedItems,
        subTotal: cartTotal,
        discountAmount,
        couponCode: appliedCoupon?.code || '',
        taxes: Math.round(cartTotal * 0.05),
        total: finalTotal,
        paymentMethod,
        estimatedPrepMinutes: Math.max(...selectedItems.map((item) => item.prepTime || 15)),
      };

      if (paymentMethod === 'razorpay') {
        setShowPaymentGateway(true);
        return;
      }

      const response = await createOrder(orderPayload);
      if (response.data.success) {
        localStorage.setItem(
          `${PROFILE_STORAGE_PREFIX}${id}`,
          JSON.stringify({ name: customerName, phone: customerPhone, email: customerEmail })
        );

        Toast.success('Order placed successfully!');
        setSelectedItems([]);
        setTimeout(() => {
          navigate(`/track-order/${response.data.orderId}`);
        }, 1000);
      } else {
        Toast.error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      Toast.error('Error placing order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // UI
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-slate-950">
          <Loading text="Loading menu..." fullscreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-white dark:bg-slate-950 flex items-center justify-center`}>
        <div className="text-center">
          <Utensils size={48} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Unable to Load Menu
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-white dark:bg-slate-950`}>
      {/* Top Navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center rounded-lg px-2 py-1 text-xs font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800"
            >
              Qzaar
            </Link>
            {shop.logo && (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={shop.logo}
                alt={shop.shopName}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {shop.shopName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{shop.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              <ShoppingBag size={20} />
              {selectedItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-danger-600 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {selectedItems.length}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardImage src={shop.logo} alt={shop.shopName} />
            </Card>
            <CardContent className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/20 dark:to-brand-900/20 rounded-lg col-span-1">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                    {shop.shopName}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {shop.cuisineType}
                  </p>
                </div>

                {shop.address && (
                  <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{shop.address}</span>
                  </div>
                )}

                {shop.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Phone size={16} />
                    <a href={`tel:${shop.contactPhone}`} className="hover:text-brand-600">
                      {shop.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for food, categories..."
            recentSearches={recentSearches}
            trendingSearches={['Biryani', 'Pizza', 'Pasta', 'Desserts']}
            onClear={() => {
              setSearchTerm('');
              setActiveCategory('All');
            }}
          />

          <CategoryFilter
            categories={categories.map((cat) => ({ id: cat, name: cat }))}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            horizontal={true}
          />
        </motion.div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={`${item.category}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <FoodCard
                  id={item.name}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  rating={item.rating}
                  reviews={item.reviews}
                  prepTime={item.prepTime}
                  isVeg={item.isVeg !== false}
                  isBestseller={item.isBestseller}
                  isChefRecommended={item.isChefRecommended}
                  isNew={item.isNew}
                  quantity={selectedItems.find((si) => si.name === item.name)?.quantity || 0}
                  onAddClick={handleAddItem}
                  onFavoriteClick={handleFavorite}
                  isFavorite={favorites.has(item.name)}
                  onClick={() => setSelectedFood(item)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No items found. Try adjusting your filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Order</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedItems.length > 0 ? (
                  <div className="space-y-4">
                    {selectedItems.map((item) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Rs {item.price} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddItem(item.name, -1)}
                            className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleAddItem(item.name, 1)}
                            className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-brand-600"
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-600 dark:text-slate-400">Your cart is empty</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {selectedItems.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-4">
                  {/* Coupon */}
                  <CouponApplier
                    shopId={id}
                    cartTotal={cartTotal}
                    onCouponApplied={(coupon, discount) => {
                      setAppliedCoupon(coupon);
                      setDiscountAmount(discount);
                    }}
                  />

                  {/* Bill Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">GST (5%)</span>
                      <span className="font-semibold">{formatCurrency(Math.round(cartTotal * 0.05))}</span>
                    </div>
                    {selectedItems.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Packing</span>
                        <span className="font-semibold">Rs 10</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-success-600">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Input
                      label="Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                    <Input
                      label="Table Number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    {paymentMethod === 'razorpay' && (
                      <Input
                        label="Email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-sm font-semibold">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="text-sm font-semibold">Cash</div>
                        <div className="text-xs text-slate-500">At Counter</div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          paymentMethod === 'razorpay'
                            ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="text-sm font-semibold">Online</div>
                        <div className="text-xs text-slate-500">Card/UPI</div>
                      </button>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    fullWidth
                    size="lg"
                    isLoading={isPlacingOrder}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <PaymentGateway
          amount={finalTotal}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          tableNumber={tableNumber}
          shopId={id}
          items={selectedItems}
          onClose={() => setShowPaymentGateway(false)}
          onSuccess={(order) => {
            setSelectedItems([]);
            setShowPaymentGateway(false);
            navigate(`/track-order/${order?._id || order?.id || order?.orderId}`);
          }}
        />
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <Modal
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          title={selectedFood.name}
          size="md"
        >
          <div className="space-y-6">
            {selectedFood.image && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                  {selectedFood.isVeg !== false && (
                    <span className="bg-success-600 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Leaf size={14} /> Veg
                    </span>
                  )}
                  {selectedFood.isBestseller && (
                    <span className="bg-brand-600 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Sparkles size={14} /> Bestseller
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    Rs {selectedFood.price}
                  </span>
                  {selectedFood.originalPrice && (
                    <span className="text-lg text-slate-500 line-through">
                      Rs {selectedFood.originalPrice}
                    </span>
                  )}
                </div>
                {selectedFood.rating && (
                  <div className="flex items-center gap-1.5 text-sm bg-warning-50 dark:bg-warning-950/20 text-warning-700 dark:text-warning-400 px-3 py-1 rounded-full font-bold">
                    <Star size={16} className="fill-warning-500 text-warning-500" />
                    <span>{selectedFood.rating.toFixed(1)} ({selectedFood.reviews || 0} reviews)</span>
                  </div>
                )}
              </div>

              {selectedFood.prepTime && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock3 size={16} />
                  <span>Preparation time: {selectedFood.prepTime} mins</span>
                </div>
              )}

              {selectedFood.description && (
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Description</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {selectedFood.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector / Add to Cart Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                {selectedItems.find((si) => si.name === selectedFood.name)?.quantity > 0 ? (
                  <div className="flex items-center justify-between bg-brand-50 dark:bg-brand-900/20 rounded-xl p-2 w-36">
                    <button
                      onClick={() => handleAddItem(selectedFood.name, -1)}
                      className="w-10 h-10 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg transition-colors font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="font-bold text-slate-900 dark:text-slate-50 text-lg">
                      {selectedItems.find((si) => si.name === selectedFood.name).quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(selectedFood.name, 1)}
                      className="w-10 h-10 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => {
                      handleAddItem(selectedFood.name, 1);
                      toast.success(`${selectedFood.name} added to cart`);
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
                
                <button
                  onClick={() => handleFavorite(selectedFood.name)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    favorites.has(selectedFood.name)
                      ? 'border-danger-500 bg-danger-50 dark:bg-danger-950/20 text-danger-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Heart
                    size={20}
                    className={favorites.has(selectedFood.name) ? "fill-danger-500" : ""}
                  />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ModernMenuView;
