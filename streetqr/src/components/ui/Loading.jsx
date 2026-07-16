import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ text = 'Loading...', fullscreen = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-brand-600/20 dark:border-brand-400/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 dark:border-t-brand-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-12 h-12 mb-4 relative"
        variants={itemVariants}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-brand-600/20 dark:border-brand-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 dark:border-t-brand-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      <motion.p
        className="text-slate-600 dark:text-slate-400 font-medium"
        variants={itemVariants}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export const Skeleton = ({ className = '', count = 1, height = 'h-4', width = 'w-full' }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${height} ${width} rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800`}
          variants={skeletonVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};

const skeletonVariants = {
  animate: {
    x: [-1200, 1200],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export default Loading;
