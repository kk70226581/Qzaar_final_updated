import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, ChefHat, ClipboardList, Clock3,
  ExternalLink, Home, Package, QrCode, ScanLine, Settings, Store,
  TrendingUp, UtensilsCrossed, UsersRound
} from 'lucide-react';
import './DashboardHub.css';
import { clearSession, hasActiveSession, isSessionExpired } from '../utils/authSession';

const ownerLinks = [
  { label: 'Menu builder', description: 'Dishes, pricing, and availability', path: '/menu', icon: UtensilsCrossed, tone: 'orange' },
  { label: 'Live orders', description: 'Accept and manage service', path: '/orders', icon: ClipboardList, tone: 'blue' },
  { label: 'QR & sharing', description: 'Publish your table experience', path: '/qrcode', icon: QrCode, tone: 'violet' },
  { label: 'Analytics', description: 'See what performs each day', path: '/modern/admin/analytics', icon: BarChart3, tone: 'green' },
  { label: 'Inventory', description: 'Stay ahead of stock', path: '/modern/admin/inventory', icon: Package, tone: 'rose' },
  { label: 'Workspace settings', description: 'Brand, hours, and preferences', path: '/modern/admin/settings', icon: Settings, tone: 'slate' }
];

const customerLinks = [
  { label: 'Preview live menu', description: 'See what guests will scan', path: '/modern/menu', icon: UtensilsCrossed, tone: 'orange' },
  { label: 'Preview cart', description: 'Review the guest checkout flow', path: '/modern/cart', icon: Package, tone: 'blue' },
  { label: 'Explore landing page', description: 'View your public experience', path: '/modern/landing', icon: Store, tone: 'violet' }
];

function LaunchTile({ item, index }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;
  return <motion.button type="button" className={`workspace-tile workspace-tile--${item.tone}`} onClick={() => navigate(item.path)} initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * .045, duration: .28 }} whileHover={reduceMotion ? {} : { y: -4 }} whileTap={reduceMotion ? {} : { scale: .985 }}><span className="workspace-tile__icon"><Icon size={20} /></span><span className="workspace-tile__content"><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRight size={17} className="workspace-tile__arrow" /></motion.button>;
}

function WorkspaceGroup({ title, description, icon: Icon, links, startIndex, action }) {
  return <section className="workspace-group"><div className="workspace-group__heading"><span><Icon size={18} /></span><div><h2>{title}</h2><p>{description}</p></div>{action}</div><div className="workspace-group__grid">{links.map((item, index) => <LaunchTile key={item.path} item={item} index={startIndex + index} />)}</div></section>;
}

function DashboardHub() {
  const navigate = useNavigate();
  const shopId = hasActiveSession() ? localStorage.getItem('shopId') : null;
  const qrId = localStorage.getItem('qr_id');
  const isLive = Boolean(qrId);
  React.useEffect(() => { if (!shopId) { if (isSessionExpired()) clearSession(); navigate('/login', { replace: true }); } }, [navigate, shopId]);
  const primaryPath = isLive ? '/orders' : '/menu';

  return <main className="dashboard-hub"><header className="workspace-topbar"><button type="button" className="workspace-brand" onClick={() => navigate('/')} aria-label="Go to Qzaar home"><span><QrCode size={19} /></span><span><strong>Qzaar</strong><small>Restaurant workspace</small></span></button><div className="workspace-topbar__actions"><span className={`workspace-status ${isLive ? 'is-live' : ''}`}><i /> {isLive ? 'Service live' : 'Setup in progress'}</span><button type="button" className="workspace-home-link" onClick={() => navigate('/')}><Home size={16} /> Public site</button></div></header>

    <section className="workspace-hero"><div className="workspace-hero__copy"><span className="workspace-eyebrow"><Activity size={15} /> Restaurant control centre</span><h1>{isLive ? 'Your restaurant is ready for service.' : 'Turn your menu into a guest experience.'}</h1><p>{isLive ? 'Keep an eye on orders, update the menu, and make every service run smoothly from one place.' : 'Start with your dishes and brand, then publish one QR code your guests will love to use.'}</p><button type="button" className="workspace-primary-action" onClick={() => navigate(primaryPath)}><span>{isLive ? 'Open live orders' : 'Build your menu'}</span><ArrowRight size={18} /></button></div><div className="workspace-hero__visual"><img src="/images/landing/slide-5.png" alt="Qzaar restaurant ordering preview" /><div className="workspace-hero__visual-shade" /><div className="workspace-hero__visual-card"><span><ScanLine size={18} /></span><div><strong>{isLive ? 'Guest ordering is open' : 'Your QR experience starts here'}</strong><small>{isLive ? 'Ready for your next table' : 'Add your menu to go live'}</small></div></div></div></section>

    <section className="workspace-metrics" aria-label="Workspace overview"><article><span className="workspace-metric__icon workspace-metric__icon--violet"><QrCode size={18} /></span><div><strong>{isLive ? 'Published' : 'Draft'}</strong><small>Menu status</small></div><span className="workspace-metric__detail">{isLive ? 'Live now' : 'Needs menu'}</span></article><article><span className="workspace-metric__icon workspace-metric__icon--blue"><ClipboardList size={18} /></span><div><strong>{isLive ? 'Live queue' : 'No orders yet'}</strong><small>Order desk</small></div><span className="workspace-metric__detail">Open orders</span></article><article><span className="workspace-metric__icon workspace-metric__icon--orange"><Clock3 size={18} /></span><div><strong>{isLive ? 'Service mode' : 'Next: menu'}</strong><small>What to do next</small></div><button type="button" onClick={() => navigate(primaryPath)}>{isLive ? 'View orders' : 'Start now'} <ArrowRight size={14} /></button></article></section>

    <div className="workspace-sections"><WorkspaceGroup title="Run your restaurant" description="Everything your team needs for a smooth shift." icon={ChefHat} links={ownerLinks} startIndex={0} /><WorkspaceGroup title="Guest experience" description="Preview every customer-facing moment before you share it." icon={UsersRound} links={customerLinks} startIndex={ownerLinks.length} action={<span className="workspace-group__badge"><ExternalLink size={14} /> Customer view</span>} /></div>
    <section className="workspace-footer-callout"><div><span><TrendingUp size={17} /> Built to grow with every service</span><strong>Keep your menu fresh, your orders moving, and your guests informed.</strong></div><button type="button" onClick={() => navigate('/modern/admin/analytics')}>View performance <ArrowRight size={17} /></button></section>
  </main>;
}

export default DashboardHub;
