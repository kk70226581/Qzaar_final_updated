import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', variant = 'default' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variants = {
    default: 'text-brand-600',
    light: 'text-white',
    muted: 'text-slate-400',
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
    },
  };

  return (
    <motion.svg
      className={`${sizes[size]} ${variants[variant]}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate="animate"
      variants={spinnerVariants}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
      <path
        d="M12 2C6.477 2 2 6.477 2 12"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

export default Spinner;
