import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  BellRing,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  CreditCard,
  Flame,
  HelpCircle,
  LayoutDashboard,
  MonitorPlay,
  Printer,
  QrCode,
  ScanLine,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  UtensilsCrossed,
  Wifi,
  XCircle,
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
  visible: { transition: { staggerChildren: 0.08 } }
};

const workflow = [
  { icon: ScanLine, label: 'Guest Scans QR', detail: 'Instant menu, no app download' },
  { icon: UtensilsCrossed, label: 'Order Dispatched', detail: 'Sent straight to kitchen queue' },
  { icon: ChefHat, label: 'Kitchen Prepares', detail: 'Color-coded station KDS' },
  { icon: BarChart3, label: 'Owner Learns', detail: 'Live margins & daily turnover' }
];

const sampleDishes = [
  {
    id: 'biryani',
    name: 'Royal Dum Biryani',
    category: 'signature',
    price: 380,
    time: '15 mins',
    rating: 4.9,
    reviews: 342,
    spicy: 'Medium',
    isVeg: false,
    badge: 'Bestseller',
    badgeType: 'fire',
    image: '/images/menu/biryani.png',
    description: 'Slow-cooked aromatic basmati rice layered with tender marinated pieces, saffron, caramelized onions and whole royal spices.'
  },
  {
    id: 'paneer-tikka',
    name: 'Smoked Paneer Tikka',
    category: 'veg',
    price: 290,
    time: '12 mins',
    rating: 4.8,
    reviews: 218,
    spicy: 'Mild',
    isVeg: true,
    badge: 'Pure Veg',
    badgeType: 'veg',
    image: '/images/menu/paneer-tikka.png',
    description: 'Clay-oven charred cottage cheese cubes marinated in spiced hung curd, bell peppers, mint glaze and chaat masala.'
  },
  {
    id: 'tandoori-chicken',
    name: 'Tandoori Chicken Supreme',
    category: 'nonveg',
    price: 420,
    time: '18 mins',
    rating: 4.9,
    reviews: 410,
    spicy: 'Medium',
    isVeg: false,
    badge: "Chef's Choice",
    badgeType: 'chef',
    image: '/images/menu/tandoori-chicken.png',
    description: 'Classic bone-in chicken slow roasted in a fiery tandoor, infused with Kashmiri chili, mustard oil and fresh lemon.'
  },
  {
    id: 'chefs-thali',
    name: 'Grand Maharaja Thali',
    category: 'signature',
    price: 499,
    time: '20 mins',
    rating: 4.9,
    reviews: 520,
    spicy: 'Mild',
    isVeg: true,
    badge: 'Royal Feast',
    badgeType: 'gold',
    image: '/images/menu/chefs-thali.png',
    description: 'Sumptuous banquet spread featuring 2 curries, slow-simmered dal makhani, paneer lababdar, pulao, rotis and dessert.'
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Butter Naan',
    category: 'veg',
    price: 75,
    time: '6 mins',
    rating: 4.8,
    reviews: 180,
    spicy: 'None',
    isVeg: true,
    badge: 'Tandoor Fresh',
    badgeType: 'neutral',
    image: '/images/menu/garlic-naan.png',
    description: 'Hand-stretched leavened flatbread brushed with garlic-infused clarified butter and toasted crisp in a clay oven.'
  },
  {
    id: 'cold-coffee',
    name: 'Artisanal Cold Brew Latte',
    category: 'beverages',
    price: 180,
    time: '5 mins',
    rating: 4.7,
    reviews: 165,
    spicy: 'None',
    isVeg: true,
    badge: 'Chilled',
    badgeType: 'blue',
    image: '/images/menu/cold-coffee.png',
    description: '18-hour cold extracted single-origin Arabica coffee served over crystal ice with silky whole milk foam.'
  },
  {
    id: 'sizzling-brownie',
    name: 'Sizzling Belgian Brownie',
    category: 'beverages',
    price: 240,
    time: '8 mins',
    rating: 5.0,
    reviews: 395,
    spicy: 'None',
    isVeg: true,
    badge: 'Crowd Favorite',
    badgeType: 'fire',
    image: '/images/menu/sizzling-brownie.png',
    description: 'Decadent warm fudge brownie served on a smoking cast-iron platter, crowned with Madagascar vanilla bean gelato.'
  },
  {
    id: 'gulab-jamun',
    name: 'Warm Rose Gulab Jamun',
    category: 'beverages',
    price: 140,
    time: '4 mins',
    rating: 4.9,
    reviews: 290,
    spicy: 'None',
    isVeg: true,
    badge: 'Sweet Ending',
    badgeType: 'gold',
    image: '/images/menu/gulab-jamun.png',
    description: 'Golden fried milk dumplings gently steeped in warm saffron-cardamom sugar syrup and garnished with roasted pistachios.'
  }
];

