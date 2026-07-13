import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  horizontal = true,
}) => {
  const scrollContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!horizontal) {
    return (
      <LayoutGroup id="vertical-categories">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => {
            const catId = category.id || category;
            const catName = category.name || category;
            const isActive = activeCategory === catId;
            return (
              <motion.button
                key={catId}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(catId)}
                className={`relative px-4 py-3 rounded-xl font-semibold transition-colors duration-250 ${
                  isActive
                    ? 'text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPillVertical"
                    className="absolute inset-0 bg-brand-600 rounded-xl -z-10 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {catName}
              </motion.button>
            );
          })}
        </motion.div>
      </LayoutGroup>
    );
  }

  return (
    <LayoutGroup id="horizontal-categories">
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg"
          >
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </motion.button>
        )}

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-12 sm:px-14 py-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange('All')}
            className={`relative px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-colors duration-250 flex-shrink-0 ${
              activeCategory === 'All'
                ? 'text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {activeCategory === 'All' && (
              <motion.div
                layoutId="activeCategoryPillHorizontal"
                className="absolute inset-0 bg-brand-600 rounded-full -z-10 shadow-md"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            All
          </motion.button>

          {categories.map((category) => {
            const catId = category.id || category;
            const catName = category.name || category;
            const isActive = activeCategory === catId;
            return (
              <motion.button
                key={catId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(catId)}
                className={`relative px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-colors duration-250 flex-shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPillHorizontal"
                    className="absolute inset-0 bg-brand-600 rounded-full -z-10 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {catName}
              </motion.button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg"
          >
            <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
          </motion.button>
        )}
      </div>
    </LayoutGroup>
  );
};

export default CategoryFilter;

