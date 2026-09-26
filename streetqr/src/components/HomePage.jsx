import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChefHat,
  ChevronRight,
  Clock3,
  Flame,
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
  const [activeTab, setActiveTab] = useState('menu');

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
            <span>Unified Restaurant OS</span>
            <h2>Less tab-switching. More time for hospitality.</h2>
            <p>Every Qzaar tool shares the same live service picture, from the first guest scan to your end-of-day review.</p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="home-tabs-container">
            <div className="home-tabs-nav" role="tablist" aria-label="Product features">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'menu'}
                className={`home-tab-btn ${activeTab === 'menu' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('menu')}
              >
                <QrCode size={18} />
                <span>Guest QR Menu</span>
                <span className="home-tab-pill">Mobile-first</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'kitchen'}
                className={`home-tab-btn ${activeTab === 'kitchen' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('kitchen')}
              >
                <MonitorPlay size={18} />
                <span>Kitchen Display (KDS)</span>
                <span className="home-tab-pill">Real-time</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'analytics'}
                className={`home-tab-btn ${activeTab === 'analytics' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={18} />
                <span>Live Analytics</span>
                <span className="home-tab-pill">Intelligence</span>
              </button>
            </div>

            {/* Interactive Showcase Window */}
            <div className="home-showcase-window">
              <div className="home-showcase-window__bar">
                <div className="home-showcase-window__dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="home-showcase-window__address">
                  {activeTab === 'menu' && 'app.qzaar.in/table/04/menu'}
                  {activeTab === 'kitchen' && 'app.qzaar.in/kds/live-station'}
                  {activeTab === 'analytics' && 'app.qzaar.in/dashboard/insights'}
                </div>
                <div className="home-showcase-window__status">
                  <span className="home-pulse-dot" />
                  <span>Live sync active</span>
                </div>
              </div>

              <div className="home-showcase-window__body">
                <AnimatePresence mode="wait">
                  {activeTab === 'menu' && (
                    <motion.div
                      key="tab-menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="home-showcase-panel home-showcase-panel--menu"
                    >
                      <div className="home-preview-menu__header">
                        <div className="home-preview-menu__branding">
                          <span className="home-preview-menu__avatar">🥘</span>
                          <div>
                            <strong>The Royal Courtyard</strong>
                            <small>Table 04 · Dine-In Service</small>
                          </div>
                        </div>
                        <span className="home-tag home-tag--green">✓ Live Table Synced</span>
                      </div>

                      <div className="home-preview-menu__categories">
                        <span className="is-active">🔥 Chef Specials</span>
                        <span>🍛 Main Course</span>
                        <span>🥟 Starters</span>
                        <span>🥤 Refreshers</span>
                      </div>

                      <div className="home-preview-menu__cards">
                        <div className="home-preview-dish">
                          <img
                            src="/images/menu/biryani.png"
                            alt="Royal Dum Biryani"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div className="home-preview-dish__info">
                            <div className="home-preview-dish__top">
                              <strong>Royal Dum Biryani</strong>
                              <b>₹380</b>
                            </div>
                            <p>Layered basmati rice with fragrant spices & saffron</p>
                            <div className="home-preview-dish__bottom">
                              <span className="home-dish-pill"><Flame size={12} /> Bestseller</span>
                              <button type="button" className="home-mini-add-btn">+ Add</button>
                            </div>
                          </div>
                        </div>

                        <div className="home-preview-dish">
                          <img
                            src="/images/menu/paneer-tikka.png"
                            alt="Paneer Tikka Grill"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div className="home-preview-dish__info">
                            <div className="home-preview-dish__top">
                              <strong>Paneer Tikka Grill</strong>
                              <b>₹290</b>
                            </div>
                            <p>Smoky tandoori cottage cheese with bell peppers</p>
                            <div className="home-preview-dish__bottom">
                              <span className="home-dish-pill home-dish-pill--veg">🌱 Pure Veg</span>
                              <button type="button" className="home-mini-add-btn">+ Add</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="home-preview-menu__cart-bar">
                        <div className="home-preview-menu__cart-text">
                          <span className="home-preview-cart-count">2</span>
                          <div>
                            <strong>Table 04 Order Ready</strong>
                            <small>₹670 total · Direct kitchen dispatch</small>
                          </div>
                        </div>
                        <Link to="/modern/menu" className="home-preview-menu__cart-link">
                          Explore live guest menu <ArrowRight size={15} />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'kitchen' && (
                    <motion.div
                      key="tab-kitchen"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="home-showcase-panel home-showcase-panel--kitchen"
                    >
                      <div className="home-preview-kds__stats">
                        <div>
                          <span>Active tickets</span>
                          <strong>3 orders</strong>
                        </div>
                        <div>
                          <span>Average prep speed</span>
                          <strong className="text-emerald">8.5 mins</strong>
                        </div>
                        <div>
                          <span>Queue bottleneck</span>
                          <strong>Zero delays</strong>
                        </div>
                      </div>

                      <div className="home-preview-kds__grid">
                        <div className="home-kds-card home-kds-card--new">
                          <div className="home-kds-card__head">
                            <span className="home-kds-ticket">#1042</span>
                            <span className="home-kds-table">Table 8</span>
                            <span className="home-kds-badge home-kds-badge--blue">New (2m)</span>
                          </div>
                          <ul className="home-kds-card__items">
                            <li><span>2x</span> Paneer Tikka Grill</li>
                            <li><span>1x</span> Garlic Butter Naan</li>
                          </ul>
                          <div className="home-kds-card__action">
                            <button type="button" className="home-kds-btn home-kds-btn--blue">▶ Start Cooking</button>
                          </div>
                        </div>

                        <div className="home-kds-card home-kds-card--cooking">
                          <div className="home-kds-card__head">
                            <span className="home-kds-ticket">#1041</span>
                            <span className="home-kds-table">Table 3</span>
                            <span className="home-kds-badge home-kds-badge--amber">Cooking (6m)</span>
                          </div>
                          <ul className="home-kds-card__items">
                            <li><span>1x</span> Royal Dum Biryani</li>
                            <li><span>2x</span> Cold Brew Latte</li>
                          </ul>
                          <div className="home-kds-card__action">
                            <button type="button" className="home-kds-btn home-kds-btn--amber">✓ Mark Ready</button>
                          </div>
                        </div>

                        <div className="home-kds-card home-kds-card--ready">
                          <div className="home-kds-card__head">
                            <span className="home-kds-ticket">#1039</span>
                            <span className="home-kds-table">Pickup</span>
                            <span className="home-kds-badge home-kds-badge--green">Ready (11m)</span>
                          </div>
                          <ul className="home-kds-card__items">
                            <li><span>1x</span> Sizzling Brownie</li>
                          </ul>
                          <div className="home-kds-card__action">
                            <button type="button" className="home-kds-btn home-kds-btn--green">✓ Dispatch Order</button>
                          </div>
                        </div>
                      </div>

                      <div className="home-preview-kds__footer">
                        <span>WebSocket live connection synchronized with all service tables</span>
                        <Link to="/modern/admin/kitchen">Open kitchen view <ArrowRight size={15} /></Link>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'analytics' && (
                    <motion.div
                      key="tab-analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="home-showcase-panel home-showcase-panel--analytics"
                    >
                      <div className="home-analytics-top">
                        <div className="home-analytics-metric">
                          <small>Today's Gross Sales</small>
                          <div className="home-analytics-metric__val">
                            <strong>₹48,250</strong>
                            <span className="text-emerald">+24.8%</span>
                          </div>
                          <span>184 paid orders today</span>
                        </div>

                        <div className="home-analytics-metric">
                          <small>Table Turnaround</small>
                          <div className="home-analytics-metric__val">
                            <strong>34 mins</strong>
                            <span className="text-emerald">-6m faster</span>
                          </div>
                          <span>3.8 turns per table avg</span>
                        </div>

                        <div className="home-analytics-metric">
                          <small>Guest Satisfaction</small>
                          <div className="home-analytics-metric__val">
                            <strong>4.9 ★</strong>
                            <span className="text-indigo">98% positive</span>
                          </div>
                          <span>Zero missed tickets</span>
                        </div>
                      </div>

                      <div className="home-analytics-split">
                        <div className="home-analytics-chart-box">
                          <div className="home-analytics-chart-box__head">
                            <strong>Hourly Order Volume</strong>
                            <small>Peak service: 8:00 PM - 10:00 PM</small>
                          </div>
                          <div className="home-visual-bars">
                            {[
                              { label: '12p', height: 42, count: 18 },
                              { label: '2p', height: 68, count: 32 },
                              { label: '4p', height: 35, count: 14 },
                              { label: '6p', height: 58, count: 28 },
                              { label: '8p', height: 96, count: 48 },
                              { label: '10p', height: 78, count: 36 }
                            ].map((bar, idx) => (
                              <div key={idx} className="home-visual-bar-col">
                                <div className="home-bar-wrap">
                                  <span className="home-bar-tooltip">{bar.count} orders</span>
                                  <div className="home-bar-fill" style={{ height: `${bar.height}%` }} />
                                </div>
                                <span className="home-bar-label">{bar.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="home-analytics-ranking">
                          <strong>Top Moving Dishes</strong>
                          <div className="home-ranking-list">
                            <div className="home-ranking-row">
                              <span className="home-rank-num">1</span>
                              <div className="home-rank-details">
                                <strong>Royal Dum Biryani</strong>
                                <small>48 orders · ₹18,240</small>
                              </div>
                              <span className="home-rank-share">38%</span>
                            </div>
                            <div className="home-ranking-row">
                              <span className="home-rank-num">2</span>
                              <div className="home-rank-details">
                                <strong>Paneer Tikka Grill</strong>
                                <small>36 orders · ₹10,440</small>
                              </div>
                              <span className="home-rank-share">26%</span>
                            </div>
                            <div className="home-ranking-row">
                              <span className="home-rank-num">3</span>
                              <div className="home-rank-details">
                                <strong>Sizzling Brownie</strong>
                                <small>29 orders · ₹6,960</small>
                              </div>
                              <span className="home-rank-share">18%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="home-preview-analytics__footer">
                        <span>Database aggregation pipelines calculate live margins in sub-10ms</span>
                        <Link to="/modern/admin/analytics">Explore analytics suite <ArrowRight size={15} /></Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 3 Balanced, Uniform Bento Cards Below */}
          <div className="home-bento">
            <article className="home-bento__card">
              <div className="home-bento__header">
                <div className="home-bento__icon"><QrCode size={20} /></div>
                <span className="home-bento__kicker">Guest Experience</span>
              </div>
              <h3>A menu that is always ready.</h3>
              <p>Update prices, availability, and high-res photos once. Every table sees updates immediately without re-printing.</p>
              <div className="home-bento__footer">
                <Link to="/modern/menu">View guest menu <ArrowRight size={16} /></Link>
                <span className="home-card-pill">Zero App Install</span>
              </div>
            </article>

            <article className="home-bento__card">
              <div className="home-bento__header">
                <div className="home-bento__icon"><MonitorPlay size={20} /></div>
                <span className="home-bento__kicker">Live Operations</span>
              </div>
              <h3>Every order, clearly placed.</h3>
              <p>A focused kitchen queue keeps new, preparing, and ready orders easy to scan and expedite without tickets getting lost.</p>
              <div className="home-bento__footer">
                <Link to="/modern/admin/kitchen">Open kitchen view <ArrowRight size={16} /></Link>
                <span className="home-card-pill">WebSocket Synced</span>
              </div>
            </article>

            <article className="home-bento__card">
              <div className="home-bento__header">
                <div className="home-bento__icon"><BarChart3 size={20} /></div>
                <span className="home-bento__kicker">Business Insight</span>
              </div>
              <h3>Know what needs attention.</h3>
              <p>See live revenue, popular dishes, peak service patterns, and table velocity without digging through spreadsheets.</p>
              <div className="home-bento__footer">
                <Link to="/modern/admin/analytics">Explore analytics <ArrowRight size={16} /></Link>
                <span className="home-card-pill">Real-time Metrics</span>
              </div>
            </article>
          </div>
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
