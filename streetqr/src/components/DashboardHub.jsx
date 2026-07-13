import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  Home,
  ListChecks,
  Menu,
  Package,
  QrCode,
  Settings,
  Store,
  TrendingUp,
  UtensilsCrossed,
  ShieldCheck,
  Zap
} from 'lucide-react';
import './DashboardHub.css';

const ownerLinks = [
  { label: 'Menu Builder', path: '/menu', icon: Menu },
  { label: 'Live Orders', path: '/orders', icon: ListChecks },
  { label: 'QR Code', path: '/qrcode', icon: QrCode },
  { label: 'Analytics', path: '/modern/admin/analytics', icon: TrendingUp },
  { label: 'Inventory', path: '/modern/admin/inventory', icon: Package },
  { label: 'Settings', path: '/modern/admin/settings', icon: Settings }
];

const customerLinks = [
  { label: 'Browse Demo Menu', path: '/modern/menu', icon: UtensilsCrossed },
  { label: 'Customer Cart', path: '/modern/cart', icon: Package },
  { label: 'Customer Landing', path: '/modern/landing', icon: Store }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25 }
  }
};

function DashboardCard({ title, subtitle, icon: Icon, links, accent, primaryPath, primaryLabel }) {
  const navigate = useNavigate();

  return (
    <motion.section 
      variants={itemVariants}
      className="dashboard-choice" 
      style={{ '--section-color': accent }}
    >
      <div className="dashboard-choice__header">
        <div className="dashboard-choice__icon">
          <Icon size={24} />
        </div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="dashboard-choice__primary" 
        onClick={() => navigate(primaryPath)}
      >
        {primaryLabel} <ArrowRight size={18} />
      </motion.button>

      <div className="dashboard-choice__links">
        {links.map((item) => {
          const ItemIcon = item.icon;
          return (
            <motion.button 
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={item.path} 
              onClick={() => navigate(item.path)}
            >
              <ItemIcon size={18} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

const DashboardHub = () => {
  const navigate = useNavigate();
  const shopId = localStorage.getItem('shopId');
  const qrId = localStorage.getItem('qr_id');
  const email = localStorage.getItem('email');

  React.useEffect(() => {
    if (!shopId) {
      navigate('/login', { replace: true });
    }
  }, [navigate, shopId]);

  return (
    <div className="dashboard-hub">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hub-header"
      >
        <div className="header-content">
          <span className="hub-kicker">Restaurant workspace</span>
          <h1>Run service from one place.</h1>
          <p>{email ? `Signed in as ${email}` : 'Manage your menu, orders, and customer experience.'}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="logout-btn" 
          onClick={() => navigate('/')}
        >
          <Home size={20} /> Back to Home
        </motion.button>
      </motion.header>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="hub-status-cards" 
        aria-label="Workspace status"
      >
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          className="hub-status-card"
        >
          <div className="status-icon-wrap bg-success-500/10 text-success-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span>Workspace</span>
            <strong>{shopId ? 'Connected' : 'Sign in required'}</strong>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          className="hub-status-card"
        >
          <div className="status-icon-wrap bg-brand-500/10 text-brand-500">
            <QrCode size={20} />
          </div>
          <div>
            <span>Menu QR</span>
            <strong>{qrId ? 'Published' : 'Not published'}</strong>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.03, y: -2 }}
          className="hub-status-card"
        >
          <div className="status-icon-wrap bg-info-500/10 text-info-500">
            <Zap size={20} />
          </div>
          <div>
            <span>Next action</span>
            <strong>{qrId ? 'Monitor orders' : 'Build your menu'}</strong>
          </div>
        </motion.div>
      </motion.section>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="dashboard-choice-grid"
      >
        <DashboardCard
          title="Restaurant operations"
          subtitle="Build the live menu, publish your QR, and keep orders moving."
          icon={ChefHat}
          links={ownerLinks}
          accent="#f59e0b"
          primaryPath={qrId ? '/orders' : '/menu'}
          primaryLabel={qrId ? 'Open live orders' : 'Build your menu'}
        />

        <DashboardCard
          title="Customer experience"
          subtitle="Preview the discovery, menu, and checkout flow before sharing it with guests."
          icon={BarChart3}
          links={customerLinks}
          accent="#3b82f6"
          primaryPath={qrId ? `/menu/${qrId}` : '/modern/menu'}
          primaryLabel={qrId ? 'Preview live menu' : 'Preview demo menu'}
        />
      </motion.main>
    </div>
  );
};

export default DashboardHub;

