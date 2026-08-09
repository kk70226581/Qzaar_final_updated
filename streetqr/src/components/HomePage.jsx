import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  ChefHat,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  LayoutDashboard,
  MonitorPlay,
  QrCode,
  ScanLine,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  WalletCards,
  Zap
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { hasActiveSession } from '../utils/authSession';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const roleViews = [
  {
    id: 'guest',
    label: 'For guests',
    icon: Smartphone,
    eyebrow: 'A smoother first scan',
    title: 'Ordering that feels instantly familiar.',
    copy: 'Guests scan, browse, customise, and order from a visual menu—without downloading an app or waiting to wave someone down.',
    image: '/images/brand/qzaar-guest-welcome-hero.png',
    alt: 'A guest enjoying the Qzaar mobile ordering experience',
    points: ['No app download', 'Clear dietary details', 'Fast mobile checkout'],
    link: '/modern/menu',
    linkLabel: 'Try the guest menu'
  },
  {
    id: 'team',
    label: 'For your team',
    icon: ChefHat,
    eyebrow: 'One live service view',
    title: 'A calmer shift from counter to kitchen.',
    copy: 'New orders appear instantly, modifiers stay attached, and every status is visible—so the whole team knows what happens next.',
    image: '/images/brand/qzaar-live-service-hero-v2.png',
    alt: 'Restaurant staff coordinating a live Qzaar service',
    points: ['Instant order alerts', 'Focused kitchen queue', 'Simple status updates'],
    link: '/modern/admin/kitchen',
    linkLabel: 'Explore kitchen display'
  },
  {
    id: 'owner',
    label: 'For owners',
    icon: LayoutDashboard,
    eyebrow: 'Clarity beyond the rush',
    title: 'The daily picture, without the spreadsheet.',
    copy: 'See what is selling, when service peaks, and where attention is needed from one clear, visual dashboard.',
    image: '/images/brand/qzaar-restaurant-hero.png',
    alt: 'A restaurant owner reviewing the Qzaar business workspace',
    points: ['Live sales overview', 'Popular-item insight', 'Menu and staff controls'],
    link: '/modern/admin/analytics',
    linkLabel: 'See business insights'
  }
];

const serviceSteps = [
  { number: '01', icon: ScanLine, title: 'Scan', text: 'Guests open your live menu from a table QR.' },
  { number: '02', icon: ShoppingBag, title: 'Choose', text: 'Photos, details, and add-ons make decisions simple.' },
  { number: '03', icon: BellRing, title: 'Prepare', text: 'The kitchen receives a clear order instantly.' },
  { number: '04', icon: CircleCheckBig, title: 'Serve', text: 'Everyone can follow progress through completion.' }
];

