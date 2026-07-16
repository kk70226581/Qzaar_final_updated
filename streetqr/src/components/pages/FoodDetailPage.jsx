import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Clock,
  Flame,
  Leaf,
} from 'lucide-react';
import {
  ModernButton,
  ModernBadge,
  ModernSkeleton,
  ModernError,
} from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/FoodDetailPage.css';

/**
 * FoodDetailPage - Detailed food item view with customization
 * 
 * Features:
 * - Image gallery with carousel
 * - Item details and nutrition
 * - Customization options (size, spice level, add-ons)
 * - Customer reviews section
 * - Related items carousel
 * - Add to cart with quantity
 * - Favorite/share functionality
 * - Loading and error states
 */

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();

  // State
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedSpice, setSelectedSpice] = useState('medium');
  const [addOns, setAddOns] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch food details
  useEffect(() => {
    fetchFoodDetails();
  }, [foodId]);

  const fetchFoodDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data
      const mockItem = {
        id: 1,
        name: 'Butter Paneer Tikka',
        description: 'Creamy paneer in rich butter sauce with aromatic spices',
        price: 299,
        originalPrice: 350,
        rating: 4.8,
        ratingCount: 245,
        prepTime: 15,
        calories: 280,
        images: [
          '/images/food1-main.jpg',
          '/images/food1-alt1.jpg',
          '/images/food1-alt2.jpg',
        ],
        details: {
          veg: true,
          spiceLevel: 'medium',
          servings: '2-3 people',
          preparationMethod: 'Grilled',
          cuisine: 'Indian',
        },
        nutrition: {
          calories: 280,
          protein: 18,
          carbs: 12,
          fat: 14,
          fiber: 2,
        },
        sizes: [
          { id: 'small', name: 'Small', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
          { id: 'large', name: 'Large', price: 50 },
        ],
        spiceLevels: [
          { id: 'mild', name: 'Mild' },
          { id: 'medium', name: 'Medium' },
          { id: 'spicy', name: 'Spicy' },
          { id: 'extraSpicy', name: 'Extra Spicy' },
        ],
        addOns: [
          { id: 'extraChees', name: 'Extra Cheese', price: 50, selected: false },
          { id: 'extraSauce', name: 'Extra Sauce', price: 30, selected: false },
          { id: 'croutons', name: 'Croutons', price: 20, selected: false },
        ],
        reviews: [
          {
            id: 1,
            author: 'John Doe',
            rating: 5,
            date: '2 days ago',
            text: 'Absolutely delicious! Best paneer dish I\'ve had.',
            helpful: 24,
          },
          {
            id: 2,
            author: 'Jane Smith',
            rating: 4,
            date: '1 week ago',
            text: 'Great taste, portion could be bigger.',
            helpful: 12,
          },
        ],
        relatedItems: [
          {
            id: 2,
            name: 'Tandoori Chicken',
            price: 349,
            rating: 4.7,
            image: '/images/food2.jpg',
          },
          {
            id: 3,
            name: 'Shahi Tukda',
            price: 149,
            rating: 4.6,
            image: '/images/food3.jpg',
          },
          {
            id: 4,
            name: 'Dal Makhani',
            price: 199,
            rating: 4.8,
            image: '/images/food4.jpg',
          },
        ],
      };

      setItem(mockItem);
      setTotalPrice(mockItem.price);
    } catch (err) {
      setError({
        type: 'network',
        title: 'Failed to Load Item',
        message: 'Unable to fetch food details',
        errorCode: 'ERR_ITEM_LOAD',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  useEffect(() => {
    if (!item) return;

    let total = item.price;

    // Add size price
    const size = item.sizes.find(s => s.id === selectedSize);
    if (size) total += size.price;

    // Add add-ons
    item.addOns.forEach(addon => {
      if (addOns[addon.id]) total += addon.price;
    });

    setTotalPrice((total * quantity).toFixed(0));
  }, [selectedSize, addOns, quantity, item]);

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="food-detail__loading">
          <ModernSkeleton variant="rectangle" width="100%" height={400} />
          <ModernSkeleton variant="text" count={5} />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout>
        <ModernError
          {...error}
          primaryCTA={{
            label: 'Try Again',
            onClick: fetchFoodDetails,
          }}
          secondaryCTA={{
            label: 'Go Back',
            onClick: () => navigate(-1),
          }}
        />
      </ResponsiveLayout>
    );
  }

  if (!item) return null;

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

  return (
    <ResponsiveLayout>
      <motion.main
        className="food-detail"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <header className="food-detail__header">
          <button
            className="food-detail__back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="food-detail__title">{item.name}</h1>
          <div className="food-detail__header-actions">
            <button
              className={`food-detail__favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Add to favorites"
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              className="food-detail__share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: item.name,
                    text: item.description,
                    url: window.location.href,
                  });
                }
              }}
              aria-label="Share"
            >
              <Share2 size={24} />
            </button>
          </div>
        </header>

        {/* IMAGE GALLERY */}
        <motion.section
          className="food-detail__gallery"
          variants={itemVariants}
        >
          <div className="food-detail__image-main">
            <img
              src={item.images[currentImageIndex]}
              alt={item.name}
              onError={(e) => (e.target.src = '/images/placeholder.jpg')}
            />
            <div className="food-detail__badges">
              {item.details.veg && (
                <ModernBadge variant="success" size="sm">
                  <Leaf size={14} /> Veg
                </ModernBadge>
              )}
              <ModernBadge variant="primary" size="sm">
                <Star size={14} /> {item.rating}
              </ModernBadge>
            </div>
          </div>

          {item.images.length > 1 && (
            <div className="food-detail__thumbnails">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`food-detail__thumbnail ${
                    idx === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`${item.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* DETAILS */}
        <motion.section
          className="food-detail__details"
          variants={itemVariants}
        >
          <div className="food-detail__info">
            <p className="food-detail__description">
              {item.description}
            </p>

            <div className="food-detail__meta">
              <div className="food-detail__meta-item">
                <Clock size={18} />
                <span>{item.prepTime} mins</span>
              </div>
              <div className="food-detail__meta-item">
                <Flame size={18} />
                <span>{item.calories} cal</span>
              </div>
              <div className="food-detail__meta-item">
                <Star size={18} />
                <span>
                  {item.rating} ({item.ratingCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="food-detail__pricing">
            <div className="food-detail__price">
              <span className="food-detail__price-current">₹{totalPrice}</span>
              {item.originalPrice > item.price && (
                <span className="food-detail__price-original">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>
            <div className="food-detail__discount">
              Save ₹{(item.originalPrice - item.price).toFixed(0)}
            </div>
          </div>
        </motion.section>

        <div className="food-detail__container">
          <div className="food-detail__main">
            {/* CUSTOMIZATION */}
            <motion.section
              className="food-detail__customization"
              variants={itemVariants}
            >
              <h2 className="food-detail__section-title">
                Customize Your Meal
              </h2>

              {/* SIZE SELECTION */}
              <div className="food-detail__option">
                <label className="food-detail__option-label">
                  Size
                </label>
                <div className="food-detail__options-grid">
                  {item.sizes.map(size => (
                    <button
                      key={size.id}
                      className={`food-detail__option-btn ${
                        selectedSize === size.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <span className="food-detail__option-name">
                        {size.name}
                      </span>
                      {size.price > 0 && (
                        <span className="food-detail__option-price">
                          +₹{size.price}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPICE LEVEL */}
              <div className="food-detail__option">
                <label className="food-detail__option-label">
                  Spice Level
                </label>
                <div className="food-detail__options-grid">
                  {item.spiceLevels.map(level => (
                    <button
                      key={level.id}
                      className={`food-detail__option-btn ${
                        selectedSpice === level.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedSpice(level.id)}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ADD-ONS */}
              <div className="food-detail__option">
                <label className="food-detail__option-label">
                  Add-ons (Optional)
                </label>
                <div className="food-detail__addons">
                  {item.addOns.map(addon => (
                    <label
                      key={addon.id}
                      className="food-detail__addon"
                    >
                      <input
                        type="checkbox"
                        checked={addOns[addon.id] || false}
                        onChange={(e) =>
                          setAddOns({
                            ...addOns,
                            [addon.id]: e.target.checked,
                          })
                        }
                      />
                      <span className="food-detail__addon-name">
                        {addon.name}
                      </span>
                      <span className="food-detail__addon-price">
                        +₹{addon.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="food-detail__option">
                <label className="food-detail__option-label">
                  Quantity
                </label>
                <div className="food-detail__quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.section>

            {/* NUTRITION */}
            <motion.section
              className="food-detail__nutrition"
              variants={itemVariants}
            >
              <h2 className="food-detail__section-title">
                Nutrition Information
              </h2>
              <div className="food-detail__nutrition-grid">
                {[
                  { label: 'Calories', value: item.nutrition.calories, unit: 'kcal' },
                  { label: 'Protein', value: item.nutrition.protein, unit: 'g' },
                  { label: 'Carbs', value: item.nutrition.carbs, unit: 'g' },
                  { label: 'Fat', value: item.nutrition.fat, unit: 'g' },
                  { label: 'Fiber', value: item.nutrition.fiber, unit: 'g' },
                ].map((nutrient, idx) => (
                  <div key={idx} className="food-detail__nutrition-item">
                    <span className="food-detail__nutrition-label">
                      {nutrient.label}
                    </span>
                    <span className="food-detail__nutrition-value">
                      {nutrient.value}{nutrient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* REVIEWS */}
            <motion.section
              className="food-detail__reviews"
              variants={itemVariants}
            >
              <h2 className="food-detail__section-title">
                Customer Reviews
              </h2>
              <div className="food-detail__reviews-list">
                {item.reviews.map(review => (
                  <div key={review.id} className="food-detail__review">
                    <div className="food-detail__review-header">
                      <div className="food-detail__review-author">
                        {review.author}
                      </div>
                      <div className="food-detail__review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="food-detail__review-text">
                      {review.text}
                    </p>
                    <div className="food-detail__review-footer">
                      <span className="food-detail__review-date">
                        {review.date}
                      </span>
                      <button className="food-detail__review-helpful">
                        👍 {review.helpful}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* SIDEBAR - ADD TO CART */}
          <motion.aside
            className="food-detail__sidebar"
            variants={itemVariants}
          >
            <div className="food-detail__cart-summary">
              <div className="food-detail__summary-row">
                <span>Item Total</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="food-detail__summary-row">
                <span>Delivery Fee</span>
                <span className="food-detail__free">FREE</span>
              </div>
              <div className="food-detail__summary-row">
                <span>GST & Other Taxes</span>
                <span>₹{(totalPrice * 0.05).toFixed(0)}</span>
              </div>
              <div className="food-detail__summary-divider" />
              <div className="food-detail__summary-row food-detail__summary-total">
                <span>Total Amount</span>
                <span>₹{(totalPrice * 1.05).toFixed(0)}</span>
              </div>

              <ModernButton
                variant="primary"
                size="lg"
                className="food-detail__add-to-cart"
                onClick={() => {
                  console.log('Added to cart:', {
                    itemId: item.id,
                    quantity,
                    selectedSize,
                    selectedSpice,
                    addOns,
                    totalPrice,
                  });
                  navigate('/modern/cart');
                }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </ModernButton>
            </div>
          </motion.aside>
        </div>

        {/* RELATED ITEMS */}
        <motion.section
          className="food-detail__related"
          variants={itemVariants}
        >
          <h2 className="food-detail__section-title">
            You Might Also Like
          </h2>
          <div className="food-detail__related-grid">
            {item.relatedItems.map(relItem => (
              <button
                key={relItem.id}
                className="food-detail__related-item"
                onClick={() => navigate(`/modern/food/${relItem.id}`)}
              >
                <div className="food-detail__related-image">
                  <img
                    src={relItem.image}
                    alt={relItem.name}
                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                  />
                </div>
                <h3 className="food-detail__related-name">
                  {relItem.name}
                </h3>
                <div className="food-detail__related-footer">
                  <span className="food-detail__related-price">
                    ₹{relItem.price}
                  </span>
                  <span className="food-detail__related-rating">
                    ⭐ {relItem.rating}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </ResponsiveLayout>
  );
};

export default FoodDetailPage;
