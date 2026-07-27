import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CakeSlice,
  ChefHat,
  Clock3,
  CupSoda,
  Drumstick,
  Filter,
  Leaf,
  Minus,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  ShieldCheck,
  UtensilsCrossed,
  X,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  ModernFoodCard,
  ModernInput,
  ModernSkeleton,
  ModernEmpty,
  ModernError,
} from '../ui';
import CategoryTabs from '../features/CategoryTabs';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import PaymentGateway from '../PaymentGateway';
import CouponApplier from '../CouponApplier';
import { apiClient, createOrder, getMenu } from '../../api';
import '../../styles/pages/MenuBrowsePage.css';

const categories = [
  { id: 'all', name: 'All Items', icon: UtensilsCrossed },
  { id: 'popular', name: 'Popular', icon: Star },
  { id: 'appetizers', name: 'Appetizers', icon: Sparkles },
  { id: 'main', name: 'Main Course', icon: Drumstick },
  { id: 'desserts', name: 'Desserts', icon: CakeSlice },
  { id: 'beverages', name: 'Beverages', icon: CupSoda },
  { id: 'specials', name: 'Chef Specials', icon: ChefHat },
];

const heroStats = [
  { icon: Star, value: '4.8', label: 'Guest rating' },
  { icon: Clock3, value: '18m', label: 'Avg prep' },
  { icon: Sparkles, value: '24', label: 'Menu picks' },
];

const menuPromos = [
  { icon: ScanLine, title: 'Scan to table', text: 'QR orders land straight in the kitchen.' },
  { icon: Zap, title: 'Fast favourites', text: 'Popular combos and chef picks stay one tap away.' },
  { icon: ShoppingCart, title: 'Smart cart', text: 'Clear totals, offers, and checkout in one flow.' },
];

