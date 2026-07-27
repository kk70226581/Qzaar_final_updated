import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, BellRing, CheckCircle2, ChefHat, Clock3, Globe2, QrCode, ScanLine, ShieldCheck, Sparkles, Store, UsersRound } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const audience = [
  { icon: Store, title: 'Independent restaurants', text: 'A polished digital front door without a stack of complicated tools.' },
  { icon: ChefHat, title: 'Busy service teams', text: 'A shared live view that helps the kitchen and floor move together.' },
  { icon: UsersRound, title: 'Guests at every table', text: 'A simple, welcoming way to browse, order, and stay informed.' }
];

const principles = [
  { icon: ScanLine, title: 'Make the first interaction effortless', text: 'One scan should lead to a clear, beautiful menu — never a confusing detour.' },
  { icon: BellRing, title: 'Keep everyone in the loop', text: 'Every order has a visible place, so no one has to chase information during a rush.' },
  { icon: BarChart3, title: 'Turn everyday activity into clarity', text: 'Useful insight should help owners make better calls, not create more work.' }
];

const rise = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

function AboutPage() {
  const reduceMotion = useReducedMotion();
  return <div className="about-page"><Navbar /><main>
    <section className="about-hero"><div className="about-container about-hero__grid"><motion.div initial="hidden" animate="visible" variants={rise} transition={{ duration: reduceMotion ? 0 : .55 }}><span className="about-kicker"><Sparkles size={15} /> The Qzaar story</span><h1>We believe restaurant technology should make service feel more human.</h1><p>Qzaar was created around a simple idea: the right tools should remove friction for teams and make every guest feel looked after.</p><div className="about-hero__actions"><Link to="/login" className="about-button about-button--primary">Create your workspace <ArrowRight size={18} /></Link><Link to="/modern/menu" className="about-button about-button--secondary">See the guest experience</Link></div></motion.div><motion.div className="about-hero__visual" initial="hidden" animate="visible" variants={rise} transition={{ duration: reduceMotion ? 0 : .62, delay: reduceMotion ? 0 : .12 }}><img src="/images/landing/slide-5.png" alt="Restaurant QR ordering in use" /><div className="about-hero__visual-card"><span><QrCode size={18} /></span><div><strong>One scan, a better start</strong><small>A clear path from menu to order</small></div></div></motion.div></div></section>

    <section className="about-belief"><div className="about-container about-belief__grid"><div><span className="about-section-kicker">Built with purpose</span><h2>Every shift is full of small moments that matter.</h2></div><div className="about-belief__copy"><p>A guest deciding what to order. A server checking what is ready. A chef balancing the next ticket. An owner asking how the day is going. Qzaar brings those moments into one calmer, more connected flow.</p><p>We focus on the details that make digital ordering feel natural: useful information, considered visual design, and tools that stay out of the way when service gets busy.</p></div></div></section>

    <section className="about-principles"><div className="about-container"><div className="about-heading"><span className="about-section-kicker">What guides the platform</span><h2>Designed around real restaurant work.</h2><p>From the first menu scan to the final service update, Qzaar is built to make the next best action obvious.</p></div><div className="about-principles__grid">{principles.map((item, index) => { const Icon = item.icon; return <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={rise} transition={{ duration: .42, delay: reduceMotion ? 0 : index * .08 }}><span><Icon size={23} /></span><h3>{item.title}</h3><p>{item.text}</p></motion.article>; })}</div></div></section>

    <section className="about-people"><div className="about-container"><div className="about-heading about-heading--center"><span className="about-section-kicker">Made for the whole room</span><h2>One experience, shaped for every person in service.</h2></div><div className="about-people__grid">{audience.map((item, index) => { const Icon = item.icon; return <motion.article key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={rise} transition={{ duration: .42, delay: reduceMotion ? 0 : index * .07 }}><span className="about-people__icon"><Icon size={26} /></span><h3>{item.title}</h3><p>{item.text}</p><span className="about-people__index">0{index + 1}</span></motion.article>; })}</div></div></section>

    <section className="about-commitment"><div className="about-container about-commitment__grid"><div className="about-commitment__stat"><span><Clock3 size={21} /></span><strong>Less time managing the process.</strong><p>More time serving people well.</p></div><div><span className="about-section-kicker">Our commitment</span><h2>Practical technology, elevated by care.</h2><p>We are building Qzaar for restaurants that want a more modern way to run service without losing the warmth, personality, and craft that make their place special.</p><div className="about-commitment__list"><span><CheckCircle2 size={18} /> Clear experiences for guests and teams</span><span><ShieldCheck size={18} /> Security designed into the essentials</span><span><Globe2 size={18} /> Browser-based access, wherever service happens</span></div></div></div></section>

    <section className="about-cta"><div className="about-container"><div><span className="about-section-kicker">Let’s make service smoother</span><h2>Build the experience your restaurant deserves.</h2></div><Link to="/login" className="about-button about-button--primary">Start with Qzaar <ArrowRight size={18} /></Link></div></section>
  </main><Footer /></div>;
}

export default AboutPage;
