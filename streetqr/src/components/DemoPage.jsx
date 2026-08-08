import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ChefHat, CheckCircle2, Play, ScanLine, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './DemoPage.css';

const demoStops = [
  {
    eyebrow: 'Guest experience',
    title: 'Scan, browse, and order',
    description: 'Explore the live mobile menu, discover dishes, add items, and see the customer journey first-hand.',
    path: '/modern/menu',
    action: 'Open guest menu',
    icon: ShoppingBag,
    accent: 'violet',
  },
  {
    eyebrow: 'Kitchen operations',
    title: 'Keep every ticket moving',
    description: 'Preview the kitchen display that helps teams see new, preparing, and ready orders at a glance.',
    path: '/modern/admin/kitchen',
    action: 'View kitchen display',
    icon: ChefHat,
    accent: 'orange',
  },
  {
    eyebrow: 'Owner insights',
    title: 'Understand every service',
    description: 'See the analytics workspace for revenue, order trends, popular dishes, and daily performance.',
    path: '/modern/admin/analytics',
    action: 'Explore analytics',
    icon: BarChart3,
    accent: 'blue',
  },
];

function DemoPage() {
  return (
    <div className="demo-page">
      <Navbar />
      <main>
        <section className="demo-hero">
          <div className="demo-shell demo-hero__grid">
            <motion.div
              className="demo-hero__copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="demo-eyebrow"><Sparkles size={15} /> Product tour</span>
              <h1>See the whole restaurant flow in one place.</h1>
              <p>Take a self-guided tour from the guest&apos;s first scan to the kitchen queue and owner dashboard. No account is needed for the preview.</p>
              <div className="demo-hero__actions">
                <Link className="demo-button demo-button--primary" to="/modern/menu">
                  <Play size={17} fill="currentColor" /> Start live demo
                </Link>
                <Link className="demo-button demo-button--secondary" to="/contact">
                  Talk to Karan <ArrowRight size={17} />
                </Link>
              </div>
              <div className="demo-assurances" aria-label="Demo details">
                <span><CheckCircle2 size={16} /> No signup</span>
                <span><CheckCircle2 size={16} /> Mobile friendly</span>
                <span><CheckCircle2 size={16} /> Full workflow</span>
              </div>
            </motion.div>

            <motion.div
              className="demo-hero__visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <img src="/images/brand/qzaar-restaurant-hero.png" alt="Restaurant table with a Qzaar QR menu" />
              <div className="demo-hero__overlay" />
              <div className="demo-scan-card">
                <span><ScanLine size={21} /></span>
                <div><strong>One scan, one smooth flow</strong><small>Menu to payment to kitchen</small></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="demo-tour">
          <div className="demo-shell">
            <div className="demo-section-heading">
              <span>Choose your view</span>
              <h2>Explore Qzaar at your own pace.</h2>
              <p>Each preview is connected, so you can move through the product exactly as a restaurant or guest would.</p>
            </div>
            <div className="demo-grid">
              {demoStops.map(({ icon: Icon, ...stop }, index) => (
                <motion.article
                  className={`demo-card demo-card--${stop.accent}`}
                  key={stop.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                >
                  <div className="demo-card__top">
                    <span className="demo-card__icon"><Icon size={22} /></span>
                    <span className="demo-card__number">0{index + 1}</span>
                  </div>
                  <span className="demo-card__eyebrow">{stop.eyebrow}</span>
                  <h3>{stop.title}</h3>
                  <p>{stop.description}</p>
                  <Link to={stop.path}>{stop.action} <ArrowRight size={17} /></Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="demo-cta">
          <div className="demo-shell demo-cta__panel">
            <div><span>Ready to make it yours?</span><h2>Build your restaurant workspace in minutes.</h2></div>
            <div className="demo-cta__actions">
              <Link className="demo-button demo-button--light" to="/signup">Create free account <ArrowRight size={17} /></Link>
              <Link className="demo-button demo-button--quiet" to="/products">Compare features</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default DemoPage;
