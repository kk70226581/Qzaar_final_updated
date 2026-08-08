import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChefHat,
  CreditCard,
  Gauge,
  HeartHandshake,
  Layers3,
  Lightbulb,
  PackageCheck,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Target,
  UtensilsCrossed,
  Workflow,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const productSurfaces = [
  { icon: QrCode, title: 'Table QR', copy: 'A direct entry point into the correct restaurant and table experience.', tone: 'blue' },
  { icon: UtensilsCrossed, title: 'Digital menu', copy: 'Live categories, items, pricing, availability, and guest-friendly discovery.', tone: 'violet' },
  { icon: ChefHat, title: 'Orders & kitchen', copy: 'A shared view of new, preparing, ready, and completed restaurant work.', tone: 'amber' },
  { icon: CreditCard, title: 'Checkout', copy: 'Payment verification stays connected to the order that created it.', tone: 'green' },
  { icon: BarChart3, title: 'Analytics', copy: 'Service activity becomes useful operational context instead of scattered data.', tone: 'indigo' },
  { icon: PackageCheck, title: 'Inventory', copy: 'Stock levels, reorder points, value, and expiry risks stay visible.', tone: 'coral' },
];

const operatingPrinciples = [
  { icon: Target, number: '01', title: 'Clarity before complexity', copy: 'The best restaurant tool makes the next action obvious. Interfaces should reduce decisions, not introduce more of them.' },
  { icon: Workflow, number: '02', title: 'One continuous order story', copy: 'The table, cart, kitchen state, payment, and reporting should remain connected from beginning to end.' },
  { icon: HeartHandshake, number: '03', title: 'Hospitality stays human', copy: 'Technology should remove repetitive coordination so restaurant teams have more attention for their guests.' },
  { icon: ShieldCheck, number: '04', title: 'Trust is product work', copy: 'Authentication, account recovery, access, and payment verification belong in the foundation—not in a later patch.' },
];

const buildJourney = [
  { label: 'Observe', title: 'Start with the moments that slow service down.', copy: 'Printed menus become outdated, orders are repeated across people, and important service context gets separated.' },
  { label: 'Connect', title: 'Design one flow around the order.', copy: 'Qzaar treats scanning, browsing, ordering, preparation, payment, and reporting as one connected journey.' },
  { label: 'Build', title: 'Own the experience from interface to infrastructure.', copy: 'The product combines a responsive guest experience with restaurant operations, real-time updates, and secure backend workflows.' },
  { label: 'Improve', title: 'Turn every service into a clearer next service.', copy: 'Analytics and inventory signals help the restaurant see what happened and what needs attention next.' },
];

const BeforeAfterRow = ({ before, after }) => (
  <div className="about-compare__row">
    <span className="about-compare__minus">-</span>
    <p>{before}</p>
    <ArrowRight size={15} />
    <span className="about-compare__check"><Check size={13} /></span>
    <p>{after}</p>
  </div>
);

const AboutPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const reveal = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-70px' } };

  return (
    <div className="about-page">
      <Navbar />

      <main className="about-main">
        <section className="about-hero">
          <div className="about-hero__grid" />
          <div className="about-hero__glow about-hero__glow--left" />
          <div className="about-hero__glow about-hero__glow--right" />
          <div className="about-shell about-hero__layout">
            <motion.div
              className="about-hero__copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="about-kicker"><Sparkles size={14} /> About Qzaar</span>
              <h1>Restaurant technology should make service feel <em>simpler.</em></h1>
              <p>Qzaar is a restaurant operating platform built around one idea: every moment around an order should stay clear, connected, and easy to act on.</p>
              <div className="about-hero__actions">
                <Link className="about-button about-button--primary" to="/demo">Experience Qzaar <ArrowRight size={17} /></Link>
                <Link className="about-button about-button--secondary" to="/how-it-works">See how it works</Link>
              </div>
              <div className="about-hero__proof" aria-label="Qzaar focus areas">
                <span><Check size={13} /> Guest-first</span>
                <span><Check size={13} /> Operations-ready</span>
                <span><Check size={13} /> Built end to end</span>
              </div>
            </motion.div>

            <motion.div
              className="about-system"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              aria-label="Connected Qzaar product system"
            >
              <div className="about-system__orbit about-system__orbit--outer" />
              <div className="about-system__orbit about-system__orbit--inner" />
              <div className="about-system__core">
                <span><ScanLine size={30} /></span>
                <strong>Qzaar</strong>
                <small>Restaurant OS</small>
              </div>
              <article className="about-system__node about-system__node--menu"><span><UtensilsCrossed size={17} /></span><div><small>Guest</small><strong>Live menu</strong></div></article>
              <article className="about-system__node about-system__node--orders"><span><ChefHat size={17} /></span><div><small>Kitchen</small><strong>Order queue</strong></div><i className="is-live" /></article>
              <article className="about-system__node about-system__node--payment"><span><CreditCard size={17} /></span><div><small>Checkout</small><strong>Verified</strong></div><Check size={13} /></article>
              <article className="about-system__node about-system__node--analytics"><span><BarChart3 size={17} /></span><div><small>Owner</small><strong>Insights</strong></div></article>
              <article className="about-system__node about-system__node--stock"><span><PackageCheck size={17} /></span><div><small>Inventory</small><strong>Stock control</strong></div></article>
              <div className="about-system__signal about-system__signal--one" />
              <div className="about-system__signal about-system__signal--two" />
              <div className="about-system__signal about-system__signal--three" />
            </motion.div>
          </div>
        </section>

        <section className="about-purpose-strip">
          <div className="about-shell about-purpose-strip__inner">
            <span>One guest journey</span><i />
            <span>One live order state</span><i />
            <span>One restaurant workspace</span><i />
            <span>One clearer service</span>
          </div>
        </section>

        <section className="about-mission">
          <div className="about-shell about-mission__layout">
            <motion.div className="about-section-heading about-section-heading--left" {...reveal}>
              <span className="about-kicker"><Lightbulb size={14} /> Why Qzaar exists</span>
              <h2>The order is simple. The coordination around it often is not.</h2>
            </motion.div>
            <motion.div className="about-mission__statement" {...reveal}>
              <p>Restaurants already know how to create great food and hospitality. The friction appears between the moments: finding a menu, confirming a table, relaying an order, checking kitchen progress, collecting payment, and understanding what happened afterward.</p>
              <p>Qzaar brings those moments into one product so each person—guest, kitchen team, operator, or owner—sees the context they need without rebuilding the same information.</p>
              <div className="about-mission__note"><Zap size={18} /><span><small>The mission</small><strong>Make restaurant service easier to enter, easier to run, and easier to improve.</strong></span></div>
            </motion.div>
          </div>
        </section>

        <section className="about-change">
          <div className="about-shell">
            <motion.div className="about-section-heading" {...reveal}>
              <span className="about-kicker"><Workflow size={14} /> The change Qzaar is designed for</span>
              <h2>Replace disconnected handoffs with one shared flow.</h2>
              <p>The product does not remove hospitality. It removes the repetitive coordination that competes with it.</p>
            </motion.div>
            <motion.div className="about-compare" {...reveal}>
              <div className="about-compare__head">
                <div><span className="about-compare__head-icon is-before"><Layers3 size={18} /></span><span><small>Before</small><strong>Scattered service moments</strong></span></div>
                <div><span className="about-compare__head-icon is-after"><ScanLine size={18} /></span><span><small>With Qzaar</small><strong>A connected order journey</strong></span></div>
              </div>
              <div className="about-compare__body">
                <BeforeAfterRow before="Wait for a printed menu or staff handoff" after="Scan the table QR and open the current menu" />
                <BeforeAfterRow before="Repeat table and item details across people" after="Carry table, cart, and notes into the order" />
                <BeforeAfterRow before="Ask for kitchen progress manually" after="Move through visible order and kitchen states" />
                <BeforeAfterRow before="Separate payment from the order context" after="Keep checkout verification attached to the order" />
                <BeforeAfterRow before="Rebuild performance and stock context later" after="Use analytics and inventory signals in one workspace" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="about-product">
          <div className="about-shell">
            <motion.div className="about-section-heading" {...reveal}>
              <span className="about-kicker"><Store size={14} /> One product, every important surface</span>
              <h2>Qzaar is more than a digital menu.</h2>
              <p>Each workspace is designed as part of the same restaurant system, with the order at the center.</p>
            </motion.div>
            <div className="about-product__grid">
              {productSurfaces.map(({ icon: Icon, title, copy, tone }, index) => (
                <motion.article className={`about-product__card about-product__card--${tone}`} key={title} {...reveal} transition={{ delay: index * 0.05 }}>
                  <div className="about-product__card-top"><span><Icon size={20} /></span><small>{String(index + 1).padStart(2, '0')}</small></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link to="/how-it-works">Explore the flow <ArrowRight size={14} /></Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-principles">
          <div className="about-shell">
            <div className="about-principles__top">
              <motion.div className="about-section-heading about-section-heading--left" {...reveal}>
                <span className="about-kicker"><Target size={14} /> Product principles</span>
                <h2>How Qzaar is designed and built.</h2>
              </motion.div>
              <p>These principles guide what belongs in the product, how each interface should feel, and where technical effort matters most.</p>
            </div>
            <div className="about-principles__grid">
              {operatingPrinciples.map(({ icon: Icon, number, title, copy }, index) => (
                <motion.article key={title} {...reveal} transition={{ delay: index * 0.06 }}>
                  <div><span><Icon size={19} /></span><small>{number}</small></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-journey">
          <div className="about-shell about-journey__layout">
            <motion.div className="about-journey__intro" {...reveal}>
              <span className="about-kicker"><Gauge size={14} /> The building journey</span>
              <h2>From one service problem to a connected operating platform.</h2>
              <p>Qzaar is being built from the workflow outward—not from a collection of unrelated features.</p>
              <div className="about-journey__stack"><span>React</span><span>Node.js</span><span>Express</span><span>MongoDB</span><span>Socket.IO</span><span>Razorpay</span></div>
            </motion.div>
            <div className="about-journey__steps">
              {buildJourney.map((step, index) => (
                <motion.article key={step.label} {...reveal} transition={{ delay: index * 0.05 }}>
                  <div className="about-journey__rail"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
                  <div><small>{step.label}</small><h3>{step.title}</h3><p>{step.copy}</p></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-founder">
          <div className="about-shell">
            <motion.div className="about-section-heading" {...reveal}>
              <span className="about-kicker"><Sparkles size={14} /> Founder</span>
              <h2>One founder. End-to-end product ownership.</h2>
              <p>Qzaar is founded, designed, and built by Karan Kannaujiya.</p>
            </motion.div>

            <motion.article className="about-founder__card" {...reveal}>
              <div className="about-founder__photo-wrap">
                <img src="/images/karan.jpg" alt="Karan Kannaujiya, founder of Qzaar" />
                <span className="about-founder__badge"><span /> Founder of Qzaar</span>
              </div>
              <div className="about-founder__content">
                <span className="about-kicker">Building the complete product</span>
                <h3>Karan Kannaujiya</h3>
                <strong>Founder · Product designer · Full-stack MERN developer</strong>
                <p>Karan is building Qzaar across product strategy, interface design, frontend engineering, backend systems, real-time restaurant workflows, and deployment. That end-to-end ownership keeps the guest experience and restaurant operation moving toward the same product vision.</p>
                <div className="about-founder__education"><span><Lightbulb size={17} /></span><div><small>Education</small><strong>B.Tech in Information Technology · IIIT Allahabad</strong></div></div>
                <div className="about-founder__focus">
                  <span><Check size={13} /> Product direction</span>
                  <span><Check size={13} /> Experience design</span>
                  <span><Check size={13} /> Full-stack engineering</span>
                  <span><Check size={13} /> Restaurant workflows</span>
                </div>
              </div>
              <aside className="about-founder__aside">
                <ScanLine size={24} />
                <small>Current focus</small>
                <strong>Making every restaurant workflow feel like part of one calm, capable system.</strong>
                <Link to="/contact">Talk to Karan <ArrowRight size={15} /></Link>
              </aside>
            </motion.article>
          </div>
        </section>

        <section className="about-cta-wrap">
          <motion.div className="about-shell about-cta" {...reveal}>
            <div className="about-cta__glow" />
            <span className="about-kicker"><Smartphone size={14} /> See the idea in motion</span>
            <h2>Experience the restaurant journey Qzaar is building.</h2>
            <p>Start as a guest, place an order, then explore the connected restaurant workspace behind it.</p>
            <div className="about-cta__actions">
              <Link className="about-button about-button--light" to="/demo">Open live demo <ArrowRight size={17} /></Link>
              <Link className="about-button about-button--glass" to="/signup">Create free account</Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
