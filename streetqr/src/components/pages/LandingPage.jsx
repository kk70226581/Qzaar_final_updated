import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Star,
  Users,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  UtensilsCrossed,
} from 'lucide-react';
import HeroSection from '../features/HeroSection';
import FeatureCard from '../features/FeatureCard';
import { ModernButton } from '../ui';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import '../../styles/pages/LandingPage.css';

/**
 * LandingPage - Main landing page showcasing platform benefits
 * 
 * Features:
 * - Hero banner with CTA
 * - Features section highlighting key benefits
 * - How it works step-by-step guide
 * - Testimonials section
 * - Stats showcase
 * - Final CTA
 * - Fully responsive design
 * - Smooth animations
 * - Dark mode support
 */

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap size={36} />,
      title: 'Lightning Fast',
      description: 'Get your food delivered within 30 minutes',
      color: 'primary',
    },
    {
      icon: <Clock size={36} />,
      title: 'Real-time Tracking',
      description: 'Track your order status live from kitchen to table',
      color: 'info',
    },
    {
      icon: <Star size={36} />,
      title: 'Premium Quality',
      description: 'Carefully selected restaurants with verified ratings',
      color: 'warning',
    },
    {
      icon: <Users size={36} />,
      title: 'Wide Selection',
      description: 'Choose from thousands of delicious items',
      color: 'success',
    },
  ];

  const stats = [
    { number: '500+', label: 'Restaurants' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '100K+', label: 'Orders Delivered' },
    { number: '4.8★', label: 'Average Rating' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
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
      <main className="landing-page">
        {/* HERO SECTION */}
        <HeroSection
          backgroundImage="/images/landing/slide-2.png"
          title="Your Favorite Food, Delivered Fast"
          subtitle="Order from the best restaurants in your city. Fresh, delicious, and delivered to your table."
          height="full"
          cta={
            <ModernButton
              variant="primary"
              size="xl"
              onClick={() => navigate('/modern/menu')}
              className="landing-hero__cta"
            >
              Order Now <ChevronRight size={20} />
            </ModernButton>
          }
        />

        {/* FEATURES SECTION */}
        <section className="landing-page__section landing-page__features">
          <div className="landing-page__container">
            <motion.div
              className="landing-page__section-header"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <h2 className="landing-page__section-title">
                Why Choose Us?
              </h2>
              <p className="landing-page__section-subtitle">
                Experience the future of food delivery
              </p>
            </motion.div>

            <motion.div
              className="landing-page__features-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="landing-page__section landing-page__how-it-works">
          <div className="landing-page__container">
            <motion.div
              className="landing-page__section-header"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <h2 className="landing-page__section-title">
                How It Works
              </h2>
              <p className="landing-page__section-subtitle">
                Simple steps to get your food
              </p>
            </motion.div>

            <motion.div
              className="landing-page__steps"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {[
                {
                  step: '1',
                  title: 'Browse',
                  description: 'Explore restaurants and delicious food items',
                  icon: '🏪',
                },
                {
                  step: '2',
                  title: 'Customize',
                  description: 'Add items to cart and customize as you like',
                  icon: '🛒',
                },
                {
                  step: '3',
                  title: 'Track',
                  description: 'Monitor preparation and delivery in real-time',
                  icon: '📍',
                },
                {
                  step: '4',
                  title: 'Enjoy',
                  description: 'Eat delicious food and rate your experience',
                  icon: '😋',
                },
              ].map((item, index) => {
                const StepIcon = [Search, SlidersHorizontal, MapPin, UtensilsCrossed][index];
                return <motion.div
                  key={index}
                  className="landing-page__step"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  <div className="landing-page__step-number">
                    {item.step}
                  </div>
                  <div className="landing-page__step-emoji">
                    <StepIcon size={28} />
                  </div>
                  <h3 className="landing-page__step-title">
                    {item.title}
                  </h3>
                  <p className="landing-page__step-description">
                    {item.description}
                  </p>
                </motion.div>;
              })}
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="landing-page__section landing-page__stats">
          <div className="landing-page__container">
            <motion.div
              className="landing-page__stats-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="landing-page__stat"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="landing-page__stat-number">
                    {stat.number}
                  </div>
                  <div className="landing-page__stat-label">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="landing-page__section landing-page__final-cta">
          <div className="landing-page__container">
            <motion.div
              className="landing-page__final-cta-content"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.h2
                className="landing-page__final-cta-title"
                variants={itemVariants}
              >
                Ready to Satisfy Your Cravings?
              </motion.h2>

              <motion.p
                className="landing-page__final-cta-subtitle"
                variants={itemVariants}
              >
                Start ordering from your favorite restaurants today
              </motion.p>

              <motion.div
                className="landing-page__final-cta-buttons"
                variants={itemVariants}
              >
                <ModernButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/modern/menu')}
                >
                  Browse Restaurants
                </ModernButton>

                <ModernButton
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    document.querySelector('.landing-page__features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </ModernButton>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
};

export default LandingPage;