const mockFoods = [
  {
    id: 1,
    name: 'Butter Paneer Tikka',
    description: 'Creamy paneer in rich butter sauce with aromatic spices',
    price: 299,
    originalPrice: 350,
    rating: 4.8,
    reviews: 245,
    prepTime: 15,
    calories: 280,
    category: 'main',
    image: '/images/showcase/showcase-1.png',
    isBestseller: true,
    isVeg: true,
  },
  {
    id: 2,
    name: 'Tandoori Chicken',
    description: 'Marinated and grilled chicken with yogurt and spices',
    price: 349,
    originalPrice: 399,
    rating: 4.7,
    reviews: 189,
    prepTime: 20,
    calories: 320,
    category: 'main',
    image: '/images/showcase/showcase-2.png',
    isChefRecommended: true,
    isVeg: false,
  },
  {
    id: 3,
    name: 'Garlic Naan',
    description: 'Soft and fluffy bread with aromatic garlic butter',
    price: 79,
    originalPrice: 89,
    rating: 4.9,
    reviews: 412,
    prepTime: 8,
    calories: 180,
    category: 'appetizers',
    image: '/images/showcase/showcase-3.png',
    isBestseller: true,
    isVeg: true,
  },
  {
    id: 4,
    name: 'Biryani',
    description: 'Fragrant rice dish with tender meat and aromatic spices',
    price: 399,
    rating: 4.6,
    reviews: 356,
    prepTime: 25,
    calories: 450,
    category: 'main',
    image: '/images/showcase/showcase-4.png',
    isVeg: false,
  },
  {
    id: 5,
    name: 'Gulab Jamun',
    description: 'Soft milk solids in sweet sugar syrup',
    price: 99,
    rating: 4.8,
    reviews: 278,
    prepTime: 5,
    calories: 220,
    category: 'desserts',
    image: '/images/showcase/showcase-5.png',
    isNew: true,
    isVeg: true,
  },
  {
    id: 6,
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink with fresh mango pulp',
    price: 89,
    rating: 4.7,
    reviews: 189,
    prepTime: 3,
    calories: 150,
    category: 'beverages',
    image: '/images/showcase/showcase-6.png',
    isBestseller: true,
    isVeg: true,
  },
  { id: 7, name: 'Crispy Corn Chaat', description: 'Crisp corn tossed with lime, chilli, and herbs', price: 149, rating: 4.6, reviews: 182, prepTime: 8, calories: 210, category: 'appetizers', image: '/images/showcase/showcase-7.png', isVeg: true },
  { id: 8, name: 'Veg Seekh Kebab', description: 'Smoky grilled vegetable kebabs with mint chutney', price: 229, rating: 4.7, reviews: 219, prepTime: 14, calories: 240, category: 'appetizers', image: '/images/showcase/showcase-8.png', isVeg: true, isChefRecommended: true },
  { id: 9, name: 'Paneer Malai Tikka', description: 'Creamy cottage cheese, chargrilled to perfection', price: 319, rating: 4.8, reviews: 302, prepTime: 18, calories: 340, category: 'appetizers', image: '/images/showcase/showcase-1.png', isVeg: true, isBestseller: true },
  { id: 10, name: 'Masala Fries', description: 'Crispy fries dusted with house masala', price: 119, rating: 4.4, reviews: 126, prepTime: 7, calories: 260, category: 'appetizers', image: '/images/showcase/showcase-3.png', isVeg: true },
  { id: 11, name: 'Dal Makhani', description: 'Slow-cooked black lentils finished with butter', price: 259, rating: 4.8, reviews: 344, prepTime: 16, calories: 310, category: 'main', image: '/images/showcase/showcase-5.png', isVeg: true, isBestseller: true },
  { id: 12, name: 'Kadai Paneer', description: 'Paneer, peppers and tomato masala in a kadai', price: 289, rating: 4.6, reviews: 238, prepTime: 17, calories: 330, category: 'main', image: '/images/showcase/showcase-1.png', isVeg: true },
  { id: 13, name: 'Chicken Tikka Masala', description: 'Charred chicken in a rich, spiced tomato gravy', price: 379, rating: 4.8, reviews: 318, prepTime: 21, calories: 420, category: 'main', image: '/images/showcase/showcase-2.png', isVeg: false, isChefRecommended: true },
  { id: 14, name: 'Veg Pulao', description: 'Fragrant basmati rice with seasonal vegetables', price: 219, rating: 4.5, reviews: 154, prepTime: 14, calories: 290, category: 'main', image: '/images/showcase/showcase-4.png', isVeg: true },
  { id: 15, name: 'Butter Naan', description: 'Tandoor-baked bread brushed with melted butter', price: 59, rating: 4.9, reviews: 465, prepTime: 6, calories: 170, category: 'main', image: '/images/showcase/showcase-3.png', isVeg: true, isBestseller: true },
  { id: 16, name: 'Jeera Rice', description: 'Steamed basmati rice with toasted cumin', price: 129, rating: 4.5, reviews: 133, prepTime: 10, calories: 220, category: 'main', image: '/images/showcase/showcase-4.png', isVeg: true },
  { id: 17, name: 'Sizzling Brownie', description: 'Warm chocolate brownie with vanilla ice cream', price: 189, rating: 4.8, reviews: 287, prepTime: 9, calories: 410, category: 'desserts', image: '/images/showcase/showcase-5.png', isVeg: true, isChefRecommended: true },
  { id: 18, name: 'Rasmalai', description: 'Soft cottage cheese dumplings in saffron milk', price: 119, rating: 4.7, reviews: 204, prepTime: 5, calories: 230, category: 'desserts', image: '/images/showcase/showcase-6.png', isVeg: true },
  { id: 19, name: 'Kulfi Falooda', description: 'Classic kulfi with vermicelli and rose syrup', price: 139, rating: 4.6, reviews: 198, prepTime: 6, calories: 280, category: 'desserts', image: '/images/showcase/showcase-7.png', isVeg: true, isNew: true },
  { id: 20, name: 'Cold Coffee', description: 'Chilled coffee blended with ice cream', price: 129, rating: 4.7, reviews: 221, prepTime: 4, calories: 250, category: 'beverages', image: '/images/showcase/showcase-8.png', isVeg: true },
  { id: 21, name: 'Masala Chai', description: 'Aromatic Indian tea simmered with warming spices', price: 49, rating: 4.9, reviews: 492, prepTime: 3, calories: 90, category: 'beverages', image: '/images/showcase/showcase-6.png', isVeg: true, isBestseller: true },
  { id: 22, name: 'Fresh Lime Soda', description: 'Sweet-salty lime soda with a refreshing fizz', price: 79, rating: 4.6, reviews: 167, prepTime: 3, calories: 110, category: 'beverages', image: '/images/showcase/showcase-7.png', isVeg: true },
  { id: 23, name: 'Chef’s Thali', description: 'A complete seasonal platter selected by our chef', price: 449, rating: 4.9, reviews: 356, prepTime: 22, calories: 650, category: 'specials', image: '/images/showcase/showcase-8.png', isVeg: true, isChefRecommended: true, isBestseller: true },
  { id: 24, name: 'Tandoori Feast', description: 'A sharing platter of grilled favourites and sides', price: 699, rating: 4.8, reviews: 241, prepTime: 25, calories: 780, category: 'specials', image: '/images/showcase/showcase-2.png', isVeg: false, isChefRecommended: true },
];

