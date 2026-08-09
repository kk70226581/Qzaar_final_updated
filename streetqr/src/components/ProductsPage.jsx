import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Check,
  ChefHat,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Gauge,
  IndianRupee,
  Layers3,
  MapPin,
  PackageCheck,
  QrCode,
  RefreshCw,
  ScanLine,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  UtensilsCrossed,
  UsersRound,
  Wifi,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './ProductsPage.css';

const productTabs = [
  {
    id: 'guest',
    label: 'Guest ordering',
    eyebrow: 'Guest experience',
    title: 'A table journey with nothing to download.',
    description: 'Guests scan, browse the live menu, build their order, and follow its progress from their own phone.',
    bullets: ['Table-aware QR entry', 'Live menu, cart, and checkout', 'Clear order progress after payment'],
    path: '/demo',
    action: 'Try the guest demo',
    icon: Smartphone,
    accent: 'violet',
  },
  {
    id: 'menu',
    label: 'Menu & QR',
    eyebrow: 'Publishing tools',
    title: 'Change a dish once. Keep every table current.',
    description: 'Build categories, prices, descriptions, and availability in one workspace, then publish the same experience through your QR code.',
    bullets: ['Dish and category management', 'Availability controls', 'Shareable restaurant QR code'],
    path: '/menu',
    action: 'Open menu builder',
    icon: QrCode,
    accent: 'orange',
  },
  {
    id: 'kitchen',
    label: 'Orders & kitchen',
    eyebrow: 'Live service',
    title: 'Move every order through a visible queue.',
    description: 'New table orders arrive in one operational view, with the details and states your team needs to keep service moving.',
    bullets: ['Live incoming order queue', 'Table and item context', 'Preparing-to-ready workflow'],
    path: '/modern/admin/kitchen',
    action: 'Explore kitchen display',
    icon: ChefHat,
    accent: 'blue',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    eyebrow: 'Performance',
    title: 'Turn everyday service into useful signals.',
    description: 'See ordering activity, revenue patterns, and popular items in a focused dashboard built for quick daily decisions.',
    bullets: ['Revenue and order summaries', 'Popular-item visibility', 'Time-based performance views'],
    path: '/modern/admin/analytics',
    action: 'View analytics workspace',
    icon: BarChart3,
    accent: 'green',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    eyebrow: 'Stock control',
    title: 'Know what is ready, low, or at risk.',
    description: 'Track quantities, limits, cost, and expiry details without separating stock context from the rest of restaurant operations.',
    bullets: ['Stock level and threshold tracking', 'Low-stock status at a glance', 'Cost and expiry context'],
    path: '/modern/admin/inventory',
    action: 'See inventory control',
    icon: PackageCheck,
    accent: 'rose',
  },
];

const serviceFlow = [
  { label: 'Scan', detail: 'Open the table menu', icon: ScanLine },
  { label: 'Browse', detail: 'Choose live dishes', icon: UtensilsCrossed },
  { label: 'Order', detail: 'Send the basket', icon: ShoppingBag },
  { label: 'Prepare', detail: 'Work the queue', icon: ChefHat },
  { label: 'Pay', detail: 'Complete checkout', icon: CreditCard },
  { label: 'Improve', detail: 'Read the signals', icon: TrendingUp },
];

const suiteCards = [
  { title: 'Menu builder', copy: 'Organize dishes, pricing, categories, and availability.', path: '/menu', link: 'Build the menu', icon: UtensilsCrossed, tone: 'orange' },
  { title: 'QR & sharing', copy: 'Create the entry point guests use at the table.', path: '/qrcode', link: 'Create a QR', icon: QrCode, tone: 'violet' },
  { title: 'Live orders', copy: 'Review order details and keep service states moving.', path: '/orders', link: 'Open orders', icon: ClipboardCheck, tone: 'blue' },
  { title: 'Kitchen display', copy: 'Give the kitchen a focused, real-time preparation queue.', path: '/modern/admin/kitchen', link: 'View the KDS', icon: ChefHat, tone: 'cyan' },
  { title: 'Analytics', copy: 'Understand revenue, demand, and menu performance.', path: '/modern/admin/analytics', link: 'Read analytics', icon: BarChart3, tone: 'green' },
  { title: 'Inventory', copy: 'Monitor stock levels, thresholds, costs, and expiry.', path: '/modern/admin/inventory', link: 'Manage stock', icon: PackageCheck, tone: 'rose' },
];

