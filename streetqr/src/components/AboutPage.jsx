import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, ChartNoAxesCombined, QrCode, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const capabilities = [
  { icon: <QrCode size={24} />, title: 'QR-first ordering', desc: 'Guests can scan a table code, browse a menu, and place an order without installing an app.' },
  { icon: <ShoppingCart size={24} />, title: 'Restaurant workflows', desc: 'Menus, coupons, orders, inventory, and vendor operations are designed to work together.' },
  { icon: <Activity size={24} />, title: 'Live order visibility', desc: 'Real-time updates help vendors and guests stay aligned as an order moves forward.' },
  { icon: <ShieldCheck size={24} />, title: 'Secure checkout and access', desc: 'The platform includes authenticated access, password recovery, and payment verification workflows.' },
];

const productPrinciples = [
  { icon: <Zap size={24} />, title: 'Useful before flashy', desc: 'Every screen should make a restaurant task easier to complete.' },
  { icon: <ChartNoAxesCombined size={24} />, title: 'Clear operations', desc: 'The goal is to give vendors practical order and business visibility.' },
  { icon: <ShieldCheck size={24} />, title: 'Thoughtful by default', desc: 'Authentication, payments, and account recovery are treated as core product work.' },
];

const founder = {
  name: 'Karan Kannaujiya',
  role: 'Founder · Full-stack MERN developer',
  education: 'B.Tech in Information Technology, IIIT Allahabad',
};

const AboutPage = () => (
  <div className="about-page">
    <Navbar />

    <main>
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <motion.div
              className="about-hero-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="about-eyebrow">QZAAR · RESTAURANT ORDERING PLATFORM</span>
              <h1>A practical QR ordering platform for restaurants.</h1>
              <p>Qzaar brings menu discovery, ordering, payments, live updates, and restaurant operations into one focused web experience.</p>
              <div className="about-hero-points" aria-label="Qzaar highlights">
                <span>QR menus</span><span>Live orders</span><span>Secure payments</span>
              </div>
              <div className="about-hero-actions">
                <Link className="btn-primary" to="/signup">Try Qzaar <ArrowRight size={18} /></Link>
                <Link className="btn-secondary" to="/demo">See the demo</Link>
              </div>
            </motion.div>

            <motion.div
              className="about-hero-art"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              aria-hidden="true"
            >
              <div className="art-circle art-circle-1" />
              <div className="art-circle art-circle-2" />
              <div className="art-circle art-circle-3" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <div className="section-header">
            <h2>What Qzaar is built to handle</h2>
            <p>Purpose-built workflows for guests and restaurant operators.</p>
          </div>
          <div className="values-grid">
            {capabilities.map((item, index) => (
              <motion.article className="value-card" key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }}>
                <div className="value-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Built as a full-stack product</h2>
            <p>A responsive React interface paired with Node.js, Express, MongoDB, Socket.IO, and Razorpay integrations.</p>
          </div>
          <div className="timeline-container">
            {productPrinciples.map((item, index) => (
              <motion.article className="timeline-item" key={item.title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-year">0{index + 1}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet the founder</h2>
            <p>Qzaar is founded and built by Karan Kannaujiya.</p>
          </div>
          <div className="about-founder-card">
            <motion.article className="team-card team-card--founder" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="team-photo-wrap">
                <img className="team-photo" src="/images/karan.jpg" alt="Karan Kannaujiya, founder of Qzaar" />
                <span className="team-founder-badge">Founder</span>
              </div>
              <div className="team-card__content">
                <span className="about-eyebrow">Building Qzaar</span>
                <h3>{founder.name}</h3>
                <span className="team-role">{founder.role}</span>
                <p className="team-bio">{founder.education}</p>
                <p className="team-story">Karan is building Qzaar end to end—combining product design, restaurant workflows, and full-stack engineering into one focused platform.</p>
              </div>
            </motion.article>
          </div>
          <div className="about-builder-story about-founder-story">
            <span className="about-eyebrow">The product approach</span>
            <h3>Designed to connect the moments around an order.</h3>
            <p>From the first QR scan to order updates and payment confirmation, Qzaar keeps the customer journey and restaurant workflow in one product.</p>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Explore the Qzaar experience.</h2>
            <div className="cta-buttons">
              <Link className="btn-primary" to="/signup">Get started <ArrowRight size={18} /></Link>
              <Link className="btn-secondary" to="/demo">Open demo</Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default AboutPage;
