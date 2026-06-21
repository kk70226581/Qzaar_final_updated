import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  Clock3,
  CreditCard,
  LayoutDashboard,
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

const heroSignals = ['Fast setup', 'Mobile-first menu', 'Live order flow'];

const platformStats = [
  { label: 'Live menu modules', value: '4' },
  { label: 'Active orders', value: '18' },
  { label: 'Average prep', value: '14m' },
  { label: 'Launch setup', value: '8 min' }
];

const queueRows = [
  { id: '#A104', table: 'Table 04', value: 'Rs 370', status: 'Preparing', tone: 'amber' },
  { id: '#A105', table: 'Counter', value: 'Rs 220', status: 'Accepted', tone: 'blue' },
  { id: '#A106', table: 'Table 02', value: 'Rs 540', status: 'Ready', tone: 'green' }
];

const modules = [
  {
    icon: QrCode,
    title: 'QR storefront',
    text: 'Publish a customer menu that feels branded, fast, and easy to scan.'
  },
  {
    icon: BellRing,
    title: 'Live order desk',
    text: 'Track pending, preparing, ready, and fulfilled orders from one dashboard.'
  },
  {
    icon: CreditCard,
    title: 'Payment workflow',
    text: 'Support counter payment and online checkout without complicating service.'
  },
  {
    icon: BarChart3,
    title: 'Daily visibility',
    text: 'See menu depth, featured items, sales signals, and readiness at a glance.'
  }
];

const workflow = [
  { icon: Store, title: 'Set the brand', text: 'Add business identity, hours, address, contact details, and visual style.' },
  { icon: UtensilsCrossed, title: 'Structure the menu', text: 'Organize categories, pricing, item photos, prep time, tags, and availability.' },
  { icon: ScanLine, title: 'Place the QR', text: 'Use one public scan link for tables, counters, packaging, and campaigns.' },
  { icon: CheckCircle2, title: 'Operate live', text: 'Receive orders, confirm payments, manage status, and keep customers updated.' }
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
              <h1>Run QR ordering like a real, polished restaurant system.</h1>
              <p>
                Qzaar gives food businesses a clean digital menu, order desk, coupon engine,
                payment flow, and tracking experience without making the brand look childish.
              </p>

              <div className="home-signals">
                {heroSignals.map((signal) => (
                  <span className="home-signals__item" key={signal}>
                    {signal}
                  </span>
                ))}
              </div>

              <div className="home-hero__actions">
                <Link className="home-button home-button--primary" to={isAuthenticated ? '/menu' : '/login'}>
                  {isAuthenticated ? 'Open Dashboard' : 'Start Workspace'}
                  <ArrowRight size={18} />
                </Link>
                <Link className="home-button home-button--secondary" to="/about">
                  See Platform
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="ops-console"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="ops-console__top">
                <div>
                  <span>Qzaar Command</span>
                  <strong>Today&apos;s service</strong>
                </div>
                <b>Live</b>
              </div>

              <div className="ops-console__metrics">
                <div>
                  <span>Revenue</span>
                  <strong>Rs 24.5k</strong>
                </div>
                <div>
                  <span>Open orders</span>
                  <strong>18</strong>
                </div>
                <div>
                  <span>Avg prep</span>
                  <strong>14m</strong>
                </div>
              </div>

              <div className="ops-console__body">
                <div className="ops-console__queue">
                  <div className="ops-console__section-head">
                    <LayoutDashboard size={17} />
                    <span>Kitchen queue</span>
                  </div>
                  {queueRows.map((row) => (
                    <div className="queue-row" key={row.id}>
                      <strong>{row.id}</strong>
                      <span>{row.table}</span>
                      <span>{row.value}</span>
                      <b className={`queue-row__status queue-row__status--${row.tone}`}>{row.status}</b>
                    </div>
                  ))}
                </div>

                <div className="ops-console__side">
                  <div className="qr-card">
                    <QrCode size={42} />
                    <span>Public scan link</span>
                    <strong>Ready</strong>
                  </div>
                  <div className="prep-card">
                    <Clock3 size={18} />
                    <span>Peak window</span>
                    <strong>7-10 PM</strong>
                  </div>
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
            {platformStats.map((item) => (
              <motion.div className="signal-tile" key={item.label} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="platform-section">
          <div className="landing-container platform-section__header">
            <span className="section-kicker">Operations stack</span>
            <h2>Designed for scanning, ordering, payment, and follow-through.</h2>
            <p>
              A food business should not need five disconnected tools to accept QR orders.
              Qzaar keeps the customer menu and owner dashboard moving together.
            </p>
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
              <h2>Give customers a menu that feels reliable before they place the first order.</h2>
            </div>
            <Link className="home-button home-button--primary" to={isAuthenticated ? '/menu' : '/login'}>
              {isAuthenticated ? 'Continue' : 'Get Started'}
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