const comparisonData = [
  {
    feature: 'Menu & Price Edits',
    paper: 'Expensive reprinting (₹12k–₹20k/quarter); takes days to print & distribute',
    qzaar: '1-click instant sync across all tables in under 2 seconds; zero printing costs'
  },
  {
    feature: 'Guest Wait Time to Order',
    paper: 'Guests wait 8–15 minutes waving for available floor waiters during rush',
    qzaar: 'Immediate scan & order within 45 seconds directly from their phone'
  },
  {
    feature: 'Order Accuracy & Special Notes',
    paper: 'Waiters mishear requests or misplace scribbled paper KOTs; 6–9% order errors',
    qzaar: '100% digital precision with guest dietary notes sent straight to KDS screen'
  },
  {
    feature: 'Visual Upselling & High-Margin Items',
    paper: 'Waiters forget to suggest drinks or sides; average 12% upsell rate',
    qzaar: 'Automated photo-driven pairing suggestions boost average order value by +28%'
  },
  {
    feature: 'Handling Sold-Out (86) Dishes',
    paper: 'Awkward waiter visits back to table to apologize 15 minutes after ordering',
    qzaar: '1-tap "Sold Out" toggle instantly hides dish from all table menus live'
  },
  {
    feature: 'Hygiene & Table Presentation',
    paper: 'Greasy, sticky, torn laminated pages handled by dozens of customers',
    qzaar: 'Modern, hygienic, contactless experience on the guest’s own smartphone'
  }
];

const hardwareList = [
  {
    icon: Printer,
    title: 'Thermal KOT & Bill Printers',
    badge: 'Auto-Cut Ready',
    detail: 'Supports all standard 80mm & 58mm ESC/POS thermal receipt printers via Bluetooth, USB, or Ethernet LAN.'
  },
  {
    icon: MonitorPlay,
    title: 'Kitchen Tablets & Touch POS',
    badge: 'Universal Display',
    detail: 'Run our dedicated Kitchen Display System on any iPad, Android tablet, or existing touch POS terminal screen.'
  },
  {
    icon: Smartphone,
    title: 'Guest Smartphone Browser',
    badge: 'Zero App Download',
    detail: 'Compatible with 100% of iPhones & Android smartphones through native camera or QR scanner. Instant load.'
  },
  {
    icon: CreditCard,
    title: 'Instant UPI & Card Settlement',
    badge: 'Multi-Gateway',
    detail: 'Seamlessly accepts Razorpay, PhonePe, Paytm, Google Pay UPI QR, debit/credit cards, or traditional cash at counter.'
  }
];

const testimonials = [
  {
    quote: 'Switching to Qzaar cut our Saturday night table turnaround from 48 minutes down to 33 minutes. Guests love seeing high-res photos before ordering, and our dessert sales jumped 40%.',
    author: 'Chef Vikram Singhania',
    role: 'Founder & Head Chef',
    restaurant: 'The Olive Hearth',
    city: 'Bengaluru',
    stat: '+38% Dessert Revenue',
    avatar: '👨‍🍳'
  },
  {
    quote: 'Our kitchen crew used to struggle with missing paper tickets during the 8:30 PM rush. With Qzaar live KDS, zero tickets get misplaced and chefs know exactly what to fire next.',
    author: 'Meera Rao',
    role: 'General Operations Manager',
    restaurant: 'Spice & Brew Bistro',
    city: 'Mumbai',
    stat: 'Zero Misplaced KOTs',
    avatar: '👩‍💼'
  },
  {
    quote: 'The instant 86/Sold-Out toggle is an absolute lifesaver. When fresh seafood runs out on Friday nights, we toggle it off in 2 taps on our phone. No awkward waiter visits to apologize.',
    author: 'Arjun Malhotra',
    role: 'Managing Partner',
    restaurant: 'Krave Cloud Kitchens & Dine-In',
    city: 'Delhi NCR',
    stat: '32-Min Avg Turn',
    avatar: '🧑‍💼'
  }
];

