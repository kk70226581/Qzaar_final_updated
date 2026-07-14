import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/features/CategoryTabs.css';

/**
 * CategoryTabs - Horizontal scrollable category navigation
 * 
 * Features:
 * - Horizontal scroll on mobile
 * - Sticky positioning
 * - Active indicator
 * - Scroll buttons on desktop
 * - Smooth animations
 * - Touch-friendly
 * 
 * @example
 * <CategoryTabs
 *   categories={[
 *     { id: 1, name: 'Appetizers' },
 *     { id: 2, name: 'Main Course' },
 *   ]}
 *   activeId={1}
 *   onCategoryClick={(id) => setActive(id)}
 * />
 */

const CategoryTabs = ({
  categories = [],
  activeId,
  onCategoryClick,
  className = '',
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(false);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className={`category-tabs ${className}`}>
      {/* LEFT SCROLL BUTTON */}
      {showLeftScroll && (
        <button
          className="category-tabs__scroll category-tabs__scroll--left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* TABS CONTAINER */}
      <div
        ref={scrollContainerRef}
        className="category-tabs__container"
        onScroll={checkScroll}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              className={`category-tab ${
                category.id === activeId ? 'category-tab--active' : ''
              }`}
              onClick={() => onCategoryClick(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {Icon && <Icon size={16} className="category-tab__icon" />}
              <span>{category.name}</span>
              {category.id === activeId && (
                <motion.div
                  className="category-tab__indicator"
                  layoutId="category-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* RIGHT SCROLL BUTTON */}
      {showRightScroll && (
        <button
          className="category-tabs__scroll category-tabs__scroll--right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;
