import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BarChart3, BellRing, CheckCircle2, ChefHat, CircleDollarSign,
  Clock3, LayoutDashboard, PackageCheck, QrCode, ScanLine,
  ShieldCheck, Smartphone, Sparkles, Store, UtensilsCrossed, UsersRound, Zap
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';
import { hasActiveSession } from '../utils/authSession';

const featureCards = [
  { icon: QrCode, number: '01', title: 'A menu guests love to use', text: 'Give every table a fast, branded menu with beautiful item details, clear pricing, and effortless add-to-cart.', tone: 'blue' },
  { icon: BellRing, number: '02', title: 'Orders that stay in motion', text: 'Receive, prepare, and complete orders from one live workspace so your floor and kitchen always know what happens next.', tone: 'orange' },
  { icon: CircleDollarSign, number: '03', title: 'A checkout built for confidence', text: 'Offer familiar payment choices, keep each total clear, and give guests a clean confirmation at the end.', tone: 'violet' },
  { icon: BarChart3, number: '04', title: 'The clarity to improve every day', text: 'See what is selling, where service slows down, and what your guests come back for without leaving your dashboard.', tone: 'green' }
];

const journey = [
  { icon: Store, title: 'Make it yours', text: 'Add your restaurant identity, hours, contact details, and colours.' },
  { icon: UtensilsCrossed, title: 'Build your menu', text: 'Organise dishes, photos, prices, add-ons, and availability in one place.' },
  { icon: ScanLine, title: 'Share one QR', text: 'Print or place your scan link anywhere guests begin their experience.' },
  { icon: PackageCheck, title: 'Run service calmly', text: 'Keep every incoming order, payment, and update visible to your team.' }
];

const reassurance = [
  { icon: Zap, title: 'Fast to launch', text: 'Create a polished ordering experience without a complicated setup.' },
  { icon: ShieldCheck, title: 'Designed for trust', text: 'Secure sign-in, verified password reset, and protected payment workflow.' },
  { icon: UsersRound, title: 'Built around people', text: 'A simpler flow for guests, servers, kitchen teams, and owners.' }
];

