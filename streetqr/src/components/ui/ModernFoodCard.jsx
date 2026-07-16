import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Minus,
  Leaf,
  Flame,
  Clock3,
  Star,
  ChefHat,
  Zap,
  Droplet,
  Sparkles,
} from 'lucide-react';
import ModernBadge from './ModernBadge';
import '../../styles/components/ModernFoodCard.css';

const FALLBACK_FOOD_IMAGE = '/images/brand/qzaar-restaurant-hero.png';

const ModernFoodCard = React.forwardRef(
  (
    {
      image,
      name,
      description,
      price,
      originalPrice,
      rating,
      reviews = 0,
      prepTime,
      category,
      calories,
      isVeg = true,
      isBestseller = false,
      isChefRecommended = false,
      isNew = false,
      isOutOfStock = false,
      customizations = [],
      quantity = 0,
      onAddClick,
      onRemoveClick,
      onFavoriteClick,
      isFavorite = false,
      onClick,
      className = '',
    },
    ref
  ) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageSource, setImageSource] = useState(image || FALLBACK_FOOD_IMAGE);
    const [showQuantity, setShowQuantity] = useState(quantity > 0);

    useEffect(() => {
      setImageLoading(true);
      setImageSource(image || FALLBACK_FOOD_IMAGE);
    }, [image]);

    const discountPercentage = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const handleAddClick = (e) => {
      e.stopPropagation();
      setShowQuantity(true);
      onAddClick?.();
    };

    const handleIncrement = (e) => {
      e.stopPropagation();
      onAddClick?.();
    };

    const handleDecrement = (e) => {
      e.stopPropagation();
      if (quantity <= 1) {
        setShowQuantity(false);
      }
      onRemoveClick?.();
    };

    const handleFavoriteClick = (e) => {
      e.stopPropagation();
      onFavoriteClick?.();
    };

    return (
      <motion.div
        ref={ref}
        className={`modern-food-card ${isOutOfStock ? 'modern-food-card--out-of-stock' : ''} ${className}`}
        onClick={onClick}
        whileHover={!isOutOfStock ? { y: -4 } : {}}
        whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modern-food-card__image-wrapper">
          {imageLoading && (
            <div className="modern-food-card__skeleton">
              <div className="modern-food-card__shimmer" />
            </div>
          )}

          <img
            src={imageSource}
            alt={name}
            className="modern-food-card__image"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              if (imageSource !== FALLBACK_FOOD_IMAGE) {
                setImageSource(FALLBACK_FOOD_IMAGE);
                return;
              }
              setImageLoading(false);
            }}
          />

          <div className="modern-food-card__badges">
            {isVeg && (
              <div className="modern-food-card__badge-item modern-food-card__badge-item--veg">
                <div className="modern-food-card__veg-icon">
                  <Leaf size={12} />
                </div>
              </div>
            )}

            {!isVeg && (
              <div className="modern-food-card__badge-item modern-food-card__badge-item--non-veg">
                <div className="modern-food-card__veg-icon">
                  <Flame size={12} />
                </div>
              </div>
            )}

            {isBestseller && (
              <ModernBadge variant="warning" size="sm" className="modern-food-card__badge">
                <Star size={12} /> Bestseller
              </ModernBadge>
            )}

            {isChefRecommended && (
              <ModernBadge variant="primary" size="sm" className="modern-food-card__badge">
                <ChefHat size={12} /> Chef's Pick
              </ModernBadge>
            )}

            {isNew && (
              <ModernBadge variant="info" size="sm" className="modern-food-card__badge">
                <Sparkles size={12} /> New
              </ModernBadge>
            )}
          </div>

          {isOutOfStock && (
            <div className="modern-food-card__overlay-out-of-stock">
              <span>Out of Stock</span>
            </div>
          )}

          {discountPercentage > 0 && !isOutOfStock && (
            <div className="modern-food-card__discount-badge">
              -{discountPercentage}%
            </div>
          )}

          {discountPercentage === 0 && (
            <button
              className={`modern-food-card__favorite-btn ${isFavorite ? 'modern-food-card__favorite-btn--active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className="modern-food-card__favorite-icon"
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>

        <div className="modern-food-card__content">
          <div className="modern-food-card__header">
            <div className="modern-food-card__title-section">
              <h3 className="modern-food-card__name">{name}</h3>
              {category && (
                <p className="modern-food-card__category">{category}</p>
              )}
            </div>

            {rating && (
              <div className="modern-food-card__rating">
                <Star size={16} className="modern-food-card__star-icon" />
                <span className="modern-food-card__rating-value">
                  {rating.toFixed(1)}
                </span>
                {reviews > 0 && (
                  <span className="modern-food-card__reviews-count">
                    ({reviews})
                  </span>
                )}
              </div>
            )}
          </div>

          {description && (
            <p className="modern-food-card__description">{description}</p>
          )}

          <div className="modern-food-card__info-badges">
            {prepTime && (
              <div className="modern-food-card__info-badge">
                <Clock3 size={14} />
                <span>{prepTime} min</span>
              </div>
            )}

            {calories && (
              <div className="modern-food-card__info-badge">
                <Droplet size={14} />
                <span>{calories} cal</span>
              </div>
            )}

            {customizations && customizations.length > 0 && (
              <div className="modern-food-card__info-badge">
                <Zap size={14} />
                <span>{customizations.length} options</span>
              </div>
            )}
          </div>

          <div className="modern-food-card__footer">
            <div className="modern-food-card__price-section">
              <div className="modern-food-card__price-row">
                <span className="modern-food-card__price">Rs. {price}</span>
                {originalPrice && originalPrice > price && (
                  <span className="modern-food-card__original-price">
                    Rs. {originalPrice}
                  </span>
                )}
              </div>
            </div>

            {!isOutOfStock && (
              <div className="modern-food-card__action">
                {showQuantity && quantity > 0 ? (
                  <div className="modern-food-card__quantity-selector">
                    <button
                      className="modern-food-card__qty-btn"
                      onClick={handleDecrement}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="modern-food-card__qty-value">{quantity}</span>
                    <button
                      className="modern-food-card__qty-btn"
                      onClick={handleIncrement}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="modern-food-card__add-btn"
                    onClick={handleAddClick}
                    aria-label={`Add ${name} to cart`}
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

ModernFoodCard.displayName = 'ModernFoodCard';

export default ModernFoodCard;
