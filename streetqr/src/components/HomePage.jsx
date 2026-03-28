import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock3,
  LayoutDashboard,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  TabletSmartphone
} from 'lucide-react';
import Navbar from './Navbar';
import './Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const featureCards = [
  {
    icon: QrCode,
    title: 'Branded QR storefronts',
    text: 'Each vendor gets a mobile-first menu, customizable profile, and QR link that can go live in minutes.'
  },
  {
    icon: Activity,
    title: 'Real-time order handling',
    text: 'Incoming orders move through pending, preparing, and completed states so the operator dashboard feels alive.'
  },
  {
    icon: BarChart3,
    title: 'Actionable sales insights',
    text: 'Top items, revenue snapshots, menu health, and average order value help vendors improve what they sell.'
  }
];

const workflow = [
  {
    step: '01',
    title: 'Build the vendor profile',
    text: 'Add brand color, cuisine type, contact details, store story, and a menu that feels tailored.'
  },
  {
    step: '02',
    title: 'Publish a richer menu',
    text: 'Flag featured dishes, availability, prep time, dietary tags, and imagery that improves order confidence.'
  },
  {
    step: '03',
    title: 'Operate with visibility',
    text: 'Track orders, refresh automatically, and stay on top of service, menu performance, and daily revenue.'
  }
];

const proofPoints = [
  { label: 'Mobile-first ordering', value: 'Scan, browse, and order without downloading an app' },
  { label: 'Menu intelligence', value: 'Featured dishes, availability, prep time, and dietary tags' },
  { label: 'Operations made simple', value: 'Live order states, dashboard metrics, and quick publishing' }
];

const technicalHighlights = [
  'Clean vendor workflow from setup to QR sharing to order tracking',
  'Thoughtful mobile design for customers scanning at the stall',
  'Practical analytics and fulfillment tools for daily operations',
  'Consistent branding across menu, dashboard, and checkout'
];

function HomePage() {
  const isAuthenticated = useMemo(
    () => localStorage.getItem('loggedIn') === 'true' || Boolean(localStorage.getItem('shopId')),
    []
  );

  return (
    <div className="landing-shell">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-section__glow hero-section__glow--left" />
          <div className="hero-section__glow hero-section__glow--right" />
          <div className="landing-container hero-grid">
            <motion.div
              className="hero-copy"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.55 }}
            >
              <span className="hero-pill">
                <Sparkles size={16} />
                Digital ordering made simpler for modern street food vendors
              </span>
              <h1>Street food ordering with a friendlier flow, cleaner visuals, and sharper vendor tools.</h1>
              <p className="hero-copy__lead">
                Qzaar helps vendors create a branded QR menu, manage orders in real time, and give customers
                a smoother mobile ordering experience from the very first scan.
              </p>

              <div className="hero-actions">
                <Link className="hero-btn hero-btn--primary" to={isAuthenticated ? '/menu' : '/login'}>
                  {isAuthenticated ? 'Open Builder Dashboard' : 'Launch Vendor Workspace'}
                  <ArrowRight size={18} />
                </Link>
                <Link className="hero-btn hero-btn--secondary" to="/about">
                  Learn More
                </Link>
              </div>

              <div className="hero-proof-grid">
                {proofPoints.map((point) => (
                  <div className="hero-proof-card" key={point.label}>
                    <strong>{point.label}</strong>
                    <span>{point.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="hero-preview"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="hero-preview__card hero-preview__card--primary">
                <div className="hero-preview__eyebrow">Business overview</div>
                <h2>Vendor dashboard</h2>
                <div className="hero-metrics">
                  <div>
                    <span>Total orders</span>
                    <strong>128</strong>
                  </div>
                  <div>
                    <span>Completed revenue</span>
                    <strong>Rs 24.5k</strong>
                  </div>
                  <div>
                    <span>Featured items</span>
                    <strong>09</strong>
                  </div>
                </div>
                <div className="hero-preview__stack">
                  <div className="hero-preview__stack-card">
                    <LayoutDashboard size={18} />
                    <div>
                      <strong>Ops ready</strong>
                      <span>Pending, preparing, and completed status updates</span>
                    </div>
                  </div>
                  <div className="hero-preview__stack-card">
                    <ScanLine size={18} />
                    <div>
                      <strong>Customer-ready menus</strong>
                      <span>Search, category filters, featured dishes, and dietary badges</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-preview__card hero-preview__card--secondary">
                <div className="hero-preview__mini-stat">
                  <Clock3 size={16} />
                  <span>Average prep promise</span>
                  <strong>14 min</strong>
                </div>
                <div className="hero-preview__mini-stat">
                  <ShieldCheck size={16} />
                  <span>Launch checklist</span>
                  <strong>Draft autosave enabled</strong>
                </div>
                <div className="hero-preview__mini-stat">
                  <TabletSmartphone size={16} />
                  <span>Guest experience</span>
                  <strong>Built for small screens first</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <div className="section-heading">
              <span>Why businesses choose Qzaar</span>
              <h2>Everything needed to run a cleaner and more reliable QR ordering experience.</h2>
            </div>
            <div className="feature-grid">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    className="feature-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={fadeInUp}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <div className="feature-card__icon">
                      <Icon size={22} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-section landing-section--accent">
          <div className="landing-container workflow-layout">
            <div className="section-heading section-heading--left">
              <span>Core workflow</span>
              <h2>From setup to service in three clear stages.</h2>
            </div>
            <div className="workflow-list">
              {workflow.map((item, index) => (
                <motion.div
                  key={item.step}
                  className="workflow-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                >
                  <span className="workflow-card__step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container highlights-layout">
            <div className="section-heading section-heading--left">
              <span>Business value</span>
              <h2>Made for smoother service, stronger branding, and easier daily operations.</h2>
            </div>
            <div className="highlight-panel">
              <div className="highlight-panel__header">
                <Store size={20} />
                <strong>Why teams rely on it</strong>
              </div>
              <ul className="highlight-list">
                {technicalHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="landing-section landing-section--cta">
          <div className="landing-container cta-panel">
            <div>
              <span className="cta-panel__eyebrow">Ready to get started?</span>
              <h2>Set up your business profile, publish your menu, and start taking orders with confidence.</h2>
              <p>
                Qzaar helps food businesses present their menu clearly, speed up ordering, and stay organized
                during busy service hours.
              </p>
            </div>
            <div className="cta-panel__actions">
              <Link className="hero-btn hero-btn--primary" to={isAuthenticated ? '/menu' : '/login'}>
                {isAuthenticated ? 'Continue to Dashboard' : 'Sign In'}
              </Link>
              <a className="hero-btn hero-btn--secondary" href="mailto:support@qzaar.com">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
