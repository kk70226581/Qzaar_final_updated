import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  CakeSlice,
  ChefHat,
  Clock3,
  CupSoda,
  Drumstick,
  Filter,
  Leaf,
  ScanLine,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import {
  ModernFoodCard,
  ModernInput,
  ModernSkeleton,
  ModernEmpty,
  ModernError,
} from '../ui';
import CategoryTabs from '../features/CategoryTabs';
import ResponsiveLayout from '../layout/ResponsiveLayout';
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
  { icon: Sparkles, value: '32+', label: 'Fresh picks' },
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

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setFoods(mockFoods);
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
      filtered = filtered.filter(food => food.category === selectedCategory);
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
              Fresh from the kitchen
            </span>
            <h1 className="menu-browse__title">Browse Our Menu</h1>
            <p className="menu-browse__subtitle">
              Search, sort, filter, and build the perfect table order in seconds.
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
              <button type="button" onClick={() => navigate('/modern/cart')}>
                <ShoppingCart size={18} />
                View cart
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
            <img src="/images/ads/menu-cartoon-banner.png" alt="Cartoon QR menu preview" />
            <div>
              <span>Now serving</span>
              <strong>Cartoon-fresh picks with fast checkout</strong>
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
              categories={categories}
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
                    onAddClick={() => {
                      navigate(`/modern/food/${food.id}`);
                    }}
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
      </main>
    </ResponsiveLayout>
  );
};

export default MenuBrowsePage;
