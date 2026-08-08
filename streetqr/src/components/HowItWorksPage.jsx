import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock3,
  CreditCard,
  Gauge,
  LayoutDashboard,
  PackageCheck,
  QrCode,
  ScanLine,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './HowItWorksPage.css';

const flowSteps = [
  { icon: ScanLine, title: 'Scan', description: 'A table-specific QR opens the menu instantly.', time: '2 sec' },
  { icon: Smartphone, title: 'Browse', description: 'Guests explore categories, photos, and prices.', time: 'Self-serve' },
  { icon: ShoppingBag, title: 'Order', description: 'Items and notes are confirmed from the table.', time: 'No waiting' },
  { icon: ChefHat, title: 'Prepare', description: 'The order appears in the kitchen workflow.', time: 'Real time' },
  { icon: CreditCard, title: 'Pay', description: 'Guests complete checkout with secure options.', time: 'In a few taps' },
  { icon: BarChart3, title: 'Improve', description: 'Every order updates operational insights.', time: 'Always on' },
];

const journeys = {
  guest: {
    eyebrow: 'Guest experience',
    title: 'A faster table journey with nothing to download.',
    description: 'Every interaction stays in one mobile-friendly flow, so guests can order confidently without waiting for a menu or the bill.',
    cards: [
      { icon: ScanLine, title: 'Open the right table', copy: 'The QR identifies the restaurant and table automatically. No app, account, or manual table number is required.', tag: 'Instant access' },
      { icon: UtensilsCrossed, title: 'Choose with confidence', copy: 'Clear categories, images, descriptions, prices, and availability help guests decide before adding items to the cart.', tag: 'Live menu' },
      { icon: CreditCard, title: 'Checkout and follow along', copy: 'The guest confirms the order, pays through the available checkout methods, and can track its progress.', tag: 'Secure checkout' },
    ],
  },
  restaurant: {
    eyebrow: 'Restaurant operations',
    title: 'One connected workspace from menu setup to service insights.',
    description: 'The front of house, kitchen, and owner share the same live order state, reducing handoffs and keeping service decisions visible.',
    cards: [
      { icon: Settings2, title: 'Publish the menu once', copy: 'Manage categories, pricing, availability, table QR codes, hours, and restaurant details from the workspace.', tag: 'Central control' },
      { icon: ChefHat, title: 'Route every order clearly', copy: 'New orders enter the order queue and kitchen display with table, item, quantity, and preparation status.', tag: 'Kitchen ready' },
      { icon: Gauge, title: 'Run the next service better', copy: 'Analytics and inventory views reveal popular dishes, service activity, low stock, and upcoming expiry risks.', tag: 'Actionable data' },
    ],
  },
};

const setupChecklist = [
  'Add restaurant details and service hours',
  'Create menu categories and items',
  'Generate a unique QR code for each table',
  'Open the order and kitchen workspaces',
];

const faqs = [
  {
    question: 'Do guests need to install an app or create an account?',
    answer: 'No. Guests scan the table QR with their phone camera and Qzaar opens in the browser. The restaurant and table context are carried into the ordering flow automatically.',
  },
  {
    question: 'Can we change prices or mark an item unavailable during service?',
    answer: 'Yes. Menu changes are managed from the restaurant workspace. Updated prices and availability are reflected for guests so the digital menu stays current.',
  },
  {
    question: 'Where does a new order appear?',
    answer: 'Orders appear in the restaurant order workspace and can move through the kitchen display stages. The team can see the table, ordered items, notes, and current preparation state.',
  },
  {
    question: 'Which payment methods are supported?',
    answer: 'The checkout uses Razorpay and can present the payment methods enabled for the restaurant, including options such as UPI, cards, and netbanking.',
  },
  {
    question: 'Can Qzaar help after the order is completed?',
    answer: 'Yes. Completed activity feeds the analytics workspace, while inventory tools help the team monitor stock levels, reorder points, value, and expiry risk.',
  },
];