const roleCards = [
  { role: 'For guests', title: 'Less waiting, more clarity', copy: 'A familiar mobile journey from QR scan to order status.', icon: UsersRound },
  { role: 'For service teams', title: 'One shared order picture', copy: 'Table and item details stay visible as each order moves.', icon: ClipboardCheck },
  { role: 'For the kitchen', title: 'A queue made for action', copy: 'Incoming, preparing, and ready states create a clear rhythm.', icon: ChefHat },
  { role: 'For operators', title: 'Control beyond the rush', copy: 'Menu, performance, inventory, and settings live together.', icon: Gauge },
];

const comparisonRows = [
  { moment: 'Price or item update', physical: 'Reprint pages or explain changes at every table.', qzaar: 'Update the digital menu once and publish the change.' },
  { moment: 'Sold-out dish', physical: 'Guests often find out after they have chosen.', qzaar: 'Pause availability so the live menu stays current.' },
  { moment: 'Placing an order', physical: 'Wait for a menu, then wait again for service staff.', qzaar: 'Scan, choose, and send the order from the guest’s phone.' },
  { moment: 'Kitchen handoff', physical: 'Rely on handwritten notes or repeated verbal context.', qzaar: 'Keep table, item, and status details in a shared queue.' },
  { moment: 'Learning what works', physical: 'Printed menus leave no useful ordering trail.', qzaar: 'Use order and menu activity to read daily performance.' },
];

const cityBenefits = [
  { title: 'Independent-first', copy: 'Useful for family restaurants, cafés, quick-service counters, and growing local brands.', icon: Store },
  { title: 'Simple for lean teams', copy: 'Focused screens help owners and staff operate without a complicated enterprise setup.', icon: UsersRound },
  { title: 'Familiar to guests', copy: 'QR access and a browser-based flow work with the phones customers already carry.', icon: Smartphone },
  { title: 'Ready for local checkout', copy: 'A payment journey designed around familiar options such as UPI and cards.', icon: IndianRupee },
];

function ProductPreview({ product }) {
  if (product.id === 'guest') {
    return (
      <div className="qz-products-preview qz-products-preview--guest">
        <div className="qz-products-phone">
          <div className="qz-products-phone__top"><span>9:41</span><Wifi size={13} /></div>
          <div className="qz-products-phone__restaurant"><span>Q</span><div><strong>Qzaar Kitchen</strong><small>Table 08</small></div></div>
          <div className="qz-products-phone__chips"><span>Popular</span><span>Bowls</span><span>Drinks</span></div>
          <div className="qz-products-menu-item"><span className="qz-products-food">🥗</span><div><strong>Garden harvest bowl</strong><small>Fresh, bright, and seasonal</small><b>₹320</b></div><button type="button" aria-label="Add garden harvest bowl">+</button></div>
          <div className="qz-products-phone__cart"><span><b>2 items</b><small>Table 08</small></span><strong>View order <ChevronRight size={15} /></strong></div>
        </div>
        <div className="qz-products-float qz-products-float--order"><Check size={16} /><span><b>Order sent</b><small>Kitchen received it</small></span></div>
      </div>
    );
  }

  if (product.id === 'menu') {
    return (
      <div className="qz-products-preview qz-products-preview--menu">
        <div className="qz-products-window__bar"><i /><i /><i /><span>Menu workspace</span></div>
        <div className="qz-products-menu-editor">
          <aside><span className="is-active">All dishes <b>18</b></span><span>Starters <b>5</b></span><span>Mains <b>8</b></span><span>Drinks <b>5</b></span></aside>
          <main><div className="qz-products-editor__heading"><div><small>MAIN COURSE</small><strong>Published dishes</strong></div><button type="button">+ Add dish</button></div>
            <div className="qz-products-editor-row"><span className="qz-products-food">🍛</span><div><b>House curry</b><small>Rich tomato gravy · ₹360</small></div><em>Live</em></div>
            <div className="qz-products-editor-row"><span className="qz-products-food">🍝</span><div><b>Garden pasta</b><small>Herbs and parmesan · ₹310</small></div><em>Live</em></div>
            <div className="qz-products-editor-row is-muted"><span className="qz-products-food">🥣</span><div><b>Soup of the day</b><small>Seasonal selection · ₹190</small></div><em>Paused</em></div>
          </main>
        </div>
      </div>
    );
  }

  if (product.id === 'kitchen') {
    return (
      <div className="qz-products-preview qz-products-preview--kitchen">
        <div className="qz-products-window__bar"><i /><i /><i /><span>Kitchen queue · 4 active</span></div>
        <div className="qz-products-kds">
          <article><header><b>Table 04</b><time>02:18</time></header><span>2 × Paneer tikka</span><span>1 × Lime soda</span><small>No onion</small><button type="button">Start preparing</button></article>
          <article className="is-preparing"><header><b>Table 11</b><time>06:42</time></header><span>1 × Masala pasta</span><span>2 × Garlic bread</span><small>Extra spicy</small><button type="button">Mark ready</button></article>
          <article className="is-ready"><header><b>Table 02</b><time>Ready</time></header><span>1 × Harvest bowl</span><span>1 × Cold coffee</span><small>Pickup now</small><button type="button">Complete</button></article>
        </div>
      </div>
    );
  }

  if (product.id === 'analytics') {
    return (
      <div className="qz-products-preview qz-products-preview--analytics">
        <div className="qz-products-window__bar"><i /><i /><i /><span>Performance overview</span></div>
        <div className="qz-products-analytics-head"><div><small>Revenue today</small><strong>₹24,860</strong></div><span><TrendingUp size={14} /> Live view</span></div>
        <div className="qz-products-bars" aria-label="Illustrative revenue chart">{[42, 58, 49, 74, 64, 88, 78].map((height, index) => <i key={height + index} style={{ height: `${height}%` }}><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></i>)}</div>
        <div className="qz-products-analytics-foot"><span><small>Orders</small><b>62</b></span><span><small>Top item</small><b>Paneer tikka</b></span><span><small>Peak window</small><b>8–9 PM</b></span></div>
      </div>
    );
  }

  return (
    <div className="qz-products-preview qz-products-preview--inventory">
      <div className="qz-products-window__bar"><i /><i /><i /><span>Inventory control</span></div>
      <div className="qz-products-stock-head"><div><small>Stock health</small><strong>Needs attention</strong></div><span>6 items tracked</span></div>
      {[
        ['Basmati rice', '25 / 60 kg', 42, 'healthy'],
        ['Olive oil', '3 / 15 L', 20, 'low'],
        ['Paneer', '8 / 30 kg', 27, 'low'],
        ['All-purpose flour', '42 / 80 kg', 53, 'healthy'],
      ].map(([name, value, width, state]) => (
        <div className="qz-products-stock-row" key={name}><div><b>{name}</b><small>{value}</small></div><span><i className={`is-${state}`} style={{ width: `${width}%` }} /></span><em className={`is-${state}`}>{state === 'low' ? 'Low' : 'In stock'}</em></div>
      ))}
    </div>
  );
}

