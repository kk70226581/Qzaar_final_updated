import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChefHat,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  MonitorPlay,
  QrCode,
  ScanLine,
  Settings,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Zap
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { hasActiveSession } from '../utils/authSession';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};

const workflow = [
  { icon: ScanLine, label: 'Guest scans', detail: 'No app download' },
  { icon: UtensilsCrossed, label: 'Order arrives', detail: 'Clear and instant' },
  { icon: ChefHat, label: 'Kitchen prepares', detail: 'One live queue' },
  { icon: BarChart3, label: 'Owner learns', detail: 'Useful daily insight' }
];

const steps = [
  { number: '01', icon: Settings, title: 'Set up your space', text: 'Add your restaurant details, service hours, taxes, and team.' },
  { number: '02', icon: UtensilsCrossed, title: 'Publish your menu', text: 'Create categories, add dishes, and update availability in seconds.' },
  { number: '03', icon: QrCode, title: 'Place your QR codes', text: 'Give every table a direct path to your live guest menu.' },
  { number: '04', icon: MonitorPlay, title: 'Run service live', text: 'Follow every order from guest choice to kitchen completion.' }
];

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = hasActiveSession();
  const primaryLabel = isLoggedIn ? 'Open workspace' : 'Start your workspace';

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/signup');

  return (
    <div className="home-container">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="home-hero__grid" aria-hidden="true" />
          <div className="home-hero__orb home-hero__orb--one" aria-hidden="true" />
          <div className="home-hero__orb home-hero__orb--two" aria-hidden="true" />

          <div className="home-hero__inner">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="home-hero__copy">
              <motion.div variants={fadeUp} className="home-eyebrow">
                <span><Sparkles size={14} /></span>
                Restaurant service, finally in one flow
              </motion.div>
              <motion.h1 variants={fadeUp}>
                One scan. Every part of service <em>in sync.</em>
              </motion.h1>
              <motion.p variants={fadeUp} className="home-hero__lead">
                Qzaar connects your guest menu, live orders, kitchen, and daily insights—so your team can move faster without making service feel rushed.
              </motion.p>
              <motion.div variants={fadeUp} className="home-hero__actions">
                <button type="button" onClick={handleCTA} className="home-button home-button--primary">
                  {primaryLabel} <ArrowRight size={18} />
                </button>
                <Link to="/demo" className="home-button home-button--ghost">
                  Explore live demo <ChevronRight size={17} />
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="home-hero__checks" aria-label="Platform benefits">
                <span><Check size={14} /> No guest app</span>
                <span><Check size={14} /> Live menu updates</span>
                <span><Check size={14} /> Works on any device</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
              className="home-hero__visual"
            >
              <div className="home-preview">
                <div className="home-preview__bar">
                  <span className="home-preview__brand"><QrCode size={15} /> Qzaar live service</span>
                  <span className="home-preview__status"><i /> Open now</span>
                </div>
                <div className="home-preview__image">
                  <img src="/images/brand/qzaar-restaurant-hero.png" alt="Guests using Qzaar QR ordering at a restaurant table" />
                  <div className="home-preview__shade" />
                  <div className="home-preview__order">
                    <span><Clock3 size={16} /> New order</span>
                    <strong>Table 12</strong>
                    <small>3 items · sent to kitchen</small>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
                className="home-float-card home-float-card--top"
              >
                <span><Zap size={16} /></span>
                <div><strong>Menu updated</strong><small>Live for every table</small></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.92 }}
                className="home-float-card home-float-card--bottom"
              >
                <span><ChefHat size={16} /></span>
                <div><strong>Kitchen in sync</strong><small>All orders in one queue</small></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="home-workflow" aria-label="Qzaar service workflow">
          <div className="home-workflow__inner">
            {workflow.map(({ icon: Icon, label, detail }, index) => (
              <React.Fragment key={label}>
                <div className="home-workflow__item">
                  <span><Icon size={19} /></span>
                  <div><strong>{label}</strong><small>{detail}</small></div>
                </div>
                {index < workflow.length - 1 && <ChevronRight className="home-workflow__arrow" size={17} aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="home-products">
          <div className="home-section-heading">
            <span>One connected workspace</span>
            <h2>Less tab-switching. More time for hospitality.</h2>
            <p>Every Qzaar tool shares the same live service picture, from the first guest scan to your end-of-day review.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="home-bento"
          >
            <motion.article variants={fadeUp} className="home-bento__card home-bento__card--menu">
              <div className="home-bento__icon"><QrCode size={22} /></div>
              <span className="home-bento__kicker">Guest experience</span>
              <h3>A menu that is always ready.</h3>
              <p>Update prices, availability, and photos once. Every table sees the change immediately.</p>
              <Link to="/modern/menu">View guest menu <ArrowRight size={16} /></Link>
              <div className="home-menu-card" aria-hidden="true">
                <span className="home-menu-card__image">🥘</span>
                <div><strong>Chef's Special</strong><small>Fresh today</small></div>
                <b>₹349</b>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="home-bento__card home-bento__card--orders">
              <div className="home-bento__icon"><MonitorPlay size={22} /></div>
              <span className="home-bento__kicker">Live operations</span>
              <h3>Every order, clearly placed.</h3>
              <p>A focused kitchen queue keeps new, preparing, and ready orders easy to scan.</p>
              <Link to="/modern/admin/kitchen">Open kitchen view <ArrowRight size={16} /></Link>
              <div className="home-order-list" aria-hidden="true">
                <div><i className="is-new" /><span><strong>#1042 · Table 8</strong><small>2 items</small></span><b>New</b></div>
                <div><i className="is-cooking" /><span><strong>#1041 · Table 3</strong><small>4 items</small></span><b>Cooking</b></div>
                <div><i className="is-ready" /><span><strong>#1039 · Pickup</strong><small>1 item</small></span><b>Ready</b></div>
              </div>
            </motion.article>

            <motion.article variants={fadeUp} className="home-bento__card home-bento__card--insight">
              <div className="home-bento__icon"><BarChart3 size={22} /></div>
              <span className="home-bento__kicker">Business insight</span>
              <h3>Know what needs attention.</h3>
              <p>See sales, popular dishes, and service patterns without digging through spreadsheets.</p>
              <Link to="/modern/admin/analytics">Explore analytics <ArrowRight size={16} /></Link>
              <div className="home-mini-chart" aria-hidden="true">
                {[42, 58, 48, 72, 64, 84, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
            </motion.article>
          </motion.div>
        </section>

        <section className="home-roles">
          <div className="home-roles__inner">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="home-roles__visual"
            >
              <img src="/images/brand/qzaar-table-service-hero.png" alt="Restaurant team delivering attentive table service" />
              <div className="home-roles__caption"><span><Smartphone size={17} /></span><div><strong>Simple for guests</strong><small>Scan, browse, and order from the table</small></div></div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="home-roles__copy"
            >
              <motion.span variants={fadeUp} className="home-section-label">Designed around real service</motion.span>
              <motion.h2 variants={fadeUp}>The right view for every person in the room.</motion.h2>
              <motion.p variants={fadeUp}>Guests see a clean menu. The kitchen sees a calm queue. Owners see the full picture. Nobody has to learn a complicated system.</motion.p>
              <motion.div variants={fadeUp} className="home-role-list">
                <div><span><Smartphone size={18} /></span><strong>Guests</strong><small>Fast, familiar mobile ordering</small></div>
                <div><span><ChefHat size={18} /></span><strong>Kitchen</strong><small>Clear priorities and order status</small></div>
                <div><span><LayoutDashboard size={18} /></span><strong>Owners</strong><small>Controls and insights in one place</small></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="home-steps">
          <div className="home-section-heading home-section-heading--left">
            <span>Up and running quickly</span>
            <h2>From first setup to first scan.</h2>
            <p>A straightforward path to a more connected service.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="home-steps__grid"
          >
            {steps.map(({ number, icon: Icon, title, text }) => (
              <motion.article variants={fadeUp} key={number} className="home-step">
                <span className="home-step__number">{number}</span>
                <div className="home-step__icon"><Icon size={21} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="home-cta">
          <div className="home-cta__glow" aria-hidden="true" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="home-cta__inner">
            <span><Sparkles size={15} /> Your next service can run smoother</span>
            <h2>Bring your whole restaurant into one calm workspace.</h2>
            <p>Start with your menu, explore the live flow, and shape Qzaar around the way your team already works.</p>
            <div className="home-cta__actions">
              <button type="button" onClick={handleCTA} className="home-button home-button--light">{primaryLabel} <ArrowRight size={18} /></button>
              <Link to="/contact" className="home-button home-button--outline">Talk to us</Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
