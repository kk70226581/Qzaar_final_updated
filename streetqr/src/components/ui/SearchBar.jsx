import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Volume2,
} from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search food, categories...',
  recentSearches = [],
  trendingSearches = [],
  onRecentClick,
  onTrendingClick,
  onClear,
  onVoiceSearch,
  hasFocus = false,
}) => {
  const [internalFocus, setInternalFocus] = useState(false);
  const isFocused = hasFocus || internalFocus;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => {
            setInternalFocus(true);
            onFocus?.();
          }}
          onBlur={() => {
            setInternalFocus(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-12 py-3 rounded-2xl border-2 border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onChange?.('');
                onClear?.();
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={18} className="text-slate-500" />
            </motion.button>
          )}
          {onVoiceSearch && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onVoiceSearch}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <Volume2 size={18} className="text-brand-600 dark:text-brand-400" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-96 overflow-y-auto"
          >
            {/* Recent Searches */}
            {!value && recentSearches.length > 0 && (
              <div className="p-4">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Recent Searches
                </h4>
                <div className="space-y-2">
                  {recentSearches.map((search, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4 }}
                      onClick={() => onRecentClick?.(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {search}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <hr className="my-4 border-slate-200 dark:border-slate-700" />
              </div>
            )}

            {/* Trending Searches */}
            {!value && trendingSearches.length > 0 && (
              <div className="p-4">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Trending Now
                </h4>
                <div className="space-y-2">
                  {trendingSearches.map((search, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4 }}
                      onClick={() => onTrendingClick?.(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <TrendingUp size={16} className="text-brand-600 dark:text-brand-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {search}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!value && recentSearches.length === 0 && trendingSearches.length === 0 && (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto mb-3 text-slate-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start typing to search for foods
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
