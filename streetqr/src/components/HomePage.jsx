import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  QrCode, 
  MonitorPlay, 
  BarChart3, 
  Settings, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Smartphone, 
  ChefHat,
  UtensilsCrossed
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { hasActiveSession } from '../utils/authSession';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = hasActiveSession();

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-mesh-grid"></div>
        <div className="hero-glow"></div>
        
        <div className="hero-content">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="hero-text"
          >
            <motion.h1 variants={fadeUp} className="hero-title">
              Run your restaurant with <span className="hero-title-gradient">clarity</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-subtitle">
              Qzaar brings your digital menu, kitchen operations, and business analytics into one beautiful, easy-to-use platform. Built for modern restaurants.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-buttons">
              <button onClick={handleCTA} className="btn-primary">
                Get Started <ChevronRight size={18} />
              </button>
              <Link to="/demo" className="btn-secondary">See Demo</Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-mockup-wrapper"
          >
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hero-mockup"
            >
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stats-row">
                  <div className="mockup-stat-card">
                    <div className="mockup-stat-label">Today's Revenue</div>
                    <div className="mockup-stat-val">$2,450.00</div>
                  </div>
                  <div className="mockup-stat-card">
                    <div className="mockup-stat-label">Active Orders</div>
                    <div className="mockup-stat-val">24</div>
                  </div>
                </div>
                <div className="mockup-chart">
                  <div className="mockup-chart-line"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="hero-badge badge-1"
            >
              <TrendingUp size={16} color="#4ade80" />
              +14% this week
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="hero-badge badge-2"
            >
              <CheckCircle size={16} color="#38bdf8" />
              Kitchen synced
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="stats-container"
        >
          <motion.div variants={fadeUp} className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Restaurants Powered</div>
          </motion.div>
          <motion.div variants={fadeUp} className="stat-item">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Orders Served</div>
          </motion.div>
          <motion.div variants={fadeUp} className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Uptime Guaranteed</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything you need</h2>
          <p className="section-desc">A complete suite of tools to manage your restaurant's digital presence and operations.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="features-grid"
        >
          <motion.div variants={fadeUp} className="feature-card">
            <div className="feature-icon-wrapper">
              <QrCode size={28} />
            </div>
            <h3 className="feature-title">Digital QR Menus</h3>
            <p className="feature-desc">Create stunning digital menus that your customers can access instantly by scanning a QR code at their table.</p>
            <Link to="/qrcode" className="feature-link">Learn more <ChevronRight size={16} /></Link>
          </motion.div>

          <motion.div variants={fadeUp} className="feature-card">
            <div className="feature-icon-wrapper">
              <MonitorPlay size={28} />
            </div>
            <h3 className="feature-title">Kitchen Display System</h3>
            <p className="feature-desc">Streamline your back-of-house operations with real-time order tracking and digital kitchen tickets.</p>
            <Link to="/modern/admin/kitchen" className="feature-link">Learn more <ChevronRight size={16} /></Link>
          </motion.div>

          <motion.div variants={fadeUp} className="feature-card">
            <div className="feature-icon-wrapper">
              <BarChart3 size={28} />
            </div>
            <h3 className="feature-title">Powerful Analytics</h3>
            <p className="feature-desc">Get insights into your best-selling items, peak hours, and revenue trends to make data-driven decisions.</p>
            <Link to="/modern/admin/analytics" className="feature-link">Learn more <ChevronRight size={16} /></Link>
          </motion.div>

          <motion.div variants={fadeUp} className="feature-card">
            <div className="feature-icon-wrapper">
              <Settings size={28} />
            </div>
            <h3 className="feature-title">Advanced Settings</h3>
            <p className="feature-desc">Customize tax rates, add staff accounts, configure business hours, and manage multiple locations easily.</p>
            <Link to="/modern/admin/settings" className="feature-link">Learn more <ChevronRight size={16} /></Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Flow */}
      <section className="flow-section">
        <div className="section-header" style={{ color: 'var(--ink-900)' }}>
          <h2 className="section-title">How it works</h2>
          <p className="section-desc" style={{ color: 'var(--ink-500)' }}>Get up and running in minutes, not days.</p>
        </div>

        <div className="flow-container">
          <div className="flow-connector">
            <svg viewBox="0 0 100 2" preserveAspectRatio="none">
              <motion.line 
                x1="0" y1="1" x2="100" y2="1" 
                stroke="#e2e8f0" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flow-steps"
          >
            <motion.div variants={fadeUp} className="flow-step">
              <div className="flow-number">1</div>
              <div className="flow-icon"><ChefHat size={32} /></div>
              <h3 className="flow-title">Setup Profile</h3>
              <p className="flow-desc">Create your restaurant account and configure basic details.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flow-step">
              <div className="flow-number">2</div>
              <div className="flow-icon"><UtensilsCrossed size={32} /></div>
              <h3 className="flow-title">Build Menu</h3>
              <p className="flow-desc">Add categories, items, prices, and mouth-watering photos.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flow-step">
              <div className="flow-number">3</div>
              <div className="flow-icon"><Smartphone size={32} /></div>
              <h3 className="flow-title">Share QR</h3>
              <p className="flow-desc">Print and place your unique QR codes on tables.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flow-step">
              <div className="flow-number">4</div>
              <div className="flow-icon"><MonitorPlay size={32} /></div>
              <h3 className="flow-title">Manage Orders</h3>
              <p className="flow-desc">Receive and process orders seamlessly in your kitchen.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="testimonials-grid"
        >
          <motion.div variants={fadeUp} className="testimonial-card">
            <div className="stars">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
            </div>
            <p className="quote-text">"Qzaar completely transformed how we handle peak hours. The digital menus combined with the kitchen display system reduced our wait times by 30%."</p>
            <div className="quote-author">
              <div className="author-avatar">MS</div>
              <div className="author-info">
                <h4>Maria Sanchez</h4>
                <p>Owner, Taqueria El Sol</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="testimonial-card">
            <div className="stars">
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
            </div>
            <p className="quote-text">"The analytics dashboard alone is worth it. Knowing exactly what items perform best helps us optimize our prep and reduce food waste significantly."</p>
            <div className="quote-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <h4>James Davis</h4>
                <p>Manager, The Daily Grind</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="cta-container"
        >
          <h2 className="cta-title">Ready to modernize your restaurant?</h2>
          <p className="cta-desc">Join hundreds of restaurants using Qzaar to streamline their operations.</p>
          <div className="cta-buttons">
            <button onClick={handleCTA} className="btn-white">Get Started for Free</button>
            <Link to="/demo" className="btn-outline-white">Book a Demo</Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
