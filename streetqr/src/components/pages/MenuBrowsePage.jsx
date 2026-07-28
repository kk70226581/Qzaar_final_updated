import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  CakeSlice,
  ChefHat,
  Clock3,
  CupSoda,
  Drumstick,
  Filter,
  Leaf,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  ShieldCheck,
  UtensilsCrossed,
  X,
  User,
  Hash,
  Banknote,
  Mail,
  Phone,
  CreditCard,
  QrCode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  ModernSkeleton,
  ModernEmpty,
  ModernError,
} from '../ui';
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

const getFoodImage = (item) => {
  const existingImage = item.image || '';
  const isPlaceholder = !existingImage || /\/images\/(showcase|landing|brand)\//.test(existingImage);
  if (!isPlaceholder) return existingImage;

  const name = (item.name || '').toLowerCase();
  const category = (item.categoryId || item.category || '').toLowerCase();
  if (/naan/.test(name)) return '/images/menu/garlic-naan.png';
  if (/chicken|tandoori|feast/.test(name)) return '/images/menu/tandoori-chicken.png';
  if (/thali|dal makhani/.test(name)) return '/images/menu/chefs-thali.png';
  if (/gulab|rasmalai|kulfi/.test(name)) return '/images/menu/gulab-jamun.png';
  if (/cold coffee/.test(name)) return '/images/menu/cold-coffee.png';
  if (category.includes('dessert')) return '/images/menu/sizzling-brownie.png';
  if (category.includes('beverage') || category.includes('drink')) return '/images/menu/masala-chai.png';
  if (!item.isVeg || /biryani|rice/i.test(name)) return '/images/menu/biryani.png';
  return '/images/menu/paneer-tikka.png';
};

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
        setFoods(mockFoods.map((item) => ({ ...item, image: getFoodImage(item) })));
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
      setFoods(liveFoods.map((item) => ({ ...item, image: getFoodImage(item) })));
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
    const restaurantName = shop?.shopName || 'Our restaurant';
    const qzaarHeroImage = '/images/brand/qzaar-table-service-hero.png';
    return [
      {
        eyebrow: `Welcome to ${restaurantName}`,
        title: shop?.heroHeadline || 'A table experience made for good food.',
        description: shop?.tagline || 'Browse the menu, choose your favourites, and enjoy your time at the table.',
        image: '/images/brand/qzaar-guest-welcome-hero.png',
        label: shop?.cuisineType || 'Restaurant menu',
      },
      {
        eyebrow: 'Powered by Qzaar',
        title: 'Scan. Choose. Enjoy the moment.',
        description: 'A simple digital menu that helps guests order with ease while your restaurant stays in sync.',
        image: qzaarHeroImage,
        label: 'Smart table ordering',
      },
    ];
  }, [shop]);

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

  // Group foods by category when "All items" is selected
  // Must be declared BEFORE any early returns to follow React hooks rules
  const groupedFoods = useMemo(() => {
    if (selectedCategory !== 'all') return null;
    const groups = {};
    filteredFoods.forEach(food => {
      const cat = dynamicCategories.find(c => c.id === (food.categoryId || food.category))?.name || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(food);
    });
    return groups;
  }, [filteredFoods, selectedCategory, dynamicCategories]);

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
    <div className="menu-browse">
      {/* 1. RESTAURANT HERO BANNER */}
      <header className="menu-browse__hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide.image}
            className="menu-browse__hero-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <img className="menu-browse__hero-img menu-browse__hero-img--ambient" src={currentHeroSlide.image} alt="" aria-hidden="true" />
            <img className="menu-browse__hero-img menu-browse__hero-img--full" src={currentHeroSlide.image} alt={currentHeroSlide.title} />
          </motion.div>
        </AnimatePresence>
        <div className="menu-browse__hero-overlay" />
        
        <div className="menu-browse__hero-top-right">
          <button className="menu-browse__icon-btn" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={20} />
          </button>
          <button className="menu-browse__icon-btn menu-browse__cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="menu-browse__cart-badge">{cartCount}</span>}
          </button>
        </div>

        <div className="menu-browse__hero-content">
          <span className="menu-browse__hero-eyebrow">{currentHeroSlide.label}</span>
          <h1 className="menu-browse__hero-title">{currentHeroSlide.title}</h1>
          <p className="menu-browse__hero-subtitle">{currentHeroSlide.description}</p>
          <div className="menu-browse__hero-stats-row">
            <span><Star size={16} fill="currentColor" /> {shop?.rating || '4.8'}</span>
            <span><Clock3 size={16} /> {shop?.avgPrepTime || '25'} min</span>
            <span><UtensilsCrossed size={16} /> {foods.length} items</span>
          </div>
          <div className="menu-browse__hero-qzaar">
            <span><QrCode size={15} /> Powered by Qzaar</span>
            <i />
            <small>Scan · Browse · Order</small>
          </div>
        </div>

        <div className="menu-browse__hero-dots">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx} 
              className={`menu-browse__hero-dot ${idx === activeHeroSlide ? 'active' : ''}`}
              onClick={() => setActiveHeroSlide(idx)}
            />
          ))}
        </div>
      </header>

      {/* 2. CATEGORY NAVIGATION */}
      <nav className="menu-browse__cat-nav">
        <div className="menu-browse__cat-scroll">
          {dynamicCategories.map(cat => {
            const Icon = cat.icon || UtensilsCrossed;
            return (
              <button 
                key={cat.id} 
                className={`menu-browse__cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            )
          })}
          <button 
            className={`menu-browse__cat-pill veg-toggle ${vegOnly ? 'active' : ''}`}
            onClick={() => setVegOnly(!vegOnly)}
          >
            <Leaf size={16} />
            Veg Only
          </button>
        </div>
      </nav>

      {/* 3. SEARCH + FILTER BAR */}
      <div className="menu-browse__search-bar-wrapper">
        <div className="menu-browse__search-bar">
          <Search size={20} className="menu-browse__search-icon" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="menu-browse__filter-btn" onClick={() => setShowFilters(true)}>
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 4. MENU GRID */}
      <main className="menu-browse__main-content">
        {loading ? (
          <div className="menu-browse__grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="menu-browse__skeleton-card">
                <ModernSkeleton variant="rectangle" height={200} className="menu-browse__skel-img" />
                <div className="menu-browse__skel-body">
                  <ModernSkeleton variant="text" width="70%" height={24} />
                  <ModernSkeleton variant="text" width="90%" height={16} />
                  <ModernSkeleton variant="text" width="40%" height={16} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <ModernEmpty
            type="search"
            title="No Items Found"
            description={searchTerm ? `No items matching "${searchTerm}".` : 'Try adjusting your filters.'}
            primaryCTA={{ label: 'Clear Filters', onClick: clearFilters }}
          />
        ) : groupedFoods ? (
          <div className="menu-browse__sections">
            {Object.entries(groupedFoods).map(([catName, items]) => (
              <section key={catName} className="menu-browse__section">
                <h2 className="menu-browse__section-title">
                  {catName} <span>{items.length} items</span>
                </h2>
                <div className="menu-browse__grid">
                  {items.map(food => renderFoodCard(food))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="menu-browse__grid">
            {filteredFoods.map(food => renderFoodCard(food))}
          </div>
        )}
      </main>

      {/* 5. FLOATING CART BUTTON */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.div 
            className="menu-browse__floating-cart-wrapper"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="menu-browse__floating-cart">
              <div className="menu-browse__floating-cart-info">
                <span className="menu-browse__floating-cart-count">{cartCount} items</span>
                <span className="menu-browse__floating-cart-total">₹{cartTotal}</span>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="menu-browse__floating-cart-btn">
                View Cart &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className="menu-browse__backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside 
              className="menu-browse__cart-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="menu-browse__cart-header">
                <div>
                  <h2>Your Order</h2>
                  <p>{shop?.shopName || 'Restaurant'}</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="menu-browse__close-btn"><X size={24} /></button>
              </div>

              <div className="menu-browse__cart-body">
                {cartStep === 'cart' ? (
                  <>
                    <div className="menu-browse__cart-items">
                      {cart.length === 0 ? (
                        <p className="menu-browse__cart-empty">Your cart is empty.</p>
                      ) : cart.map(item => (
                        <div key={item.id} className="menu-browse__cart-item">
                          <img src={item.image} alt={item.name} />
                          <div className="menu-browse__cart-item-info">
                            <h4>{item.name}</h4>
                            <span>₹{item.price}</span>
                          </div>
                          <div className="menu-browse__cart-item-actions">
                            <button onClick={() => updateCart(item, -1)}><Minus size={16} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCart(item, 1)}><Plus size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {cart.length > 0 && (
                      <div className="menu-browse__cart-footer">
                        <CouponApplier shopId={restaurantId} cartTotal={cartTotal} onCouponApplied={setAppliedCoupon} />
                        <div className="menu-browse__cart-summary">
                          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                          {discountAmount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{discountAmount}</span></div>}
                          <div className="summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
                          <div className="summary-row total"><span>Total</span><span>₹{finalTotal}</span></div>
                        </div>
                        <button className="menu-browse__primary-btn" onClick={() => setCartStep('checkout')}>
                          Proceed to Details
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="menu-browse__checkout-form">
                    <button className="menu-browse__back-btn" onClick={() => setCartStep('cart')}><ChevronLeft size={20} /> Back to cart</button>
                    
                    {/* Mini Order Summary */}
                    <div className="checkout-mini-summary">
                      <div className="checkout-mini-summary__row">
                        <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="checkout-mini-summary__row checkout-mini-summary__discount">
                          <span>Discount</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="checkout-mini-summary__row">
                        <span>GST (5%)</span>
                        <span>₹{gst}</span>
                      </div>
                      <div className="checkout-mini-summary__row checkout-mini-summary__total">
                        <span>Total</span>
                        <span>₹{finalTotal}</span>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <h4 className="checkout-section-title"><User size={18} /> Your Details</h4>
                    
                    <div className="checkout-field">
                      <label><User size={14} /> Full Name <span className="required">*</span></label>
                      <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter your name" />
                    </div>
                    
                    <div className="checkout-field">
                      <label><Hash size={14} /> Table Number <span className="required">*</span></label>
                      <input type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. 12" />
                    </div>
                    
                    <div className="checkout-field">
                      <label><Phone size={14} /> Phone <span className="optional">(optional)</span></label>
                      <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" />
                    </div>

                    {/* Payment Method */}
                    <h4 className="checkout-section-title"><CreditCard size={18} /> Payment</h4>
                    
                    <div className="checkout-payment-options">
                      <button 
                        type="button"
                        className={`checkout-payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <Banknote size={22} />
                        <div>
                          <strong>Cash / Counter</strong>
                          <small>Pay when you receive</small>
                        </div>
                        <div className={`checkout-radio ${paymentMethod === 'cash' ? 'checked' : ''}`} />
                      </button>
                      <button 
                        type="button"
                        className={`checkout-payment-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('razorpay')}
                      >
                        <CreditCard size={22} />
                        <div>
                          <strong>Pay Online</strong>
                          <small>UPI, Cards, Wallets</small>
                        </div>
                        <div className={`checkout-radio ${paymentMethod === 'razorpay' ? 'checked' : ''}`} />
                      </button>
                    </div>

                    {paymentMethod === 'razorpay' && (
                      <div className="checkout-field">
                        <label><Mail size={14} /> Email <span className="required">*</span></label>
                        <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="your@email.com" />
                      </div>
                    )}

                    {/* Secure Badge */}
                    <div className="checkout-secure-badge">
                      <ShieldCheck size={16} />
                      <span>Secure checkout · Order goes directly to kitchen</span>
                    </div>
                    
                    <button className="menu-browse__primary-btn checkout-place-btn" disabled={isPlacingOrder} onClick={placeOrder}>
                      {isPlacingOrder ? 'Processing...' : `Place Order · ₹${finalTotal}`}
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* FILTER BOTTOM SHEET */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              className="menu-browse__backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
            />
            <motion.div 
              className="menu-browse__filter-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="filter-sheet-header">
                <h3>Filters & Sort</h3>
                <button onClick={() => setShowFilters(false)}><X size={24} /></button>
              </div>
              <div className="filter-sheet-body">
                <div className="filter-section">
                  <label>Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
                    <option value="popular">Popularity</option>
                    <option value="rating">Top Rated</option>
                    <option value="fastest">Fastest Prep</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>
                
                <div className="filter-section">
                  <label>Max Prep Time ({filters.maxPrepTime} mins)</label>
                  <input type="range" min="5" max="60" step="5" value={filters.maxPrepTime} onChange={e => setFilters({...filters, maxPrepTime: parseInt(e.target.value)})} />
                </div>
                
                <div className="filter-section">
                  <label>Min Rating ({filters.minRating} stars)</label>
                  <input type="range" min="0" max="5" step="0.5" value={filters.minRating} onChange={e => setFilters({...filters, minRating: parseFloat(e.target.value)})} />
                </div>

                <div className="filter-section price-range">
                  <label>Price Range</label>
                  <div className="inputs">
                    <input type="number" placeholder="Min" value={filters.priceMin} onChange={e => setFilters({...filters, priceMin: parseInt(e.target.value) || 0})} />
                    <span>-</span>
                    <input type="number" placeholder="Max" value={filters.priceMax} onChange={e => setFilters({...filters, priceMax: parseInt(e.target.value) || 1000})} />
                  </div>
                </div>

                <label className="filter-checkbox">
                  <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                  <span>Vegetarian Only</span>
                </label>
              </div>
              <div className="filter-sheet-footer">
                <button className="clear-btn" onClick={clearFilters}>Clear All</button>
                <button className="apply-btn" onClick={() => setShowFilters(false)}>Apply Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* RATING MODAL */}
      <AnimatePresence>
        {ratingFood && (
          <div className="menu-rating-modal">
            <div className="menu-rating-modal__backdrop" onClick={() => setRatingFood(null)} />
            <motion.div className="menu-rating-modal__card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <button className="menu-rating-modal__close" onClick={() => setRatingFood(null)}><X size={20} /></button>
              <h3>Rate {ratingFood.name}</h3>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setSelectedRating(star)}>
                    <Star size={32} fill={star <= selectedRating ? '#f59e0b' : 'none'} color={star <= selectedRating ? '#f59e0b' : '#cbd5e1'} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Write a comment..." value={ratingComment} onChange={e => setRatingComment(e.target.value)}></textarea>
              <button className="menu-browse__primary-btn" onClick={submitRating} disabled={!selectedRating || isSubmittingRating}>
                {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showPaymentGateway && (
        <PaymentGateway amount={finalTotal} customerName={customerName} customerEmail={customerEmail} customerPhone={customerPhone} tableNumber={tableNumber} shopId={restaurantId} items={cart} couponCode={appliedCoupon?.code} discountAmount={discountAmount} subTotal={cartTotal}
          onClose={() => setShowPaymentGateway(false)}
          onSuccess={(order) => { setCart([]); setShowPaymentGateway(false); navigate(`/track-order/${order._id}`); }} />
      )}
    </div>
  );

  function renderFoodCard(food) {
    const qty = cart.find(i => i.id === food.id)?.quantity || 0;
    
    return (
      <div key={food.id} className={`menu-browse__food-card ${qty > 0 ? 'in-cart' : ''}`}>
        <div className="food-card-img-wrapper" onClick={() => { setRatingFood(food); setSelectedRating(0); setRatingComment(''); }}>
          <img src={food.image} alt={food.name} />
          <div className="food-card-badges">
            {food.isBestseller && <span className="badge bestseller">BESTSELLER</span>}
            {food.isChefRecommended && <span className="badge chef">CHEF'S PICK</span>}
            {food.isNew && <span className="badge new">NEW</span>}
          </div>
          <div className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`}></div>
        </div>
        <div className="food-card-body">
          <div className="food-card-header" onClick={() => { setRatingFood(food); setSelectedRating(0); setRatingComment(''); }}>
            <h3 className="food-title">{food.name}</h3>
            <p className="food-desc">{food.description}</p>
          </div>
          <div className="food-card-meta">
            <span className="rating"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {food.rating} ({food.reviews})</span>
            <span className="prep-time"><Clock3 size={14} /> {food.prepTime}m</span>
          </div>
          <div className="food-card-footer">
            <div className="price-info">
              <span className="price">₹{food.price}</span>
              {food.originalPrice && <span className="original-price">₹{food.originalPrice}</span>}
            </div>
            
            {qty > 0 ? (
              <div className="food-qty-stepper">
                <button onClick={() => updateCart(food, -1)}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => updateCart(food, 1)}><Plus size={16} /></button>
              </div>
            ) : (
              <button className="add-btn" onClick={() => updateCart(food, 1)}><Plus size={20} /></button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default MenuBrowsePage;