const MenuBrowsePage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    minRating: 0,
    maxPrepTime: 60,
  });
  const [shop, setShop] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState('cart');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [ratingFood, setRatingFood] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!restaurantId) {
        await new Promise(resolve => setTimeout(resolve, 350));
        setFoods(mockFoods);
        return;
      }

      const response = await getMenu(restaurantId);
      if (!response.data.success) throw new Error(response.data.message || 'The restaurant menu is unavailable.');

      const restaurant = response.data;
      const liveFoods = Object.entries(restaurant.menu || {}).flatMap(([category, items]) =>
        (items || []).map((item, index) => ({
          ...item,
          id: item.id || `${category}-${index}-${item.name || 'item'}`,
          name: item.name || 'Menu item',
          description: item.description || item.remarks || 'Freshly prepared to order.',
          price: Number(item.price) || 0,
          category,
          categoryId: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: Number(item.rating) || 4.5,
          reviews: Number(item.reviews) || 0,
          prepTime: Number(item.prepTime) || 15,
          isVeg: item.isVeg !== false && item.vegetarian !== false,
          isBestseller: Boolean(item.isBestseller || item.bestseller),
          image: item.image || restaurant.logo || '/images/landing/slide-1.png',
        }))
      );
      setShop(restaurant);
      setFoods(liveFoods);
    } catch (err) {
      setError({
        type: 'network',
        title: 'Failed to Load Menu',
        message: 'Unable to fetch the menu items. Please try again.',
        errorCode: 'ERR_MENU_LOAD',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = foods;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food => (food.categoryId || food.category) === selectedCategory);
    }

    if (selectedCategory === 'popular') {
      filtered = filtered.filter(food => food.isBestseller || food.reviews >= 250);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(search) ||
        food.description.toLowerCase().includes(search)
      );
    }

    if (vegOnly) {
      filtered = filtered.filter(food => food.isVeg);
    }

    filtered = filtered.filter(
      food => food.price >= filters.priceMin && food.price <= filters.priceMax
    );
    filtered = filtered.filter(food => food.rating >= filters.minRating);
    filtered = filtered.filter(food => food.prepTime <= filters.maxPrepTime);

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fastest') return a.prepTime - b.prepTime;
      return (b.reviews || 0) - (a.reviews || 0);
    });

    setFilteredFoods(filtered);
  }, [foods, searchTerm, selectedCategory, filters, vegOnly, sortBy]);

  useEffect(() => {
    const scannedTable = new URLSearchParams(window.location.search).get('table');
    if (scannedTable) setTableNumber(scannedTable);
  }, []);

  const dynamicCategories = useMemo(() => {
    if (!restaurantId) return categories;
    return [
      { id: 'all', name: 'All items', icon: UtensilsCrossed },
      ...Array.from(new Set(foods.map((food) => food.category))).map((category) => ({
        id: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: category,
        icon: UtensilsCrossed,
      })),
    ];
  }, [foods, restaurantId]);

  const heroSlides = useMemo(() => {
    const foodPhoto = foods.find((item) => item.image)?.image || '/images/landing/slide-1.png';
    return [
      {
        eyebrow: 'Welcome to',
        title: shop?.heroHeadline || shop?.shopName || 'Fresh food, made with care.',
        description: shop?.tagline || 'Discover a menu prepared for your table.',
        image: shop?.logo || foodPhoto,
        label: shop?.cuisineType || 'Restaurant menu',
      },
      {
        eyebrow: 'Our promise',
        title: shop?.qualityPromise || 'Quality you can taste in every bite.',
        description: 'Freshly prepared dishes, clear ordering, and a better table experience.',
        image: foodPhoto,
        label: 'Made to order',
      },
      {
        eyebrow: 'Easy table service',
        title: 'Scan. Choose. Relax.',
        description: 'Your order goes directly to the kitchen while you enjoy your time together.',
        image: '/images/brand/qzaar-restaurant-hero.png',
        label: 'Fast QR ordering',
      },
    ];
  }, [foods, shop]);

  useEffect(() => {
    setActiveHeroSlide(0);
  }, [restaurantId]);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length), 5600);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  const currentHeroSlide = heroSlides[activeHeroSlide];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.min(Number(appliedCoupon?.discountAmount) || 0, cartTotal);
  const discountedSubtotal = cartTotal - discountAmount;
  const gst = Math.round(discountedSubtotal * 0.05);
  const finalTotal = discountedSubtotal + gst;

  const updateCart = (food, amount) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === food.id);
      if (!existing && amount > 0) return [...current, { ...food, quantity: amount }];
      if (!existing) return current;
      const quantity = existing.quantity + amount;
      if (quantity <= 0) return current.filter((item) => item.id !== food.id);
      return current.map((item) => item.id === food.id ? { ...item, quantity } : item);
    });
  };

  const placeOrder = async () => {
    if (!restaurantId) return toast('Choose a live restaurant menu to place an order.');
    if (!customerName.trim() || !tableNumber.trim()) return toast.error('Please enter your name and table number.');
    if (!cart.length) return toast.error('Your cart is empty.');
    if (paymentMethod === 'razorpay' && !customerEmail.trim()) return toast.error('Email is required for online payment.');

    const payload = {
      shopId: restaurantId, customerName, customerEmail, customerPhone, tableNumber,
      items: cart, total: finalTotal, subTotal: cartTotal, discountAmount,
      couponCode: appliedCoupon?.code || '', taxes: gst, paymentMethod,
      estimatedPrepMinutes: Math.max(...cart.map((item) => item.prepTime || 15)),
    };
    if (paymentMethod === 'razorpay') return setShowPaymentGateway(true);

    setIsPlacingOrder(true);
    try {
      const response = await createOrder(payload);
      if (!response.data.success) throw new Error(response.data.message);
      toast.success('Order placed successfully!');
      setCart([]);
      navigate(`/track-order/${response.data.orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to place your order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const submitRating = async () => {
    if (!ratingFood || !selectedRating) return toast.error('Choose a star rating first.');
    setIsSubmittingRating(true);
    try {
      const storedGuestId = localStorage.getItem('qzaar:guest-id') || `guest-${crypto.randomUUID()}`;
      localStorage.setItem('qzaar:guest-id', storedGuestId);
      const response = await apiClient.post(`/api/menu/items/${restaurantId || 'preview'}/${ratingFood.id}/reviews`, {
        userId: storedGuestId,
        userName: customerName.trim() || 'Guest',
        rating: selectedRating,
        comment: ratingComment.trim()
      });
      if (!response.data.success) throw new Error(response.data.message || 'Unable to save your rating.');
      setFoods((current) => current.map((food) => food.id === ratingFood.id ? {
        ...food,
        rating: Number((((Number(food.rating) || 0) * (Number(food.reviews) || 0) + selectedRating) / ((Number(food.reviews) || 0) + 1)).toFixed(1)),
        reviews: (Number(food.reviews) || 0) + 1
      } : food));
      toast.success('Thanks for your rating!');
      setRatingFood(null);
      setSelectedRating(0);
      setRatingComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to save your rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setVegOnly(false);
    setSortBy('popular');
    setFilters({
      priceMin: 0,
      priceMax: 1000,
      minRating: 0,
      maxPrepTime: 60,
    });
  };

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

  if (error) {
    return (
      <ResponsiveLayout>
        <div className="menu-browse__error-container">
          <ModernError
            type={error.type}
            title={error.title}
            message={error.message}
            errorCode={error.errorCode}
            primaryCTA={{
              label: 'Retry',
              onClick: fetchMenu,
            }}
          />
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <main className="menu-browse">
        <header className="menu-browse__header">
          <div className="menu-browse__header-copy">
            <span className="menu-browse__eyebrow">
              <Sparkles size={16} />
              {currentHeroSlide.eyebrow}
            </span>
            <h1 className="menu-browse__title">{currentHeroSlide.title}</h1>
            <p className="menu-browse__subtitle">
              {currentHeroSlide.description}
            </p>
            <div className="menu-browse__hero-stats">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <span key={stat.label}>
                    <Icon size={16} />
                    <strong>{stat.value}</strong>
                    {stat.label}
                  </span>
                );
              })}
            </div>

            <div className="menu-browse__hero-actions">
              <button type="button" onClick={() => { setCartStep('cart'); setIsCartOpen(true); }}>
                <ShoppingCart size={18} />
                View cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </button>
              <button type="button" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={18} />
                Tune menu
              </button>
            </div>
          </div>

          <motion.div
            className="menu-browse__hero-card"
            initial={{ opacity: 0, y: 18, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentHeroSlide.image}
                src={currentHeroSlide.image}
                alt={currentHeroSlide.title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.55 }}
              />
            </AnimatePresence>
            <div className="menu-browse__hero-card-caption">
              <span>{currentHeroSlide.eyebrow}</span>
              <strong>{currentHeroSlide.label}</strong>
            </div>
            <div className="menu-browse__hero-controls">
              <button type="button" aria-label="Previous feature" onClick={() => setActiveHeroSlide((current) => (current + heroSlides.length - 1) % heroSlides.length)}><ChevronLeft size={17} /></button>
              <div>{heroSlides.map((slide, index) => <button type="button" key={slide.title} aria-label={`Show feature ${index + 1}`} className={index === activeHeroSlide ? 'is-active' : ''} onClick={() => setActiveHeroSlide(index)} />)}</div>
              <button type="button" aria-label="Next feature" onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}><ChevronRight size={17} /></button>
            </div>
          </motion.div>
        </header>

        <section className="menu-browse__promo-strip" aria-label="Ordering highlights">
          {menuPromos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.article
                key={promo.title}
                className="menu-browse__promo-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <motion.span
                  className="menu-browse__promo-icon"
                  animate={{ y: [0, -3, 0], rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 3 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon size={20} />
                </motion.span>
                <div>
                  <h2>{promo.title}</h2>
                  <p>{promo.text}</p>
                </div>
              </motion.article>
            );
          })}
        </section>

        {!loading && (
          <nav className="menu-browse__nav">
            <CategoryTabs
              categories={dynamicCategories}
              activeId={selectedCategory}
              onCategoryClick={setSelectedCategory}
            />
          </nav>
        )}

        <div className="menu-browse__toolbar">
          <div className="menu-browse__search">
            <Search size={20} className="menu-browse__search-icon" />
            <ModernInput
              type="search"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-browse__search-input"
            />
          </div>

          <label className="menu-browse__veg-toggle">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
            />
            <Leaf size={18} />
            Veg only
          </label>

          <label className="menu-browse__sort">
            <ArrowUpDown size={18} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="fastest">Fastest prep</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
            </select>
          </label>

          <button
            className="menu-browse__filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="menu-browse__filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="menu-browse__filters-content">
                <div className="menu-browse__filter-group">
                  <label>Price Range</label>
                  <div className="menu-browse__filter-input-group">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceMin: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="Min"
                      className="menu-browse__filter-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceMax: parseInt(e.target.value, 10) || 1000,
                        })
                      }
                      placeholder="Max"
                      className="menu-browse__filter-input"
                    />
                  </div>
                </div>

                <div className="menu-browse__filter-group">
                  <label>Minimum Rating</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minRating: parseFloat(e.target.value),
                      })
                    }
                    className="menu-browse__filter-range"
                  />
                  <span className="menu-browse__filter-value">
                    {filters.minRating} star and up
                  </span>
                </div>

                <div className="menu-browse__filter-group">
                  <label>Max Prep Time</label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={filters.maxPrepTime}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrepTime: parseInt(e.target.value, 10),
                      })
                    }
                    className="menu-browse__filter-range"
                  />
                  <span className="menu-browse__filter-value">
                    {filters.maxPrepTime} mins
                  </span>
                </div>

                <div className="menu-browse__filter-actions">
                  <button type="button" onClick={clearFilters}>
                    Clear filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="menu-browse__content">
          {!loading && (
            <div className="menu-browse__results-bar">
              <span>{filteredFoods.length} dishes available</span>
              <button type="button" onClick={clearFilters}>Reset view</button>
            </div>
          )}

          {loading ? (
            <motion.div
              className="menu-browse__grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <ModernSkeleton
                      variant="rectangle"
                      width="100%"
                      height={320}
                    />
                  </motion.div>
                ))}
            </motion.div>
          ) : filteredFoods.length > 0 ? (
            <motion.div
              className="menu-browse__grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredFoods.map((food) => (
                <motion.div key={food.id} variants={itemVariants}>
                  <ModernFoodCard
                    {...food}
                  quantity={cart.find((item) => item.id === food.id)?.quantity || 0}
                  onAddClick={() => updateCart(food, 1)}
                  onRemoveClick={() => updateCart(food, -1)}
                  onClick={() => { setRatingFood(food); setSelectedRating(0); setRatingComment(''); }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <ModernEmpty
              type="search"
              title="No Items Found"
              description={
                searchTerm
                  ? `No items matching "${searchTerm}". Try a different search term.`
                  : 'Try adjusting your filters to find what you are looking for.'
              }
              primaryCTA={{
                label: 'Clear Filters',
                onClick: clearFilters,
              }}
            />
          )}
        </section>

        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close cart"
                className="fixed inset-0 z-40 bg-slate-950/50"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
              />
              <motion.aside
                className="menu-cart-panel fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                aria-label="Your order"
              >
                <div className="menu-cart__header flex items-center justify-between border-b border-slate-200">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Table order</p><h2 className="m-0 text-2xl font-bold text-slate-900">{cartStep === 'cart' ? 'Your cart' : 'Checkout'}</h2><span className="menu-cart__item-count">{cart.length} {cart.length === 1 ? 'dish' : 'dishes'} selected</span></div>
                  <button type="button" onClick={() => setIsCartOpen(false)} className="menu-cart__close rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Close cart"><X size={22} /></button>
                </div>

                <ol className="menu-cart__steps" aria-label="Checkout progress">
                  <li className="is-active"><span>1</span> Food</li>
                  <li className={cartStep === 'checkout' ? 'is-active' : ''}><span>2</span> Checkout</li>
                  <li className={cartStep === 'checkout' && customerName && tableNumber ? 'is-active' : ''}><span>3</span> Pay</li>
                </ol>

                {cartStep === 'cart' ? (
                  <>
                    <div className="menu-cart__items space-y-3">
                      {cart.length ? cart.map((item) => (
                        <div key={item.id} className="menu-cart__item flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1"><strong className="block truncate text-slate-900">{item.name}</strong><span className="text-sm text-slate-500">Rs. {item.price} each</span></div>
                          <div className="menu-cart__quantity" aria-label={`${item.name} quantity`}><button type="button" onClick={() => updateCart(item, -1)} aria-label={`Remove one ${item.name}`}><Minus size={15} /></button><span>{item.quantity}</span><button type="button" onClick={() => updateCart(item, 1)} aria-label={`Add one ${item.name}`}><Plus size={15} /></button></div>
                        </div>
                      )) : <p className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">Your cart is empty. Add dishes from the menu.</p>}
                    </div>
                    {cart.length > 0 && <div className="menu-cart__cart-footer mt-auto border-t border-slate-200"><div><span>Food total</span><strong>Rs. {cartTotal}</strong></div><button type="button" onClick={() => setCartStep('checkout')} className="menu-cart__submit w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition">Continue to checkout <ChevronRight size={18} /></button></div>}
                  </>
                ) : cart.length > 0 && (
                  <div className="menu-cart__checkout mt-auto space-y-4 border-t border-slate-200">
                    <button type="button" className="menu-cart__back" onClick={() => setCartStep('cart')}><ChevronLeft size={17} /> Edit food order</button>
                    <div className="menu-cart__checkout-heading"><ReceiptText size={18} /><div><strong>Guest details</strong><span>Needed to send your order to the kitchen</span></div></div>
                    <div className="menu-cart__fields grid grid-cols-2 gap-3">
                      <label className="col-span-2 text-sm font-semibold text-slate-700">Name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>
                      <label className="text-sm font-semibold text-slate-700">Table<input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} placeholder="e.g. 12" inputMode="numeric" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>
                      <label className="text-sm font-semibold text-slate-700">Phone<input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Optional" inputMode="tel" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
                    </div>
                    <label className="menu-cart__payment text-sm font-semibold text-slate-700">Payment method<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="cash">Cash at counter</option><option value="razorpay">Online - UPI, card or netbanking</option></select></label>
                    {paymentMethod === 'razorpay' && <label className="block text-sm font-semibold text-slate-700">Email<input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="For your payment receipt" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required /></label>}
                    <CouponApplier shopId={restaurantId} cartTotal={cartTotal} onCouponApplied={setAppliedCoupon} />
                    <div className="menu-cart__summary space-y-1 rounded-xl p-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><strong>Rs. {cartTotal}</strong></div>{discountAmount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount ({appliedCoupon?.code})</span><strong>-Rs. {discountAmount}</strong></div>}<div className="flex justify-between"><span>GST (5%)</span><strong>Rs. {gst}</strong></div><div className="flex justify-between border-t border-slate-200 pt-2 text-base"><span className="font-bold">Total</span><strong>Rs. {finalTotal}</strong></div></div>
                    <button type="button" disabled={isPlacingOrder} onClick={placeOrder} className="menu-cart__submit w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition disabled:opacity-60">{isPlacingOrder ? 'Placing order...' : paymentMethod === 'razorpay' ? `Pay Rs. ${finalTotal}` : `Place order - Rs. ${finalTotal}`}</button>
                    <p className="menu-cart__assurance"><ShieldCheck size={15} /> Your table is held while this order is being placed.</p>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {showPaymentGateway && (
          <PaymentGateway amount={finalTotal} customerName={customerName} customerEmail={customerEmail} customerPhone={customerPhone} tableNumber={tableNumber} shopId={restaurantId} items={cart} couponCode={appliedCoupon?.code} discountAmount={discountAmount} subTotal={cartTotal}
            onClose={() => setShowPaymentGateway(false)}
            onSuccess={(order) => { setCart([]); setShowPaymentGateway(false); navigate(`/track-order/${order._id}`); }} />
        )}

        <AnimatePresence>
          {ratingFood && (
            <motion.div className="menu-rating-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`Rate ${ratingFood.name}`}>
              <button type="button" className="menu-rating-modal__backdrop" onClick={() => setRatingFood(null)} aria-label="Close rating" />
              <motion.div className="menu-rating-modal__card" initial={{ y: 24, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: .96 }}>
                <button type="button" className="menu-rating-modal__close" onClick={() => setRatingFood(null)} aria-label="Close"><X size={20} /></button>
                <p>How was it?</p><h2>Rate {ratingFood.name}</h2>
                <div className="menu-rating-modal__stars" aria-label="Select rating">{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} onClick={() => setSelectedRating(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`}><Star size={30} fill={star <= selectedRating ? 'currentColor' : 'none'} /></button>)}</div>
                <textarea value={ratingComment} onChange={(event) => setRatingComment(event.target.value)} placeholder="Tell other guests what you liked (optional)" maxLength={300} />
                <button type="button" className="menu-rating-modal__submit" onClick={submitRating} disabled={isSubmittingRating || !selectedRating}>{isSubmittingRating ? 'Saving...' : 'Submit rating'}</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ResponsiveLayout>
  );
};

export default MenuBrowsePage;
