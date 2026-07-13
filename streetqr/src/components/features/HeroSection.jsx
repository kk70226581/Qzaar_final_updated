import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/features/HeroSection.css';

/**
 * HeroSection - Premium hero banner component
 * 
 * Features:
 * - Full-width background image/gradient
 * - Large headline
 * - Subtitle support
 * - CTA buttons
 * - Overlay with blur
 * - Responsive sizing
 * - Dark mode support
 * 
 * @example
 * <HeroSection
 *   backgroundImage="/restaurant.jpg"
 *   title="Delicious Food Delivered Fast"
 *   subtitle="Order from the best restaurants"
 *   cta={<ModernButton>Order Now</ModernButton>}
 * />
 */

const HeroSection = ({
  backgroundImage,
  backgroundGradient,
  title,
  subtitle,
  cta,
  height = 'full',
  overlay = true,
  overlayOpacity = 0.4,
  textAlign = 'center',
  children,
  className = '',
}) => {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : backgroundGradient
    ? { background: backgroundGradient }
    : { background: 'var(--primary-600)' };

  return (
    <motion.section
      className={`hero-section hero-section--${height} ${className}`}
      style={backgroundStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* OVERLAY */}
      {overlay && (
        <div
          className="hero-section__overlay"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* CONTENT */}
      <div className={`hero-section__content hero-section__content--${textAlign}`}>
        {/* TITLE */}
        {title && (
          <motion.h1
            className="hero-section__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h1>
        )}

        {/* SUBTITLE */}
        {subtitle && (
          <motion.p
            className="hero-section__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA BUTTON */}
        {cta && (
          <motion.div
            className="hero-section__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {cta}
          </motion.div>
        )}

        {/* CHILDREN */}
        {children && (
          <motion.div
            className="hero-section__children"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
