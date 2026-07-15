import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  BarChart3,
  BellRing,
  CheckCircle2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  QrCode,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Store,
  UtensilsCrossed
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
};

const heroSignals = [
  { icon: QrCode, label: 'Scan' },
  { icon: BellRing, label: 'Order' },
  { icon: CheckCircle2, label: 'Track' }
];

const platformStats = [
  { icon: QrCode, label: 'Menus', value: '4' },
  { icon: ReceiptText, label: 'Orders', value: '18' },
  { icon: Activity, label: 'Prep', value: '14m' },
  { icon: ScanLine, label: 'Setup', value: '8m' }
];

const slides = [
  { image: '/images/brand/qzaar-restaurant-hero.png', eyebrow: 'Built for hospitality', title: 'A thoughtful digital table experience, from scan to payment.' },
  { image: '/images/landing/slide-1.png', eyebrow: 'Food discovery', title: 'A menu that makes every dish look irresistible.' },
  { image: '/images/landing/slide-5.png', eyebrow: 'QR ordering', title: 'Scan, browse, order without downloading an app.' },
  { image: '/images/landing/slide-7.png', eyebrow: 'Live experience', title: 'Track every order from kitchen to table.' },
  { image: '/images/landing/slide-3.png', eyebrow: 'Faster checkout', title: 'Simple payments and a smoother guest journey.' },
  { image: '/images/landing/slide-8.png', eyebrow: 'Restaurant control', title: 'One polished system for the entire service.' }
];

const modules = [
  {
    icon: QrCode,
    title: 'QR storefront',
    text: 'Fast branded menu.'
  },
  {
    icon: BellRing,
    title: 'Live order desk',
    text: 'Status in one view.'
  },
  {
    icon: CreditCard,
    title: 'Payment workflow',
    text: 'Simple checkout.'
  },
  {
    icon: BarChart3,
    title: 'Daily visibility',
    text: 'Quick insights.'
  }
];

const workflow = [
  { icon: Store, title: 'Brand', text: 'Logo, hours, contact.' },
  { icon: UtensilsCrossed, title: 'Menu', text: 'Items, photos, prices.' },
  { icon: ScanLine, title: 'QR', text: 'One scan link.' },
  { icon: CheckCircle2, title: 'Live', text: 'Accept and track.' }
];

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const isAuthenticated = useMemo(
    () => localStorage.getItem('loggedIn') === 'true' || Boolean(localStorage.getItem('shopId')),
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <div className="landing-shell">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="home-hero__shade" />
          <div className="landing-container home-hero__grid">
            <motion.div
              className="home-hero__copy"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.55 }}
            >
              <span className="home-eyebrow">
                <ShieldCheck size={16} />
                Built for serious food operations
              </span>
              <h1>QR menus. Live orders. Smooth service.</h1>
              <p>Build your shop menu, publish a QR, and manage orders from one clean dashboard.</p>

              <div className="home-signals">
                {heroSignals.map((signal) => {
                  const Icon = signal.icon;
                  return (
                  <span className="home-signals__item" key={signal.label}>
                    <Icon size={16} />
                    {signal.label}
                  </span>
                  );
                })}
              </div>

              <div className="home-hero__actions">
                <Link className="home-button home-button--primary" to={isAuthenticated ? '/dashboard' : '/login'}>
                  {isAuthenticated ? 'Open Dashboard' : 'Start Workspace'}
                  <ArrowRight size={18} />
                </Link>
                <Link className="home-button home-button--secondary" to="/about">
                  See Platform
                </Link>
                <Link className="home-button home-button--secondary" to="/modern/menu">
                  Preview Menu
                  <UtensilsCrossed size={18} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="home-showcase"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="home-showcase__frame">
                {slides.map((slide, index) => (
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    className={`home-showcase__image ${index === activeSlide ? 'is-active' : ''}`}
                    initial={false}
                    animate={{ opacity: index === activeSlide ? 1 : 0, scale: index === activeSlide ? 1 : 1.04 }}
                    transition={{ duration: 0.7 }}
                  />
                ))}
                <div className="home-showcase__overlay" />
                <div className="home-showcase__caption">
                  <span>{slides[activeSlide].eyebrow}</span>
                  <strong>{slides[activeSlide].title}</strong>
                </div>
                <div className="home-showcase__controls">
                  <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button>
                  <div>
                    {slides.map((slide, index) => (
                      <button
                        type="button"
                        key={slide.image}
                        className={index === activeSlide ? 'is-active' : ''}
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button type="button" onClick={() => moveSlide(1)} aria-label="Next image"><ChevronRight size={20} /></button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="signal-strip">
          <motion.div
            className="landing-container signal-strip__grid"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            {platformStats.map((item) => {
              const Icon = item.icon;
              return (
              <motion.div className="signal-tile" key={item.label} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <Icon size={18} />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="platform-section">
          <div className="landing-container platform-section__header">
            <span className="section-kicker">Operations stack</span>
            <h2>Everything customers and owners need.</h2>
          </div>

          <motion.div
            className="landing-container module-grid"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.article className="module-tile" key={module.title} variants={fadeInUp} transition={{ duration: 0.45 }}>
                  <Icon size={22} />
                  <strong>{module.title}</strong>
                  <span>{module.text}</span>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="workflow-section">
          <div className="landing-container workflow-board">
            <div className="workflow-heading">
              <span className="section-kicker">Launch sequence</span>
              <h2>From menu draft to live service.</h2>
            </div>

            <motion.div
              className="workflow-rail"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article className="workflow-step" key={item.title} variants={fadeInUp} transition={{ duration: 0.45 }}>
                    <div className="workflow-step__index">{String(index + 1).padStart(2, '0')}</div>
                    <Icon size={22} />
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section id="contact" className="final-cta">
          <div className="landing-container final-cta__inner">
            <div>
              <span className="section-kicker">Ready to publish</span>
              <h2>Launch a cleaner ordering flow today.</h2>
            </div>
            <Link className="home-button home-button--primary" to={isAuthenticated ? '/dashboard' : '/login'}>
              {isAuthenticated ? 'Resume' : 'Get Started'}
              <ReceiptText size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