const quickLinks = [
  { href: '#experience', icon: Smartphone, label: 'Guest experience' },
  { href: '#workspace', icon: MonitorPlay, label: 'Live operations' },
  { href: '#workflow', icon: Zap, label: 'How it works' },
  { href: '#questions', icon: Sparkles, label: 'Quick answers' }
];

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = hasActiveSession();
  const [activeRole, setActiveRole] = useState('guest');
  const activeView = roleViews.find((view) => view.id === activeRole) || roleViews[0];
  const primaryLabel = isLoggedIn ? 'Open my workspace' : 'Start for free';

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/signup');

  return (
    <div className="home-container">
      <Navbar />

      <main>
        <section className="dynamic-hero">
          <div className="dynamic-hero__media" aria-hidden="true">
            <img src="/images/brand/qzaar-live-service-hero-v2.png" alt="" />
          </div>
          <div className="dynamic-hero__veil" aria-hidden="true" />
          <div className="dynamic-hero__grid" aria-hidden="true" />

          <div className="dynamic-hero__inner">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="dynamic-hero__copy">
              <motion.div variants={fadeUp} className="dynamic-kicker">
                <span><Sparkles size={14} /></span>
                The restaurant OS built around service
              </motion.div>
              <motion.h1 variants={fadeUp}>From first scan to final plate, <em>everything flows.</em></motion.h1>
              <motion.p variants={fadeUp}>One beautiful guest menu. One live kitchen queue. One clear business view. Qzaar keeps your whole restaurant moving together.</motion.p>
              <motion.div variants={fadeUp} className="dynamic-hero__actions">
                <button type="button" className="dynamic-button dynamic-button--primary" onClick={handleCTA}>
                  {primaryLabel} <ArrowRight size={18} />
                </button>
                <Link className="dynamic-button dynamic-button--glass" to="/demo">
                  <span className="dynamic-play"><Zap size={14} /></span> See it in action
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="dynamic-hero__assurance">
                <span><Check size={14} /> No guest app</span>
                <span><Check size={14} /> Setup in minutes</span>
                <span><Check size={14} /> Mobile-first</span>
              </motion.div>
            </motion.div>

            <div className="dynamic-hero__live" aria-label="Live product highlights">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .55, duration: .55 }}
                className="live-card live-card--order"
              >
                <div className="live-card__top"><span><BellRing size={15} /> New order</span><i>Just now</i></div>
                <strong>Table 08</strong>
                <small>3 items · sent to kitchen</small>
                <div className="live-card__progress"><i /><i /><i /></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .78, duration: .55 }}
                className="live-card live-card--menu"
              >
                <span className="live-card__dish"><img src="/images/menu/paneer-tikka.png" alt="" /></span>
                <div><small>Most loved today</small><strong>Paneer Tikka</strong></div>
                <span className="live-card__trend"><TrendingUp size={14} /> Live</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: .85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: .45 }}
                className="live-pulse"
              >
                <span><QrCode size={20} /></span>
                Scan. Order. Enjoy.
              </motion.div>
            </div>
          </div>

          <div className="dynamic-hero__scroll"><span>Discover Qzaar</span><i /></div>
        </section>

        <nav className="home-quick-nav" aria-label="Explore the homepage">
          <div className="home-quick-nav__inner">
            <span className="home-quick-nav__label">Explore</span>
            {quickLinks.map(({ href, icon: Icon, label }) => (
              <a href={href} key={href}><Icon size={16} /> {label}</a>
            ))}
          </div>
        </nav>

        <section className="home-story" id="experience">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="home-story__copy"
          >
            <motion.span variants={fadeUp} className="dynamic-label">Hospitality stays human</motion.span>
            <motion.h2 variants={fadeUp}>Technology that quietly makes every moment better.</motion.h2>
            <motion.p variants={fadeUp}>Qzaar stays out of the way while helping guests decide faster, teams communicate clearly, and owners stay close to the business.</motion.p>
            <motion.div variants={fadeUp} className="home-story__stats">
              <div><strong>01</strong><span>Scan once<br />to begin</span></div>
              <div><strong>∞</strong><span>Menu updates<br />in real time</span></div>
              <div><strong>01</strong><span>Workspace for<br />the full shift</span></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: .65 }}
            className="home-story__gallery"
          >
            <figure className="story-photo story-photo--main">
              <img src="/images/brand/qzaar-table-service-hero.png" alt="Friendly restaurant table service" />
              <figcaption><UtensilsCrossed size={15} /> Better service, not more screens</figcaption>
            </figure>
            <figure className="story-photo story-photo--small">
              <img src="/images/brand/qzaar-guest-welcome-hero.png" alt="Guest browsing a restaurant experience" />
            </figure>
            <div className="story-orbit" aria-hidden="true"><QrCode size={24} /><span>Qzaar</span></div>
          </motion.div>
        </section>

        <section className="role-tour" id="workspace">
          <div className="role-tour__heading">
            <div><span className="dynamic-label">One platform · three perspectives</span><h2>See Qzaar through every role.</h2></div>
            <p>Tap a view to explore how the same live service adapts for guests, teams, and owners.</p>
          </div>

          <div className="role-tour__tabs" role="tablist" aria-label="Choose a restaurant role">
            {roleViews.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeRole === id}
                className={activeRole === id ? 'is-active' : ''}
                onClick={() => setActiveRole(id)}
                key={id}
              >
                <span><Icon size={18} /></span>{label}
              </button>
            ))}
          </div>

          <div className="role-tour__stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: .35, ease: 'easeOut' }}
                className="role-tour__panel"
                role="tabpanel"
              >
                <div className="role-tour__image">
                  <img src={activeView.image} alt={activeView.alt} />
                  <div className="role-tour__image-badge"><Clock3 size={15} /><span><strong>Live and connected</strong><small>Updates reach every view</small></span></div>
                </div>
                <div className="role-tour__content">
                  <span className="role-tour__eyebrow">{activeView.eyebrow}</span>
                  <h3>{activeView.title}</h3>
                  <p>{activeView.copy}</p>
                  <ul>
                    {activeView.points.map((point) => <li key={point}><CircleCheckBig size={17} /> {point}</li>)}
                  </ul>
                  <Link to={activeView.link}>{activeView.linkLabel} <ArrowRight size={17} /></Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="feature-world">
          <div className="feature-world__heading">
            <span className="dynamic-label">Everything in reach</span>
            <h2>Powerful where it matters.<br />Simple everywhere else.</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
            variants={stagger}
            className="feature-world__grid"
          >
            <motion.article variants={fadeUp} className="world-card world-card--menu">
              <div className="world-card__top"><span><QrCode size={20} /></span><i>Digital menu</i></div>
              <h3>Make every dish easy to love.</h3>
              <p>Rich photos, useful details, smart categories, and instant availability updates.</p>
              <div className="world-menu-preview">
                <img src="/images/menu/paneer-tikka.png" alt="Paneer tikka menu item" />
                <div><small>Chef recommended</small><strong>Paneer Tikka</strong><span>Smoky · Fresh · Vegetarian</span></div>
                <b>₹289</b>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="world-card world-card--orders">
              <div className="world-card__top"><span><MonitorPlay size={20} /></span><i>Live orders</i></div>
              <h3>Know what comes next.</h3>
              <p>A visual queue turns a busy service into clear, shared priorities.</p>
              <div className="world-orders-preview">
                <div><i className="new" /><span><strong>Table 12</strong><small>2 items · 1 min</small></span><b>New</b></div>
                <div><i className="cooking" /><span><strong>Table 04</strong><small>4 items · 8 min</small></span><b>Cooking</b></div>
                <div><i className="ready" /><span><strong>Pickup 18</strong><small>3 items · 12 min</small></span><b>Ready</b></div>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="world-card world-card--analytics">
              <div className="world-card__top"><span><BarChart3 size={20} /></span><i>Clear insights</i></div>
              <h3>Spot the story in your numbers.</h3>
              <p>Understand sales and menu performance at a glance.</p>
              <div className="world-chart" aria-hidden="true">
                <div className="world-chart__value"><small>Today</small><strong>Moving up</strong><span><TrendingUp size={14} /> Live</span></div>
                <div className="world-chart__bars">{[35, 52, 43, 67, 60, 78, 91].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="world-card world-card--payments">
              <div className="world-card__top"><span><WalletCards size={20} /></span><i>Easy checkout</i></div>
              <h3>Finish on a high note.</h3>
              <p>Give guests a clear order summary and familiar ways to pay.</p>
              <div className="world-payment-preview"><span><Check size={22} /></span><div><strong>Order confirmed</strong><small>Table 08 · Kitchen notified</small></div></div>
            </motion.article>
          </motion.div>
        </section>

        <section className="service-flow" id="workflow">
          <div className="service-flow__heading">
            <span className="dynamic-label">A four-step flow</span>
            <h2>As easy as dining should feel.</h2>
            <p>Simple for guests. Clear for your team. Ready for the next order.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="service-flow__steps">
            {serviceSteps.map(({ number, icon: Icon, title, text }) => (
              <motion.article variants={fadeUp} key={number}>
                <span className="service-flow__number">{number}</span>
                <div className="service-flow__icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="home-faq" id="questions">
          <div className="home-faq__intro">
            <span className="dynamic-label">Good to know</span>
            <h2>A few quick answers.</h2>
            <p>Still curious? Our team will help you find the right setup for your restaurant.</p>
            <Link to="/contact">Talk to a real person <ArrowRight size={16} /></Link>
          </div>
          <div className="home-faq__list">
            <details open><summary>Do guests need to install an app?<ChevronRight size={18} /></summary><p>No. Guests simply scan your QR code and the menu opens in their phone browser.</p></details>
            <details><summary>Can I change menu items during service?<ChevronRight size={18} /></summary><p>Yes. Update prices, descriptions, or availability and the live guest menu reflects it immediately.</p></details>
            <details><summary>Can my kitchen use Qzaar too?<ChevronRight size={18} /></summary><p>Yes. The kitchen display gives your team a focused live queue with clear preparation statuses.</p></details>
          </div>
        </section>

        <section className="dynamic-cta">
          <div className="dynamic-cta__image" aria-hidden="true"><img src="/images/brand/qzaar-guest-welcome-hero.png" alt="" /></div>
          <div className="dynamic-cta__overlay" aria-hidden="true" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="dynamic-cta__content">
            <motion.span variants={fadeUp}><Sparkles size={15} /> Your next service can feel different</motion.span>
            <motion.h2 variants={fadeUp}>Ready to bring every table, ticket, and team member together?</motion.h2>
            <motion.p variants={fadeUp}>Start your Qzaar workspace and create a restaurant experience people remember for the right reasons.</motion.p>
            <motion.div variants={fadeUp} className="dynamic-cta__actions">
              <button type="button" onClick={handleCTA} className="dynamic-button dynamic-button--light">{primaryLabel} <ArrowRight size={18} /></button>
              <Link to="/demo" className="dynamic-button dynamic-button--outline">Explore the demo</Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