const ProductsPage = () => {
  const [activeProduct, setActiveProduct] = useState(productTabs[0]);
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="qz-products-page">
      <Navbar />

      <main>
        <section className="qz-products-hero">
          <div className="qz-products-orb qz-products-orb--one" />
          <div className="qz-products-orb qz-products-orb--two" />
          <div className="qz-products-shell qz-products-hero__grid">
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.08 }} className="qz-products-hero__copy">
              <motion.span variants={reveal} className="qz-products-kicker"><Sparkles size={15} /> The connected restaurant suite</motion.span>
              <motion.h1 variants={reveal}>One platform for every moment <span>around an order.</span></motion.h1>
              <motion.p variants={reveal}>Bring the guest menu, live orders, kitchen flow, analytics, and stock control into one calm, connected workspace.</motion.p>
              <motion.div variants={reveal} className="qz-products-actions">
                <Link to="/demo" className="qz-products-button qz-products-button--primary">Explore live demo <ArrowRight size={18} /></Link>
                <Link to="/signup" className="qz-products-button qz-products-button--secondary">Create free account</Link>
              </motion.div>
              <motion.div variants={reveal} className="qz-products-hero__facts">
                <span><Check size={15} /> No guest app required</span>
                <span><Check size={15} /> Built for browser-based service</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="qz-products-command" aria-label="Illustration of the Qzaar restaurant command centre">
              <div className="qz-products-command__top"><span><i /><i /><i /></span><b>Service overview</b><em><span /> Live</em></div>
              <div className="qz-products-command__body">
                <aside><span className="is-active"><Gauge size={17} /></span><span><ShoppingBag size={17} /></span><span><ChefHat size={17} /></span><span><BarChart3 size={17} /></span><span><Settings2 size={17} /></span></aside>
                <div className="qz-products-command__main">
                  <div className="qz-products-command__welcome"><div><small>SATURDAY SERVICE</small><strong>Everything is moving.</strong></div><span><Clock3 size={15} /> Live now</span></div>
                  <div className="qz-products-command__metrics">
                    <article><span><ShoppingBag size={16} /></span><small>Open orders</small><b>12</b><em>4 preparing</em></article>
                    <article><span><TrendingUp size={16} /></span><small>Revenue today</small><b>₹24.8k</b><em>Live total</em></article>
                    <article><span><PackageCheck size={16} /></span><small>Stock alerts</small><b>03</b><em>Needs review</em></article>
                  </div>
                  <div className="qz-products-command__lower">
                    <article className="qz-products-live-orders"><header><b>Live orders</b><span>View queue <ChevronRight size={14} /></span></header><div><i className="is-orange">04</i><span><b>Table 04</b><small>3 items · Preparing</small></span><em>06:42</em></div><div><i className="is-blue">11</i><span><b>Table 11</b><small>2 items · New</small></span><em>01:18</em></div><div><i className="is-green"><Check size={13} /></i><span><b>Table 02</b><small>Ready for service</small></span><em>Now</em></div></article>
                    <article className="qz-products-pulse"><header><b>Service pulse</b><Zap size={15} /></header><div className="qz-products-pulse__ring"><span><b>86</b><small>flow score</small></span></div><p><i /> Kitchen queue is moving normally</p></article>
                  </div>
                </div>
              </div>
              <div className="qz-products-command__phone"><QrCode size={25} /><span><small>TABLE 08</small><b>Scan to order</b></span><i><ScanLine size={17} /></i></div>
            </motion.div>
          </div>
        </section>

        <section className="qz-products-flow" aria-label="Qzaar service flow">
          <div className="qz-products-shell">
            <div className="qz-products-flow__intro"><span>ONE CONNECTED FLOW</span><p>Every step passes context to the next.</p></div>
            <div className="qz-products-flow__steps">
              {serviceFlow.map((step, index) => { const Icon = step.icon; return <React.Fragment key={step.label}><div className="qz-products-flow__step"><span><Icon size={18} /></span><div><b>{step.label}</b><small>{step.detail}</small></div></div>{index < serviceFlow.length - 1 && <ChevronRight className="qz-products-flow__arrow" size={16} />}</React.Fragment>; })}
            </div>
          </div>
        </section>

        <section className="qz-products-section qz-products-section--suite">
          <div className="qz-products-shell">
            <div className="qz-products-heading"><span>EXPLORE THE PLATFORM</span><h2>Specialized tools. One shared restaurant.</h2><p>Choose a workspace to see how each part of Qzaar supports the same service journey.</p></div>
            <div className="qz-products-tabs" role="tablist" aria-label="Qzaar product areas">
              {productTabs.map((product) => { const Icon = product.icon; const selected = activeProduct.id === product.id; return <button key={product.id} type="button" role="tab" aria-selected={selected} className={selected ? 'is-active' : ''} onClick={() => setActiveProduct(product)}><Icon size={17} />{product.label}</button>; })}
            </div>
            <div className={`qz-products-detail qz-products-detail--${activeProduct.accent}`}>
              <AnimatePresence mode="wait">
                <motion.div key={activeProduct.id} className="qz-products-detail__copy" initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduceMotion ? 0 : 8 }} transition={{ duration: 0.25 }}>
                  <span>{activeProduct.eyebrow}</span><h3>{activeProduct.title}</h3><p>{activeProduct.description}</p>
                  <ul>{activeProduct.bullets.map((bullet) => <li key={bullet}><Check size={15} /> {bullet}</li>)}</ul>
                  <Link to={activeProduct.path}>{activeProduct.action} <ArrowRight size={17} /></Link>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div key={`${activeProduct.id}-preview`} className="qz-products-detail__preview" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><ProductPreview product={activeProduct} /></motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="qz-products-section qz-products-section--comparison">
          <div className="qz-products-shell">
            <div className="qz-products-heading qz-products-heading--center">
              <span>PHYSICAL MENU VS QZAAR</span>
              <h2>Move beyond a menu that stops at the table.</h2>
              <p>A printed menu can show what you sell. Qzaar connects that choice to ordering, preparation, payment, and the decisions that follow.</p>
            </div>

            <div className="qz-products-compare">
              <div className="qz-products-compare__head">
                <span>The service moment</span>
                <div><i><BookOpen size={18} /></i><p><b>Physical menu</b><small>Static and staff-dependent</small></p></div>
                <div className="is-qzaar"><i><ScanLine size={18} /></i><p><b>Qzaar platform</b><small>Live and connected</small></p></div>
              </div>
              <div className="qz-products-compare__body">
                {comparisonRows.map((row) => (
                  <article key={row.moment}>
                    <strong>{row.moment}</strong>
                    <p><small>Physical menu</small>{row.physical}</p>
                    <p className="is-qzaar"><small>Qzaar platform</small><Check size={16} />{row.qzaar}</p>
                  </article>
                ))}
              </div>
              <div className="qz-products-compare__note">
                <span><RefreshCw size={18} /></span>
                <p><b>Keep the familiar table experience.</b><small>Qzaar adds a digital path around it—you can still use printed menus whenever your restaurant needs them.</small></p>
                <Link to="/demo">See the digital journey <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="qz-products-section qz-products-section--cities">
          <div className="qz-products-city-orb qz-products-city-orb--one" />
          <div className="qz-products-city-orb qz-products-city-orb--two" />
          <div className="qz-products-shell qz-products-cities">
            <div className="qz-products-cities__copy">
              <span><MapPin size={15} /> FOCUS: TIER 2 & TIER 3 INDIA</span>
              <h2>Built for the restaurants powering India’s growing cities.</h2>
              <p>Qzaar is being built with Tier 2 and Tier 3 operators in mind—not only large metro chains. Independent restaurants get practical digital tools that fit familiar service habits, lean teams, and mobile-first guests.</p>
              <div className="qz-products-cities__chips"><span>Independent restaurants</span><span>Family dining</span><span>Local cafés</span><span>Quick service</span></div>
              <Link to="/signup" className="qz-products-button qz-products-button--city">Build your restaurant workspace <ArrowRight size={18} /></Link>
            </div>

            <div className="qz-products-cities__panel">
              <div className="qz-products-cities__panel-head"><span><Building2 size={19} /></span><p><small>DESIGNED FOR GROWING CITIES</small><b>Local service. Modern control.</b></p><em><i /> India-focused</em></div>
              <div className="qz-products-cities__benefits">
                {cityBenefits.map((benefit) => { const Icon = benefit.icon; return <article key={benefit.title}><span><Icon size={19} /></span><div><b>{benefit.title}</b><p>{benefit.copy}</p></div></article>; })}
              </div>
              <div className="qz-products-cities__signal"><span><QrCode size={20} /></span><p><b>Start with one scan</b><small>No guest app download is required.</small></p><i><span /><span /><span /></i></div>
            </div>
          </div>
        </section>

        <section className="qz-products-section qz-products-section--workspace">
          <div className="qz-products-shell">
            <div className="qz-products-heading qz-products-heading--split"><div><span>THE OPERATING WORKSPACE</span><h2>Everything your team needs to keep moving.</h2></div><p>Each area has a clear job, while navigation keeps the full restaurant workflow close at hand.</p></div>
            <div className="qz-products-card-grid">
              {suiteCards.map((card) => { const Icon = card.icon; return <Link to={card.path} className={`qz-products-card qz-products-card--${card.tone}`} key={card.title}><span className="qz-products-card__icon"><Icon size={22} /></span><h3>{card.title}</h3><p>{card.copy}</p><b>{card.link} <ArrowRight size={15} /></b></Link>; })}
            </div>
          </div>
        </section>

        <section className="qz-products-section qz-products-section--roles">
          <div className="qz-products-shell qz-products-roles">
            <div className="qz-products-roles__intro"><span>BUILT AROUND PEOPLE</span><h2>A better handoff for every person in service.</h2><p>Qzaar keeps each view focused, while preserving the information the next person needs.</p><Link to="/how-it-works">See the complete journey <ArrowRight size={17} /></Link></div>
            <div className="qz-products-role-grid">
              {roleCards.map((card) => { const Icon = card.icon; return <article key={card.role}><span><Icon size={20} /></span><small>{card.role}</small><h3>{card.title}</h3><p>{card.copy}</p></article>; })}
            </div>
          </div>
        </section>

        <section className="qz-products-trust">
          <div className="qz-products-shell qz-products-trust__grid">
            <div><span><ShieldCheck size={19} /></span><p><b>Workspace access</b><small>Restaurant tools stay behind authenticated accounts.</small></p></div>
            <div><span><Wifi size={19} /></span><p><b>Live service states</b><small>Order progress stays visible across the active workflow.</small></p></div>
            <div><span><Layers3 size={19} /></span><p><b>One connected system</b><small>Guest and operator experiences share the same foundation.</small></p></div>
          </div>
        </section>

        <section className="qz-products-cta">
          <div className="qz-products-cta__orb" />
          <div className="qz-products-shell qz-products-cta__inner">
            <span><Store size={17} /> Your restaurant, connected</span>
            <h2>See the whole Qzaar journey in action.</h2>
            <p>Explore the guest menu, kitchen display, and analytics experience before creating your workspace.</p>
            <div className="qz-products-actions"><Link to="/demo" className="qz-products-button qz-products-button--light">Open live demo <ArrowRight size={18} /></Link><Link to="/signup" className="qz-products-button qz-products-button--outline">Create an account</Link></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
