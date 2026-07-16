import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Leaf,
  Clock3,
  Star,
  ChefHat,
  Zap,
} from 'lucide-react';
import { CardImage } from './Card';
import Badge from './Badge';

const FoodCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviews,
  prepTime,
  category,
  badges = [],
  isVeg = true,
  isBestseller = false,
  isChefRecommended = false,
  isNew = false,
  quantity = 0,
  onAddClick,
  onFavoriteClick,
  isFavorite = false,
  onClick,
}) => {
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {/* Image Section */}
        <div className="relative overflow-hidden group aspect-square">
          <CardImage
            src={image}
            alt={name}
            className="group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
            {isVeg && (
              <Badge
                variant="success"
                size="sm"
                icon={Leaf}
              >
                Veg
              </Badge>
            )}
            {isBestseller && (
              <Badge
                variant="brand"
                size="sm"
                icon={Zap}
              >
                Bestseller
              </Badge>
            )}
            {isChefRecommended && (
              <Badge
                variant="info"
                size="sm"
                icon={ChefHat}
              >
                Chef Pick
              </Badge>
            )}
            {isNew && (
              <Badge
                variant="warning"
                size="sm"
              >
                New
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute bottom-3 left-3 bg-danger-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick?.(id);
            }}
            className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-slate-700 transition-all"
          >
            <Heart
              size={20}
              className={`${
                isFavorite
                  ? 'fill-danger-600 text-danger-600'
                  : 'text-slate-500'
              }`}
            />
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col h-full">
          {/* Title and Rating */}
          <div className="mb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate text-lg mb-2">
              {name}
            </h3>

            {rating && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-warning-500 fill-warning-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {rating.toFixed(1)}
                  </span>
                </div>
                {reviews && (
                  <span className="text-slate-500 dark:text-slate-400">
                    ({reviews})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Prep Time */}
          {prepTime && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <Clock3 size={14} />
              <span>{prepTime} mins</span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between mb-4 mt-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-slate-50">
                Rs {price}
              </span>
              {originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  Rs {originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button / Quantity Selector */}
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-50 dark:bg-brand-900/20 rounded-lg p-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick?.(id, -1);
                }}
                className="w-8 h-8 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded transition-colors"
              >
                −
              </motion.button>
              <span className="font-bold text-slate-900 dark:text-slate-50 min-w-8 text-center">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick?.(id, 1);
                }}
                className="w-8 h-8 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded transition-colors"
              >
                +
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddClick?.(id, 1);
              }}
              className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