const FAQItem = ({ index, question, answer }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const answerId = `hiw-faq-answer-${index}`;

  return (
    <article className={`hiw-faq-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="hiw-faq-question"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span><small>{String(index + 1).padStart(2, '0')}</small>{question}</span>
        <ChevronDown className="hiw-faq-icon" size={19} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="hiw-faq-answer-wrapper"
          >
            <p className="hiw-faq-answer">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default function HowItWorksPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeJourney, setActiveJourney] = useState('guest');
  const journey = journeys[activeJourney];

  const reveal = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-70px' } };

  return (
    <div className="hiw-page">
      <Navbar />

      <main className="hiw-main">
        <section className="hiw-hero">
          <div className="hiw-hero__glow hiw-hero__glow--blue" />
          <div className="hiw-hero__glow hiw-hero__glow--orange" />
          <div className="hiw-shell hiw-hero__layout">
            <motion.div
              className="hiw-hero__copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="hiw-kicker"><Sparkles size={14} /> One connected restaurant journey</span>
              <h1>From table scan to kitchen service, <em>everything stays in flow.</em></h1>
              <p>Qzaar connects the guest menu, ordering, checkout, kitchen queue, analytics, and inventory in one focused restaurant workspace.</p>
              <div className="hiw-hero__actions">
                <Link to="/demo" className="hiw-button hiw-button--primary">Try the live demo <ArrowRight size={17} /></Link>
                <a href="#journey" className="hiw-button hiw-button--secondary">See every step</a>
              </div>
              <div className="hiw-hero__proof" aria-label="Product highlights">
                <span><CheckCircle2 size={15} /> No guest app</span>
                <span><CheckCircle2 size={15} /> Table-aware QR</span>
                <span><CheckCircle2 size={15} /> Live order states</span>
              </div>
            </motion.div>

            <motion.div
              className="hiw-hero__product"
              initial={{ opacity: 0, scale: 0.96, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              aria-label="Qzaar product flow preview"
            >
              <div className="hiw-console">
                <div className="hiw-console__bar">
                  <span className="hiw-console__dots"><i /><i /><i /></span>
                  <strong>Qzaar service workspace</strong>
                  <span className="hiw-live-pill"><i /> Live</span>
                </div>
                <div className="hiw-console__body">
                  <div className="hiw-phone">
                    <div className="hiw-phone__top"><ScanLine size={15} /><span>Table 08</span><Wifi size={13} /></div>
                    <div className="hiw-phone__restaurant"><small>Good evening</small><strong>Saffron Table</strong></div>
                    <div className="hiw-food-card">
                      <span className="hiw-food-card__art">🍛</span>
                      <div><strong>Paneer Tikka Bowl</strong><small>House special · Rs 349</small></div>
                      <button type="button" aria-label="Add Paneer Tikka Bowl">+</button>
                    </div>
                    <div className="hiw-phone__order"><span>2 items</span><strong>View order · Rs 638</strong></div>
                  </div>

                  <div className="hiw-ops-preview">
                    <div className="hiw-ops-preview__header"><div><small>Live service</small><strong>Order queue</strong></div><span>12 active</span></div>
                    <div className="hiw-order-card hiw-order-card--new">
                      <div><span>#QZ-108</span><small>just now</small></div>
                      <strong>Table 08</strong>
                      <p>2 × Paneer bowl<br />1 × Lime soda</p>
                      <em>New order</em>
                    </div>
                    <div className="hiw-order-card hiw-order-card--prep">
                      <div><span>#QZ-105</span><small>6 min</small></div>
                      <strong>Table 03</strong>
                      <p>3 items · Kitchen</p>
                      <em>Preparing</em>
                    </div>
                    <div className="hiw-service-meter">
                      <span><Activity size={14} /> Service pulse</span>
                      <strong>4m 12s <small>avg. prep</small></strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hiw-floating-card hiw-floating-card--payment"><ShieldCheck size={17} /><span><small>Payment verified</small><strong>Table 12 · Rs 1,240</strong></span><Check size={15} /></div>
              <div className="hiw-floating-card hiw-floating-card--stock"><PackageCheck size={17} /><span><small>Stock alert</small><strong>Paneer · 8 kg left</strong></span></div>
            </motion.div>
          </div>
        </section>

        <section className="hiw-trust-strip" aria-label="Qzaar capabilities">
          <div className="hiw-shell hiw-trust-strip__inner">
            <span>One scan</span><i />
            <span>One live menu</span><i />
            <span>One kitchen queue</span><i />
            <span>One operations view</span>
          </div>
        </section>

        <section className="hiw-flow-section" id="journey">
          <div className="hiw-shell">
            <motion.div className="hiw-section-heading" {...reveal}>
              <span className="hiw-kicker"><Clock3 size={14} /> The complete order lifecycle</span>
              <h2>Six clear moments. One continuous experience.</h2>
              <p>Each action gives the next person exactly the context they need, without repeated entry or disconnected tools.</p>
            </motion.div>

            <div className="hiw-flow">
              <div className="hiw-flow__line" />
              {flowSteps.map(({ icon: Icon, title, description, time }, index) => (
                <motion.article className="hiw-flow__step" key={title} {...reveal} transition={{ delay: index * 0.06 }}>
                  <div className="hiw-flow__number">{String(index + 1).padStart(2, '0')}</div>
                  <span className="hiw-flow__icon"><Icon size={21} /></span>
                  <small>{time}</small>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="hiw-journey-section">
          <div className="hiw-shell">
            <div className="hiw-journey__top">
              <motion.div className="hiw-section-heading hiw-section-heading--left" {...reveal}>
                <span className="hiw-kicker"><LayoutDashboard size={14} /> Two sides of the same order</span>
                <h2>See exactly what changes for everyone.</h2>
              </motion.div>
              <div className="hiw-role-switch" role="group" aria-label="Choose journey">
                <button type="button" className={activeJourney === 'guest' ? 'is-active' : ''} onClick={() => setActiveJourney('guest')}><Smartphone size={16} /> Guest</button>
                <button type="button" className={activeJourney === 'restaurant' ? 'is-active' : ''} onClick={() => setActiveJourney('restaurant')}><ChefHat size={16} /> Restaurant team</button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="hiw-role-panel"
                key={activeJourney}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
              >
                <div className="hiw-role-panel__intro">
                  <span>{journey.eyebrow}</span>
                  <h3>{journey.title}</h3>
                  <p>{journey.description}</p>
                </div>
                <div className="hiw-role-panel__cards">
                  {journey.cards.map(({ icon: Icon, title, copy, tag }, index) => (
                    <article key={title}>
                      <div className="hiw-role-panel__card-head"><span><Icon size={19} /></span><small>{String(index + 1).padStart(2, '0')}</small></div>
                      <h4>{title}</h4>
                      <p>{copy}</p>
                      <em><CheckCircle2 size={13} /> {tag}</em>
                    </article>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="hiw-deep-dive">
          <div className="hiw-shell">
            <motion.div className="hiw-section-heading" {...reveal}>
              <span className="hiw-kicker"><Sparkles size={14} /> From setup to repeat service</span>
              <h2>Built around how a restaurant actually works.</h2>
              <p>Start with the essentials, operate live service, then use the same data to plan what comes next.</p>
            </motion.div>

            <div className="hiw-bento">
              <motion.article className="hiw-bento__card hiw-bento__card--setup" {...reveal}>
                <div className="hiw-bento__copy"><span className="hiw-bento__icon"><Settings2 size={20} /></span><small>01 · Setup</small><h3>Go from restaurant profile to table-ready QR.</h3><p>Build the operating foundation once, then keep it current from one place.</p></div>
                <div className="hiw-checklist">
                  {setupChecklist.map((item, index) => <div key={item}><span className={index < 3 ? 'is-done' : ''}>{index < 3 ? <Check size={13} /> : index + 1}</span><p>{item}</p>{index < 3 && <small>Complete</small>}</div>)}
                </div>
              </motion.article>

              <motion.article className="hiw-bento__card hiw-bento__card--kitchen" {...reveal}>
                <div className="hiw-bento__copy"><span className="hiw-bento__icon"><ChefHat size={20} /></span><small>02 · Live service</small><h3>Keep the kitchen queue visible.</h3><p>Cards move from new to preparing to ready, with table context attached.</p></div>
                <div className="hiw-kitchen-board">
                  <div><span>New <b>3</b></span><article><small>Table 08 · 0:42</small><strong>Paneer bowl × 2</strong><em>Start prep</em></article></div>
                  <div><span>Preparing <b>2</b></span><article><small>Table 03 · 5:18</small><strong>Masala pasta × 1</strong><em>Mark ready</em></article></div>
                </div>
              </motion.article>

              <motion.article className="hiw-bento__card hiw-bento__card--insights" {...reveal}>
                <div className="hiw-bento__copy"><span className="hiw-bento__icon"><TrendingUp size={20} /></span><small>03 · Improve</small><h3>Turn today’s service into tomorrow’s decisions.</h3><p>See performance and stock signals together instead of rebuilding the story manually.</p></div>
                <div className="hiw-insight-chart">
                  <div className="hiw-insight-chart__top"><span>Order activity</span><strong>+18.4% <small>this week</small></strong></div>
                  <div className="hiw-insight-chart__bars">{[42, 58, 49, 72, 66, 91, 78].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
                  <div className="hiw-insight-chart__labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
                </div>
              </motion.article>

              <motion.article className="hiw-bento__card hiw-bento__card--control" {...reveal}>
                <span className="hiw-bento__icon"><PackageCheck size={20} /></span>
                <small>04 · Stay in control</small>
                <h3>Know what needs attention before service begins.</h3>
                <div className="hiw-control-list"><span><i className="is-critical" /> Garlic<strong>Critical · 1 kg</strong></span><span><i className="is-low" /> Paneer<strong>Low · 8 kg</strong></span><span><i className="is-healthy" /> Basmati rice<strong>Healthy · 25 kg</strong></span></div>
              </motion.article>
            </div>
          </div>
        </section>

        <section className="hiw-outcomes">
          <div className="hiw-shell hiw-outcomes__layout">
            <motion.div className="hiw-outcomes__copy" {...reveal}>
              <span className="hiw-kicker"><Gauge size={14} /> A calmer operating rhythm</span>
              <h2>Less chasing. More visible service.</h2>
              <p>Qzaar gives each part of the restaurant a shared source of truth from the moment a guest sits down.</p>
            </motion.div>
            <div className="hiw-outcomes__grid">
              <article><ScanLine size={20} /><strong>Fewer menu handoffs</strong><p>Guests begin on their own phone while staff stays focused on hospitality.</p></article>
              <article><Clock3 size={20} /><strong>Clearer order timing</strong><p>Live states make waiting orders and kitchen progress easier to spot.</p></article>
              <article><ShieldCheck size={20} /><strong>Verified checkout flow</strong><p>Payment status remains connected to the order instead of a separate conversation.</p></article>
              <article><BarChart3 size={20} /><strong>Useful service history</strong><p>Orders become practical analytics and inventory signals for the team.</p></article>
            </div>
          </div>
        </section>

        <section className="hiw-faq-section">
          <div className="hiw-shell hiw-faq-layout">
            <motion.div className="hiw-section-heading hiw-section-heading--left" {...reveal}>
              <span className="hiw-kicker"><CheckCircle2 size={14} /> Common questions</span>
              <h2>Everything you need to understand the flow.</h2>
              <p>Still deciding? Open the live demo to experience the guest side without changing your current restaurant setup.</p>
              <Link to="/contact">Talk to Qzaar <ArrowRight size={15} /></Link>
            </motion.div>
            <div className="hiw-faq-container">
              {faqs.map((item, index) => <FAQItem key={item.question} index={index} {...item} />)}
            </div>
          </div>
        </section>

        <section className="hiw-cta-wrap">
          <motion.div className="hiw-shell hiw-cta" {...reveal}>
            <div className="hiw-cta__glow" />
            <span className="hiw-kicker"><QrCode size={14} /> Your first table can be ready today</span>
            <h2>See the full restaurant journey in action.</h2>
            <p>Explore Qzaar as a guest, then open the workspace to see how orders, kitchen status, analytics, and inventory connect.</p>
            <div className="hiw-cta__actions">
              <Link to="/demo" className="hiw-button hiw-button--light">Open live demo <ArrowRight size={17} /></Link>
              <Link to="/signup" className="hiw-button hiw-button--glass">Create free account</Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