const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function HomePage() {
  const isAuthenticated = useMemo(() => hasActiveSession(), []);
  const reduceMotion = useReducedMotion();
  const dashboardPath = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="landing-shell">
      <Navbar />
      <main>
        <section className="home-hero">
          <div className="home-hero__orb home-hero__orb--one" />
          <div className="home-hero__orb home-hero__orb--two" />
          <div className="landing-container home-hero__grid">
            <motion.div className="home-hero__copy" initial="hidden" animate="visible" variants={rise} transition={{ duration: reduceMotion ? 0 : .55 }}>
              <span className="home-eyebrow"><Sparkles size={15} /> Restaurant operations, made beautifully simple</span>
              <h1>Bring every part of service into one better flow.</h1>
              <p>Qzaar gives restaurants a polished QR menu, live order control, payments, and useful daily insight — all from one easy-to-run workspace.</p>
              <div className="home-hero__actions">
                <Link className="home-button home-button--primary" to={dashboardPath}>{isAuthenticated ? 'Open your workspace' : 'Create your workspace'} <ArrowRight size={18} /></Link>
                <a className="home-button home-button--secondary" href="#platform">Explore the platform <ArrowRight size={17} /></a>
              </div>
              <div className="home-hero__proof" aria-label="Platform benefits">
                <span><CheckCircle2 size={16} /> No app for guests</span><span><CheckCircle2 size={16} /> Live order updates</span><span><CheckCircle2 size={16} /> Ready for every shift</span>
              </div>
            </motion.div>

            <motion.div className="home-hero__visual" initial="hidden" animate="visible" variants={rise} transition={{ duration: reduceMotion ? 0 : .62, delay: reduceMotion ? 0 : .12 }}>
              <div className="hero-dashboard">
                <div className="hero-dashboard__top"><div><span>Qzaar workspace</span><strong>Saturday service</strong></div><b><i /> Live now</b></div>
                <div className="hero-dashboard__body">
                  <div className="hero-dashboard__summary"><span><Clock3 size={17} /> Average prep time</span><strong>14 min</strong><small>2 min faster than yesterday</small></div>
                  <div className="hero-dashboard__chart" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
                  <div className="hero-dashboard__orders"><div><span><b className="status-dot status-dot--amber" /> New order</span><strong>Table 08 · ₹860</strong></div><div><span><b className="status-dot status-dot--blue" /> Preparing</span><strong>Table 03 · 3 items</strong></div><div><span><b className="status-dot status-dot--green" /> Ready to serve</span><strong>Table 12 · 1 item</strong></div></div>
                </div>
                <div className="hero-dashboard__footer"><span><LayoutDashboard size={16} /> Today at a glance</span><strong>18 orders · ₹12,480</strong></div>
              </div>
              <motion.div className="hero-float-card hero-float-card--menu" animate={reduceMotion ? {} : { y: [0, -9, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}><span><QrCode size={17} /></span><div><strong>Guest menu is live</strong><small>Scan · Browse · Order</small></div></motion.div>
              <motion.div className="hero-float-card hero-float-card--order" animate={reduceMotion ? {} : { y: [0, 8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: .8 }}><span><ChefHat size={17} /></span><div><strong>Kitchen is in sync</strong><small>3 orders being prepared</small></div></motion.div>
            </motion.div>
          </div>
        </section>

        <section className="home-trust-strip"><div className="landing-container"><span>One platform for the whole restaurant journey</span><div><span><Smartphone size={17} /> Guest-first ordering</span><span><ChefHat size={17} /> Kitchen-ready workflows</span><span><BarChart3 size={17} /> Owner-level insight</span></div></div></section>

        <section id="platform" className="platform-section"><div className="landing-container"><motion.div className="section-heading section-heading--center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={rise}><span className="section-kicker">More than a QR menu</span><h2>A complete, connected restaurant platform.</h2><p>Every screen has a job: make the guest journey clearer and make service easier for the people behind it.</p></motion.div><div className="feature-grid">{featureCards.map((feature, index) => { const Icon = feature.icon; return <motion.article className={`feature-card feature-card--${feature.tone}`} key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={rise} transition={{ duration: .42, delay: reduceMotion ? 0 : index * .06 }}><div className="feature-card__top"><span className="feature-card__icon"><Icon size={24} /></span><b>{feature.number}</b></div><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-card__line" /></motion.article>; })}</div></div></section>

        <section id="workflow" className="home-story"><div className="landing-container home-story__grid"><motion.div className="home-story__image" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={rise}><img src="/images/brand/qzaar-restaurant-hero.png" alt="Guests enjoying a polished restaurant ordering experience" /><div className="home-story__image-label"><span><BellRing size={18} /></span><div><strong>From first scan to final payment</strong><small>A more considered guest experience</small></div></div></motion.div><motion.div className="home-story__copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={rise} transition={{ delay: reduceMotion ? 0 : .1 }}><span className="section-kicker">Made for real service</span><h2>Less chasing. More time to take care of your guests.</h2><p>Qzaar replaces scattered tools and unclear hand-offs with one shared source of truth. Your menu stays current, every order has a visible status, and guests always know where they are in the journey.</p><div className="home-story__points"><span><CheckCircle2 size={18} /> Keep menus accurate throughout the day</span><span><CheckCircle2 size={18} /> Give staff a live view of what matters now</span><span><CheckCircle2 size={18} /> Let guests order with confidence at their own pace</span></div><Link className="text-link" to="/about">Learn what Qzaar can do <ArrowRight size={17} /></Link></motion.div></div></section>

        <section className="journey-section"><div className="landing-container"><div className="section-heading"><span className="section-kicker">Your route to live service</span><h2>Set up once. Make every shift feel smoother.</h2></div><div className="journey-grid">{journey.map((step, index) => { const Icon = step.icon; return <motion.article className="journey-card" key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={rise} transition={{ duration: .4, delay: reduceMotion ? 0 : index * .07 }}><span className="journey-card__number">0{index + 1}</span><span className="journey-card__icon"><Icon size={24} /></span><h3>{step.title}</h3><p>{step.text}</p></motion.article>; })}</div></div></section>

        <section className="reassurance-section"><div className="landing-container reassurance-board"><div className="reassurance-board__intro"><span className="section-kicker">The Qzaar difference</span><h2>Technology that feels thoughtful, not technical.</h2></div><div className="reassurance-board__cards">{reassurance.map((item) => { const Icon = item.icon; return <article key={item.title}><span><Icon size={21} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>; })}</div></div></section>

        <section id="contact" className="final-cta"><div className="landing-container final-cta__inner"><div><span className="section-kicker">Ready when you are</span><h2>Make your next service the smoothest one yet.</h2><p>Start with a workspace that gives your restaurant a better way to welcome, serve, and grow.</p></div><div className="final-cta__actions"><Link className="home-button home-button--primary" to={dashboardPath}>{isAuthenticated ? 'Go to dashboard' : 'Get started free'} <ArrowRight size={18} /></Link><Link className="home-button home-button--secondary" to="/modern/menu">See a sample menu</Link></div></div></section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
