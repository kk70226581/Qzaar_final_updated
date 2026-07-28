import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Activity, ArrowRight, BarChart3, CheckCircle2, ChefHat, ChevronDown, CreditCard, QrCode, ScanLine, Settings, Smartphone, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './HowItWorksPage.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hiw-faq-item">
      <button className="hiw-faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown className={`hiw-faq-icon ${isOpen ? 'open' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="hiw-faq-answer-wrapper"
          >
            <div className="hiw-faq-answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HowItWorksPage() {
  const prefersReducedMotion = useReducedMotion();

  const nodes = [
    { icon: <ScanLine size={32} />, color: "blue", title: "Guest Scans QR", desc: "No app needed. Instant access." },
    { icon: <Smartphone size={32} />, color: "blue", title: "Digital Menu", desc: "Browse beautiful menus easily." },
    { icon: <UtensilsCrossed size={32} />, color: "orange", title: "Place Order", desc: "Order goes straight to POS." },
    { icon: <ChefHat size={32} />, color: "orange", title: "Kitchen Preps", desc: "Chef gets real-time alerts." },
    { icon: <CreditCard size={32} />, color: "green", title: "Fast Payment", desc: "Split bills and pay in taps." },
    { icon: <BarChart3 size={32} />, color: "purple", title: "Analytics", desc: "Owner sees live insights." },
  ];

  return (
    <div className="hiw-page">
      <Navbar />

      <main className="hiw-main">
        {/* HERO */}
        <section className="hiw-hero">
          <div className="hiw-hero-bg">
            <motion.div 
              className="hiw-shape hiw-shape-1"
              animate={prefersReducedMotion ? {} : { y: [0, 20, 0], x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            <motion.div 
              className="hiw-shape hiw-shape-2"
              animate={prefersReducedMotion ? {} : { y: [0, -20, 0], x: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <motion.h1 
            className="hiw-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            From first scan to final payment — in one flow.
          </motion.h1>
          <motion.p 
            className="hiw-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Qzaar simplifies the dining experience. A seamless journey for your guests, from browsing the menu to paying the bill, completely digitized.
          </motion.p>
        </section>

        {/* DIAGRAM SECTION */}
        <section className="hiw-diagram-section">
          <h2 className="hiw-section-title">The Complete Guest Journey</h2>
          
          <div className="hiw-diagram-container">
            {/* Desktop SVG Line */}
            <div className="hiw-diagram-svg-container">
              <svg width="100%" height="150" viewBox="0 0 1000 150" preserveAspectRatio="none">
                <motion.path
                  d="M 50,75 L 950,75"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                />
                <motion.path
                  d="M 50,75 L 950,75"
                  fill="transparent"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="hiw-nodes-grid">
              {nodes.map((node, i) => (
                <motion.div 
                  key={i} 
                  className="hiw-node"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div className={`hiw-node-icon ${node.color}`}>
                    {node.icon}
                  </div>
                  <h3 className="hiw-node-title">{node.title}</h3>
                  <p className="hiw-node-desc">{node.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STEPS SECTION */}
        <section className="hiw-steps-section">
          {/* Step 1 */}
          <div className="hiw-step-row">
            <motion.div 
              className="hiw-step-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="hiw-step-number orange">Step 1</span>
              <h2 className="hiw-step-title">Set up your restaurant profile</h2>
              <p className="hiw-step-desc">Enter your restaurant details, business hours, and tax settings in our intuitive dashboard. Qzaar handles the complex configuration so you can focus on food.</p>
            </motion.div>
            <motion.div 
              className="hiw-step-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="hiw-mockup-card">
                <div className="hiw-mockup-header">
                  <div className="hiw-mockup-icon orange"><Settings /></div>
                  <div className="hiw-mockup-title">Restaurant Settings</div>
                </div>
                <div className="hiw-mockup-skeleton-line long" />
                <div className="hiw-mockup-skeleton-line short" />
                <div className="hiw-mockup-skeleton-line medium" />
                <div className="hiw-mockup-skeleton-block" />
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="hiw-step-row reverse">
            <motion.div 
              className="hiw-step-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="hiw-step-number blue">Step 2</span>
              <h2 className="hiw-step-title">Build your digital menu</h2>
              <p className="hiw-step-desc">Upload mouth-watering photos, add modifiers, and categorize items. Instantly update prices or mark items out of stock across all active tables.</p>
            </motion.div>
            <motion.div 
              className="hiw-step-visual"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
               <div className="hiw-mockup-card">
                <div className="hiw-mockup-header">
                  <div className="hiw-mockup-icon blue"><UtensilsCrossed /></div>
                  <div className="hiw-mockup-title">Menu Builder</div>
                </div>
                <div className="hiw-mockup-skeleton-block" />
                <div className="hiw-mockup-skeleton-block" />
                <div className="hiw-mockup-skeleton-block" />
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="hiw-step-row">
            <motion.div 
              className="hiw-step-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="hiw-step-number purple">Step 3</span>
              <h2 className="hiw-step-title">Place QR codes on tables</h2>
              <p className="hiw-step-desc">Generate beautiful, branded QR codes for every table. Guests simply scan with their smartphone camera to instantly access your menu without downloading any apps.</p>
            </motion.div>
            <motion.div 
              className="hiw-step-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
               <div className="hiw-mockup-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <QrCode size={120} strokeWidth={1} color="#6d28d9" />
                 <div style={{ marginTop: '1rem', fontWeight: 600 }}>Table 12</div>
              </div>
            </motion.div>
          </div>

          {/* Step 4 */}
          <div className="hiw-step-row reverse">
            <motion.div 
              className="hiw-step-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="hiw-step-number green">Step 4</span>
              <h2 className="hiw-step-title">Watch orders flow in real-time</h2>
              <p className="hiw-step-desc">Orders appear instantly on your Kitchen Display System or POS. Guests pay easily via Apple Pay, Google Pay, or Card, turning tables faster and increasing tips.</p>
            </motion.div>
            <motion.div 
              className="hiw-step-visual"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
               <div className="hiw-mockup-card">
                <div className="hiw-mockup-header">
                  <div className="hiw-mockup-icon green"><Activity /></div>
                  <div className="hiw-mockup-title">Live Orders</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <CheckCircle2 color="#10b981" /> <span>Table 4 - Burger x2</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <CheckCircle2 color="#10b981" /> <span>Table 9 - Pasta x1</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="hiw-faq-section">
          <h2 className="hiw-section-title">Frequently Asked Questions</h2>
          <div className="hiw-faq-container">
            <FAQItem 
              question="Do my guests need to download an app?" 
              answer="No! Qzaar runs entirely in the browser. Guests simply scan the QR code using their default camera app and the menu instantly opens."
            />
            <FAQItem 
              question="Can I change menu prices in real-time?" 
              answer="Absolutely. Any changes made in your Qzaar dashboard (prices, out-of-stock items, new specials) are instantly reflected for all new scans."
            />
            <FAQItem 
              question="Does Qzaar integrate with my existing POS?" 
              answer="We offer standard integrations with major POS providers and a standalone Kitchen Display System (KDS) if you don't use a compatible POS."
            />
            <FAQItem 
              question="How are payments handled?" 
              answer="We process payments securely via Stripe, supporting Apple Pay, Google Pay, and all major credit cards. Funds are deposited directly to your bank account."
            />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="hiw-cta-section">
          <h2 className="hiw-cta-title">Ready to get started?</h2>
          <p className="hiw-cta-desc">Join hundreds of modern restaurants increasing their revenue and delighting guests with Qzaar.</p>
          <div className="hiw-cta-buttons">
            <Link to="/login" className="hiw-btn hiw-btn-primary">
              Create free account <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
            <Link to="/login" className="hiw-btn hiw-btn-secondary">
              Book a demo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
