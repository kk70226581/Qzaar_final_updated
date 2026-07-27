import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  ClipboardList,
  ExternalLink,
  Home,
  Package,
  QrCode,
  Settings,
  Store,
  UtensilsCrossed
} from 'lucide-react';
import './DashboardHub.css';
import { clearSession, hasActiveSession, isSessionExpired } from '../utils/authSession';

const ownerLinks = [
  { label: 'Menu', path: '/menu', icon: UtensilsCrossed, tone: 'orange' },
  { label: 'Orders', path: '/orders', icon: ClipboardList, tone: 'blue' },
  { label: 'QR', path: '/qrcode', icon: QrCode, tone: 'violet' },
  { label: 'Analytics', path: '/modern/admin/analytics', icon: BarChart3, tone: 'green' },
  { label: 'Inventory', path: '/modern/admin/inventory', icon: Package, tone: 'rose' },
  { label: 'Settings', path: '/modern/admin/settings', icon: Settings, tone: 'slate' }
];

const customerLinks = [
  { label: 'Live menu', path: '/modern/menu', icon: UtensilsCrossed, tone: 'orange' },
  { label: 'Cart', path: '/modern/cart', icon: Package, tone: 'blue' },
  { label: 'Landing', path: '/modern/landing', icon: Store, tone: 'violet' }
];

function LaunchTile({ item, index }) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      className={`workspace-tile workspace-tile--${item.tone}`}
      onClick={() => navigate(item.path)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="workspace-tile__icon"><Icon size={20} /></span>
      <span>{item.label}</span>
      <ArrowRight size={16} className="workspace-tile__arrow" />
    </motion.button>
  );
}

function WorkspaceGroup({ title, icon: Icon, links, startIndex }) {
  return (
    <section className="workspace-group">
      <div className="workspace-group__heading">
        <span><Icon size={17} /></span>
        <h2>{title}</h2>
      </div>
      <div className="workspace-group__grid">
        {links.map((item, index) => <LaunchTile key={item.path} item={item} index={startIndex + index} />)}
      </div>
    </section>
  );
}

function DashboardHub() {
  const navigate = useNavigate();
  const shopId = hasActiveSession() ? localStorage.getItem('shopId') : null;
  const qrId = localStorage.getItem('qr_id');

  React.useEffect(() => {
    if (!shopId) {
      if (isSessionExpired()) clearSession();
      navigate('/login', { replace: true });
    }
  }, [navigate, shopId]);

  const primaryPath = qrId ? '/orders' : '/menu';

  return (
    <main className="dashboard-hub">
      <header className="workspace-topbar">
        <button type="button" className="workspace-brand" onClick={() => navigate('/')} aria-label="Go home">
          <span><QrCode size={19} /></span>
          <strong>Qzaar</strong>
        </button>
        <button type="button" className="workspace-icon-button" onClick={() => navigate('/')} aria-label="Back to home" title="Back to home"><Home size={18} /></button>
      </header>

      <section className="workspace-hero">
        <div className="workspace-hero__copy">
          <span className="workspace-eyebrow">Restaurant workspace</span>
          <h1>{qrId ? 'Service is ready.' : 'Let’s open your menu.'}</h1>
          <button type="button" className="workspace-primary-action" onClick={() => navigate(primaryPath)}>
            <span>{qrId ? 'Open orders' : 'Build menu'}</span><ArrowRight size={18} />
          </button>
        </div>
        <div className="workspace-hero__visual" aria-hidden="true">
          <img src="/images/landing/slide-5.png" alt="" />
          <span className={qrId ? 'is-live' : ''}>{qrId ? 'Live' : 'Draft'}</span>
        </div>
      </section>

      <div className="workspace-sections">
        <WorkspaceGroup title="Manage" icon={ChefHat} links={ownerLinks} startIndex={0} />
        <WorkspaceGroup title="Customer view" icon={ExternalLink} links={customerLinks} startIndex={ownerLinks.length} />
      </div>
    </main>
  );
}

export default DashboardHub;