const steps = [
  { number: '01', icon: Settings, title: 'Set up your restaurant', text: 'Enter your brand profile, service hours, table count, and tax preferences in minutes.' },
  { number: '02', icon: UtensilsCrossed, title: 'Build your visual menu', text: 'Add categories, mouthwatering dish photos, dietary badges, and set item pricing.' },
  { number: '03', icon: QrCode, title: 'Place smart table QR codes', text: 'Download print-ready PDF QR stands formatted cleanly for each individual table.' },
  { number: '04', icon: MonitorPlay, title: 'Run service live with KDS', text: 'Receive guest orders directly in the kitchen display and track real-time revenue.' }
];

const faqs = [
  {
    q: 'Do guests have to download an app from Play Store or App Store?',
    a: 'Never. Guests simply point their iPhone or Android camera at the QR code on the table. The high-speed web application opens instantly in Safari or Chrome in under 1 second without downloading anything or creating an account.'
  },
  {
    q: 'Can we still take orders manually with our regular floor waiters?',
    a: 'Yes! Qzaar is hybrid-first. Waiters can take orders through the staff mobile portal, or guests can order themselves directly from their phone. Both flows feed into the exact same kitchen queue in real time.'
  },
  {
    q: 'How does Kitchen Order Ticket (KOT) printing work?',
    a: 'You have complete flexibility: you can go 100% paperless using our digital Kitchen Display System (KDS) on a tablet mounted in the kitchen, or configure standard 80mm/58mm thermal receipt printers via Bluetooth, USB, or LAN network printing.'
  },
  {
    q: 'What happens if a dish runs out during peak dinner rush?',
    a: 'With one tap in your Admin or Kitchen dashboard, you can mark any item as "Sold Out" (86\'d). It immediately grays out across every single customer menu QR code in real-time, eliminating awkward apologies.'
  },
  {
    q: 'What if our restaurant Wi-Fi has an intermittent disconnection?',
    a: 'Qzaar is built with an offline-resilient local cache. The menu remains fully browsable, and pending requests queue with automatic WebSocket reconnection as soon as the signal returns.'
  },
  {
    q: 'How fast does setup take, and do we need technical skills?',
    a: 'Most restaurants go live within 10 minutes. Simply add your menu categories and items, download your auto-generated PDF table QR codes, print them, and place them on your tables. You are immediately ready for service.'
  }
];

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = hasActiveSession();
  const primaryLabel = isLoggedIn ? 'Open workspace' : 'Start your workspace';
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [demoCart, setDemoCart] = useState({ items: [], count: 0, total: 0 });
  const [cartToast, setCartToast] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/signup');

  const filteredDishes = sampleDishes.filter((dish) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'signature') return dish.category === 'signature';
    if (selectedCategory === 'veg') return dish.isVeg;
    if (selectedCategory === 'nonveg') return !dish.isVeg;
    if (selectedCategory === 'beverages') return dish.category === 'beverages';
    return true;
  });

  const handleAddToCart = (dish) => {
    setDemoCart((prev) => ({
      items: [...prev.items, dish],
      count: prev.count + 1,
      total: prev.total + dish.price
    }));
    setCartToast(`${dish.name} added to Table 04 order!`);
    setTimeout(() => {
      setCartToast(null);
    }, 2800);
  };

  const handleResetCart = () => {
    setDemoCart({ items: [], count: 0, total: 0 });
    setCartToast('Demo cart cleared.');
    setTimeout(() => setCartToast(null), 2000);
  };

  return (
    <div className="home-container">
      <Navbar />

      <main>
        {/* =================================================================
            1. HERO SECTION
            ================================================================= */}
        <section className="home-hero">
          <div className="home-hero__grid" aria-hidden="true" />
          <div className="home-hero__orb home-hero__orb--one" aria-hidden="true" />
          <div className="home-hero__orb home-hero__orb--two" aria-hidden="true" />

          <div className="home-hero__inner">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="home-hero__copy">
              <motion.div variants={fadeUp} className="home-eyebrow">
                <span><Sparkles size={14} /></span>
                Unified Restaurant Operating System
              </motion.div>
              <motion.h1 variants={fadeUp}>
                One scan. Every part of service <em>in sync.</em>
              </motion.h1>
              <motion.p variants={fadeUp} className="home-hero__lead">
                Qzaar connects your guest digital menu, real-time kitchen display, POS printers, and daily margins into one calm workspace. Faster table turns without making dining feel rushed.
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
                <span><Check size={14} /> Zero guest app install</span>
                <span><Check size={14} /> Instant live menu sync</span>
                <span><Check size={14} /> Thermal KOT printer ready</span>
                <span><Wifi size={14} /> Offline-resilient local sync</span>
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
                  <span className="home-preview__brand"><QrCode size={15} /> Qzaar Table Service OS</span>
                  <span className="home-preview__status"><BellRing size={13} /> Dining Room Active</span>
                </div>
                <div className="home-preview__image">
                  <img src="/images/brand/qzaar-restaurant-hero.png" alt="Guests using Qzaar QR ordering at a restaurant table" />
                  <div className="home-preview__shade" />
                  <div className="home-preview__order">
                    <span><Clock3 size={16} /> New Live Ticket</span>
                    <strong>Table 12 · 4 Guests</strong>
                    <small>3 items · routed to kitchen station</small>
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
                <div><strong>Menu synced live</strong><small>Instantly reflects on 24 tables</small></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.92 }}
                className="home-float-card home-float-card--bottom"
              >
                <span><ChefHat size={16} /></span>
                <div><strong>Kitchen queue calm</strong><small>Zero missing paper tickets</small></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* =================================================================
            2. REAL IMPACT METRICS STRIP
            ================================================================= */}
        <section className="home-metrics-bar" aria-label="Restaurant performance metrics">
          <div className="home-metrics-bar__inner">
            <div className="home-metric-item">
              <div className="home-metric-item__icon"><TrendingUp size={20} /></div>
              <div className="home-metric-item__content">
                <strong>+34%</strong>
                <span>Faster Table Turnaround</span>
                <small>Average 32-minute dining cycle</small>
              </div>
            </div>

            <div className="home-metric-item">
              <div className="home-metric-item__icon"><Flame size={20} /></div>
              <div className="home-metric-item__content">
                <strong>+28%</strong>
                <span>Higher Average Spend</span>
                <small>Driven by high-res photo menus</small>
              </div>
            </div>

            <div className="home-metric-item">
              <div className="home-metric-item__icon"><Zap size={20} /></div>
              <div className="home-metric-item__content">
                <strong>&lt; 1.2s</strong>
                <span>Instant Scan-to-Menu</span>
                <small>Zero app store download barrier</small>
              </div>
            </div>

            <div className="home-metric-item">
              <div className="home-metric-item__icon"><ShieldCheck size={20} /></div>
              <div className="home-metric-item__content">
                <strong>0%</strong>
                <span>Misplaced Kitchen Orders</span>
                <small>Direct digital WebSocket queue</small>
              </div>
            </div>
          </div>
          <div className="home-metrics-bar__trust">
            <span><Award size={15} /> Powering 250+ dine-in restaurants, craft cafes, rooftops, and cloud kitchens</span>
          </div>
        </section>

        {/* =================================================================
            3. WORKFLOW OVERVIEW
            ================================================================= */}
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

        {/* =================================================================
            4. UNIFIED RESTAURANT OS SHOWCASE (3 Interactive Tabs)
            ================================================================= */}
        <section className="home-products">
          <div className="home-section-heading">
            <span>Unified Restaurant OS</span>
            <h2>Less tab-switching. More time for hospitality.</h2>
            <p>Every Qzaar tool shares the same live service picture, from the first guest scan to your end-of-day revenue review.</p>
          </div>

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
                  <span>WebSocket Active</span>
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
                            <small>Table 04 · Dine-In Service · 4 Guests</small>
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
                              <button type="button" onClick={() => handleAddToCart(sampleDishes[0])} className="home-mini-add-btn">+ Add</button>
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
                              <button type="button" onClick={() => handleAddToCart(sampleDishes[1])} className="home-mini-add-btn">+ Add</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="home-preview-menu__cart-bar">
                        <div className="home-preview-menu__cart-text">
                          <span className="home-preview-cart-count">{demoCart.count > 0 ? demoCart.count : 2}</span>
                          <div>
                            <strong>Table 04 Order Ready</strong>
                            <small>₹{demoCart.total > 0 ? demoCart.total : 670} total · Direct kitchen dispatch</small>
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
                          <strong>3 orders in station</strong>
                        </div>
                        <div>
                          <span>Average prep speed</span>
                          <strong className="text-emerald">8.5 mins (Fast)</strong>
                        </div>
                        <div>
                          <span>Queue bottleneck</span>
                          <strong>Zero delayed tickets</strong>
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
                            <li><span>2x</span> Smoked Paneer Tikka</li>
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
                            <li><span>1x</span> Sizzling Belgian Brownie</li>
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
        </section>

        {/* =================================================================
            5. LIVE VISUAL FOOD MENU GALLERY (Interactive Dish Showcase)
            ================================================================= */}
        <section className="home-gallery-section" aria-label="Visual digital menu preview">
          <div className="home-gallery__inner">
            <div className="home-section-heading">
              <span>Visual Appetite Appeal</span>
              <h2>Menus with high-definition photos sell 28% more food.</h2>
              <p>Guests order with their eyes. Qzaar displays rich dish photography, dietary tags, spice ratings, and customizable add-ons cleanly on every smartphone screen.</p>
            </div>

            {/* Category filter tabs */}
            <div className="home-gallery__filters" role="tablist">
              <button
                type="button"
                className={`home-gallery-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Items ({sampleDishes.length})
              </button>
              <button
                type="button"
                className={`home-gallery-pill ${selectedCategory === 'signature' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('signature')}
              >
                <Flame size={14} /> Chef's Signature
              </button>
              <button
                type="button"
                className={`home-gallery-pill ${selectedCategory === 'veg' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('veg')}
              >
                🌱 Pure Veg
              </button>
              <button
                type="button"
                className={`home-gallery-pill ${selectedCategory === 'nonveg' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('nonveg')}
              >
                🍗 Tandoor & Grills
              </button>
              <button
                type="button"
                className={`home-gallery-pill ${selectedCategory === 'beverages' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('beverages')}
              >
                <Coffee size={14} /> Drinks & Desserts
              </button>
            </div>

            {/* Interactive Demo Cart Notification */}
            {cartToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="home-cart-toast"
              >
                <CheckCircle2 size={16} /> {cartToast}
              </motion.div>
            )}

            {/* Food Cards Grid */}
            <div className="home-gallery__grid">
              {filteredDishes.map((dish) => (
                <article key={dish.id} className="home-food-card">
                  <div className="home-food-card__media">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onError={(e) => { e.currentTarget.src = '/images/brand/qzaar-restaurant-hero.png'; }}
                      loading="lazy"
                    />
                    <div className="home-food-card__badges">
                      <span className={`home-food-badge home-food-badge--${dish.badgeType}`}>
                        {dish.badgeType === 'fire' && <Flame size={11} />}
                        {dish.badgeType === 'veg' && '🌱 '}
                        {dish.badge}
                      </span>
                      <span className="home-food-badge home-food-badge--rating">
                        <Star size={11} fill="#f59e0b" stroke="#f59e0b" /> {dish.rating}
                      </span>
                    </div>
                  </div>

                  <div className="home-food-card__body">
                    <div className="home-food-card__header">
                      <h3>{dish.name}</h3>
                      <span className="home-food-card__price">₹{dish.price}</span>
                    </div>

                    <p className="home-food-card__desc">{dish.description}</p>

                    <div className="home-food-card__meta">
                      <span className="home-meta-chip"><Clock3 size={12} /> {dish.time}</span>
                      <span className="home-meta-chip">{dish.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}</span>
                      {dish.spicy !== 'None' && <span className="home-meta-chip">🌶️ {dish.spicy}</span>}
                    </div>

                    <div className="home-food-card__action">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(dish)}
                        className="home-food-card__add-btn"
                      >
                        <ShoppingBag size={14} /> + Add to Order
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Live Demo Cart Floating Action Pill */}
            {demoCart.count > 0 && (
              <div className="home-demo-cart-strip">
                <div className="home-demo-cart-strip__info">
                  <span className="home-demo-cart-badge">{demoCart.count}</span>
                  <div>
                    <strong>Table 04 Demo Order Active</strong>
                    <small>{demoCart.count} dishes selected · Total ₹{demoCart.total}</small>
                  </div>
                </div>
                <div className="home-demo-cart-strip__actions">
                  <button type="button" onClick={handleResetCart} className="home-demo-cart-clear">
                    Reset
                  </button>
                  <Link to="/modern/menu" className="home-demo-cart-cta">
                    Open Guest Menu Checkout <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================
            6. ENHANCED BENTO CARDS (With Real Mockups & Check Bullets)
            ================================================================= */}
        <section className="home-bento-section">
          <div className="home-section-heading">
            <span>Built For Every Corner of Your Operation</span>
            <h2>Three specialized views. One unified single source of truth.</h2>
            <p>From the moment guests sit down to the final kitchen ticket, every team member has the exact tools they need.</p>
          </div>

          <div className="home-bento">
            {/* Card 1: Guest Experience */}
            <article className="home-bento__card">
              <div className="home-bento__preview-media">
                <img
                  src="/images/brand/qzaar-guest-welcome-hero.png"
                  alt="Guest browsing digital menu on mobile"
                />
                <span className="home-bento__media-badge"><Smartphone size={13} /> Mobile Safari & Chrome</span>
              </div>
              <div className="home-bento__body">
                <div className="home-bento__header">
                  <div className="home-bento__icon"><Smartphone size={20} /></div>
                  <span className="home-bento__kicker">Guest Experience</span>
                </div>
                <h3>Frictionless menu guests genuinely love.</h3>
                <p>No app download or account creation required. Instant camera scan opens a responsive, photo-rich menu with dietary filters.</p>
                <ul className="home-bento__bullet-list">
                  <li><CheckCircle2 size={16} /> Instant camera scan without App Store / Play Store login</li>
                  <li><CheckCircle2 size={16} /> Dietary filters: Pure Veg, Jain, Non-Veg & Chef Specials</li>
                  <li><CheckCircle2 size={16} /> Guests can re-order drinks and sides anytime without waiting</li>
                </ul>
                <div className="home-bento__footer">
                  <Link to="/modern/menu">Explore guest menu <ArrowRight size={16} /></Link>
                  <span className="home-card-pill">Zero App Install</span>
                </div>
              </div>
            </article>

            {/* Card 2: Kitchen Display System */}
            <article className="home-bento__card">
              <div className="home-bento__preview-media">
                <img
                  src="/images/brand/qzaar-restaurant-hero.png"
                  alt="Restaurant dining room and kitchen operations"
                />
                <span className="home-bento__media-badge"><MonitorPlay size={13} /> Tablet & Touch KDS</span>
              </div>
              <div className="home-bento__body">
                <div className="home-bento__header">
                  <div className="home-bento__icon"><MonitorPlay size={20} /></div>
                  <span className="home-bento__kicker">Kitchen Operations</span>
                </div>
                <h3>Silence the kitchen chaos with live KDS.</h3>
                <p>Replace lost, greasy paper tickets with a high-visibility digital display that auto-routes tickets to grill, tandoor, or bar stations.</p>
                <ul className="home-bento__bullet-list">
                  <li><CheckCircle2 size={16} /> Color-coded priority alerts when tickets reach 10+ minutes</li>
                  <li><CheckCircle2 size={16} /> 1-tap status workflow: New ➔ Preparing ➔ Ready ➔ Served</li>
                  <li><CheckCircle2 size={16} /> Automatic ESC/POS thermal printer KOT auto-cut printing</li>
                </ul>
                <div className="home-bento__footer">
                  <Link to="/modern/admin/kitchen">Open kitchen display <ArrowRight size={16} /></Link>
                  <span className="home-card-pill">WebSocket Synced</span>
                </div>
              </div>
            </article>

            {/* Card 3: Business Analytics */}
            <article className="home-bento__card">
              <div className="home-bento__preview-media">
                <img
                  src="/images/brand/qzaar-table-service-hero.png"
                  alt="Attentive table service and business insight"
                />
                <span className="home-bento__media-badge"><BarChart3 size={13} /> Live Margin Intelligence</span>
              </div>
              <div className="home-bento__body">
                <div className="home-bento__header">
                  <div className="home-bento__icon"><BarChart3 size={20} /></div>
                  <span className="home-bento__kicker">Business Intelligence</span>
                </div>
                <h3>Live profit margins, top dishes, & 86'ing.</h3>
                <p>Know exactly which dishes yield the highest profit margins, track peak hour dining rushes, and 86 sold-out items in 2 clicks.</p>
                <ul className="home-bento__bullet-list">
                  <li><CheckCircle2 size={16} /> 1-click 'Sold Out' toggle immediately updates all table QR codes</li>
                  <li><CheckCircle2 size={16} /> Real-time hourly sales curves and table velocity tracking</li>
                  <li><CheckCircle2 size={16} /> Automated tax, GST, and daily reconciliation reports</li>
                </ul>
                <div className="home-bento__footer">
                  <Link to="/modern/admin/analytics">Explore analytics suite <ArrowRight size={16} /></Link>
                  <span className="home-card-pill">Real-time Metrics</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* =================================================================
            7. PAPER MENUS VS QZAAR MATRIX
            ================================================================= */}
        <section className="home-comparison-section" aria-label="Paper menus vs Qzaar comparison">
          <div className="home-comparison__inner">
            <div className="home-section-heading">
              <span>The Strategic Upgrade</span>
              <h2>Why 250+ restaurateurs replaced laminated paper with Qzaar.</h2>
              <p>See how digital QR table ordering directly solves the 6 most expensive friction points in daily restaurant operations.</p>
            </div>

            <div className="home-matrix-table-wrap">
              <table className="home-matrix-table">
                <thead>
                  <tr>
                    <th>Service Challenge</th>
                    <th className="th--paper">Traditional Paper Menus</th>
                    <th className="th--qzaar">Qzaar Unified Restaurant OS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="home-matrix-feat">
                        <strong>{row.feature}</strong>
                      </td>
                      <td className="home-matrix-paper">
                        <div className="home-matrix-cell">
                          <XCircle className="icon-cross" size={17} />
                          <span>{row.paper}</span>
                        </div>
                      </td>
                      <td className="home-matrix-qzaar">
                        <div className="home-matrix-cell">
                          <CheckCircle2 className="icon-check" size={17} />
                          <span>{row.qzaar}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =================================================================
            8. HARDWARE & PAYMENTS ECOSYSTEM STRIP
            ================================================================= */}
        <section className="home-hardware-section" aria-label="Supported restaurant hardware">
          <div className="home-hardware__inner">
            <div className="home-section-heading">
              <span>Universal Compatibility</span>
              <h2>Works seamlessly with the equipment you already own.</h2>
              <p>No expensive proprietary POS hardware locks. Qzaar connects effortlessly with commercial printers, tablets, and payment networks.</p>
            </div>

            <div className="home-hardware-grid">
              {hardwareList.map(({ icon: Icon, title, badge, detail }) => (
                <div key={title} className="home-hardware-card">
                  <div className="home-hardware-card__head">
                    <div className="home-hardware-card__icon"><Icon size={24} /></div>
                    <span className="home-hardware-card__badge">{badge}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            9. ROLE-BASED EXPERIENCE SPLIT
            ================================================================= */}
        <section className="home-roles">
          <div className="home-roles__inner">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="home-roles__visual"
            >
              <img src="/images/brand/qzaar-table-service-hero.png" alt="Restaurant team delivering attentive table service" />
              <div className="home-roles__caption">
                <span><Smartphone size={17} /></span>
                <div>
                  <strong>Simple for guests and staff</strong>
                  <small>Scan, browse, fire to kitchen, and pay seamlessly</small>
                </div>
              </div>
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
              <motion.p variants={fadeUp}>
                Guests see a rich visual menu. The kitchen sees a calm prioritized queue. Floor staff spend less time writing orders and more time greeting guests.
              </motion.p>
              <motion.div variants={fadeUp} className="home-role-list">
                <div>
                  <span><Smartphone size={18} /></span>
                  <div>
                    <strong>Dine-In Guests</strong>
                    <small>Fast, familiar mobile ordering without downloading apps</small>
                  </div>
                </div>
                <div>
                  <span><ChefHat size={18} /></span>
                  <div>
                    <strong>Kitchen & Bar Stations</strong>
                    <small>Color-coded order priorities with live prep timing</small>
                  </div>
                </div>
                <div>
                  <span><LayoutDashboard size={18} /></span>
                  <div>
                    <strong>Owners & Managers</strong>
                    <small>Full financial control, live inventory 86'ing & daily reconciliation</small>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* =================================================================
            10. SOCIAL PROOF & TESTIMONIALS
            ================================================================= */}
        <section className="home-testimonials-section" aria-label="Customer testimonials">
          <div className="home-testimonials__inner">
            <div className="home-section-heading">
              <span>Restaurateur Stories</span>
              <h2>Proven on the busiest dinner rushes across the country.</h2>
              <p>Hear how independent restaurateurs and busy food businesses transformed their floor operations with Qzaar.</p>
            </div>

            <div className="home-testimonials-grid">
              {testimonials.map((t, idx) => (
                <article key={idx} className="home-testimonial-card">
                  <div className="home-testimonial-card__header">
                    <span className="home-testimonial-avatar">{t.avatar}</span>
                    <div>
                      <strong>{t.author}</strong>
                      <small>{t.role} · {t.restaurant}</small>
                    </div>
                  </div>
                  <p className="home-testimonial-quote">"{t.quote}"</p>
                  <div className="home-testimonial-card__footer">
                    <span className="home-testimonial-location">{t.city}</span>
                    <span className="home-testimonial-stat">
                      <TrendingUp size={13} /> {t.stat}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            11. 4-STEP ONBOARDING
            ================================================================= */}
        <section className="home-steps">
          <div className="home-section-heading home-section-heading--left">
            <span>Up and running quickly</span>
            <h2>From first setup to first guest scan in under 10 minutes.</h2>
            <p>A straightforward, guided onboarding path that works alongside your current service rhythm.</p>
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

        {/* =================================================================
            12. FREQUENTLY ASKED QUESTIONS (Accordion)
            ================================================================= */}
        <section className="home-faq-section" aria-label="Frequently asked questions">
          <div className="home-faq__inner">
            <div className="home-section-heading">
              <span>Got Questions?</span>
              <h2>Everything you need to know before getting started.</h2>
              <p>Simple answers to the most common questions restaurant managers ask about Qzaar.</p>
            </div>

            <div className="home-faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className={`home-faq-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="home-faq-item__trigger"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="home-faq-item__q">
                        <HelpCircle size={18} className="home-faq-icon" />
                        {faq.q}
                      </span>
                      <ChevronDown size={18} className={`home-faq-chevron ${isOpen ? 'is-rotated' : ''}`} />
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="home-faq-item__answer"
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            13. CALL TO ACTION
            ================================================================= */}
        <section className="home-cta">
          <div className="home-cta__glow" aria-hidden="true" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="home-cta__inner">
            <span><Sparkles size={15} /> Your next service can run smoother</span>
            <h2>Bring your whole restaurant into one calm workspace.</h2>
            <p>Start with your menu, explore the live flow, and shape Qzaar around the way your team already works.</p>
            <div className="home-cta__actions">
              <button type="button" onClick={handleCTA} className="home-button home-button--light">
                {primaryLabel} <ArrowRight size={18} />
              </button>
              <Link to="/contact" className="home-button home-button--outline">
                Talk to our team
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
