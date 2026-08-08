import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock3,
  ExternalLink,
  Globe2,
  LogOut,
  Package,
  QrCode,
  ScanLine,
  Settings,
  Sparkles,
  Store,
  TrendingUp,
  UtensilsCrossed,
  UsersRound,
  Zap,
} from 'lucide-react';
import './DashboardHub.css';
import { clearSession, hasActiveSession, isSessionExpired } from '../utils/authSession';

const ownerLinks = [
  { label: 'Menu builder', description: 'Dishes, pricing, and availability', path: '/menu', icon: UtensilsCrossed, tone: 'orange', meta: 'Build' },
  { label: 'Live orders', description: 'Accept and manage table orders', path: '/orders', icon: ClipboardList, tone: 'blue', meta: 'Operate' },
  { label: 'QR & sharing', description: 'Publish the guest experience', path: '/qrcode', icon: QrCode, tone: 'violet', meta: 'Launch' },
  { label: 'Analytics', description: 'Understand daily performance', path: '/modern/admin/analytics', icon: BarChart3, tone: 'green', meta: 'Improve' },
  { label: 'Inventory', description: 'Monitor stock and expiry risk', path: '/modern/admin/inventory', icon: Package, tone: 'rose', meta: 'Control' },
  { label: 'Workspace settings', description: 'Brand, hours, and preferences', path: '/modern/admin/settings', icon: Settings, tone: 'slate', meta: 'Configure' },
];

const customerLinks = [
  { label: 'Live menu', description: 'See what guests see after scanning', path: '/modern/menu', icon: UtensilsCrossed, tone: 'orange' },
  { label: 'Guest cart', description: 'Review the mobile checkout journey', path: '/modern/cart', icon: Package, tone: 'blue' },
  { label: 'Restaurant page', description: 'Preview your public experience', path: '/modern/landing', icon: Store, tone: 'violet' },
];

const setupSteps = [
  { title: 'Restaurant profile', description: 'Brand, hours, and service details', path: '/modern/admin/settings', icon: Store },
  { title: 'Build your menu', description: 'Add dishes, prices, and availability', path: '/menu', icon: UtensilsCrossed },
  { title: 'Publish your QR', description: 'Create the guest entry point', path: '/qrcode', icon: QrCode },
];

function LaunchTile({ item, index }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      className={`workspace-tile workspace-tile--${item.tone}`}
      onClick={() => navigate(item.path)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.04, duration: 0.25 }}
      whileHover={reduceMotion ? {} : { y: -3 }}
      whileTap={reduceMotion ? {} : { scale: 0.985 }}
    >
      <span className="workspace-tile__icon"><Icon size={19} /></span>
      {item.meta && <span className="workspace-tile__meta">{item.meta}</span>}
      <span className="workspace-tile__content"><strong>{item.label}</strong><small>{item.description}</small></span>
      <span className="workspace-tile__open">Open <ArrowRight size={14} /></span>
    </motion.button>
  );
}

function DashboardHub() {
  const navigate = useNavigate();
  const shopId = hasActiveSession() ? localStorage.getItem('shopId') : null;
  const qrId = localStorage.getItem('qr_id');
  const email = localStorage.getItem('email') || '';
  const isLive = Boolean(qrId);
  const displayName = email ? email.split('@')[0].split(/[._-]/)[0] : 'there';
  const name = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const completedSteps = isLive ? 3 : 1;
  const progress = Math.round((completedSteps / setupSteps.length) * 100);
  const primaryPath = isLive ? '/orders' : '/menu';

  React.useEffect(() => {
    if (!shopId) {
      if (isSessionExpired()) clearSession();
      navigate('/login', { replace: true });
    }
  }, [navigate, shopId]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <main className="dashboard-hub">
      <header className="workspace-topbar">
        <button type="button" className="workspace-brand" onClick={() => navigate('/')} aria-label="Go to Qzaar home">
          <span><ScanLine size={20} /></span>
          <span><strong>Qzaar</strong><small>Restaurant workspace</small></span>
        </button>
        <div className="workspace-topbar__actions">
          <span className={`workspace-status ${isLive ? 'is-live' : ''}`}><i /> {isLive ? 'Service live' : 'Setup in progress'}</span>
          <button type="button" className="workspace-public-link" onClick={() => navigate('/modern/menu')}><Globe2 size={16} /><span>Guest preview</span></button>
          <button type="button" className="workspace-logout" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut size={16} /></button>
        </div>
      </header>

      <section className={`workspace-hero ${isLive ? 'is-live' : ''}`}>
        <div className="workspace-hero__glow" />
        <div className="workspace-hero__copy">
          <span className="workspace-eyebrow"><Sparkles size={14} /> {isLive ? 'Restaurant control centre' : 'Let’s finish your workspace'}</span>
          <h1>{isLive ? `Welcome back, ${name}. Your service workspace is ready.` : `Welcome, ${name}. Let’s get your first table online.`}</h1>
          <p>{isLive ? 'Orders, menu updates, kitchen activity, analytics, and inventory are one click away.' : 'Add your menu, publish a table QR, and open a smooth ordering journey for every guest.'}</p>
          <div className="workspace-hero__actions">
            <button type="button" className="workspace-primary-action" onClick={() => navigate(primaryPath)}>{isLive ? 'Open live orders' : 'Continue with menu'} <ArrowRight size={17} /></button>
            <button type="button" className="workspace-secondary-action" onClick={() => navigate('/modern/menu')}>Preview guest view <ExternalLink size={15} /></button>
          </div>
          <div className="workspace-hero__proof">
            <span><CheckCircle2 size={14} /> No guest app</span>
            <span><CheckCircle2 size={14} /> Live updates</span>
            <span><CheckCircle2 size={14} /> One workspace</span>
          </div>
        </div>

        <div className="workspace-launch-card">
          <div className="workspace-launch-card__header">
            <div><span className="workspace-launch-card__icon"><Zap size={18} /></span><span><small>{isLive ? 'Workspace health' : 'Launch checklist'}</small><strong>{isLive ? 'Ready for service' : `${completedSteps} of ${setupSteps.length} steps complete`}</strong></span></div>
            <strong>{progress}%</strong>
          </div>
          <div className="workspace-launch-card__progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="workspace-launch-card__steps">
            {setupSteps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = index < completedSteps;
              const isCurrent = !isLive && index === completedSteps;
              return (
                <button type="button" className={`${isComplete ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`} key={step.title} onClick={() => navigate(step.path)}>
                  <span className="workspace-launch-card__step-icon">{isComplete ? <Check size={15} /> : <Icon size={16} />}</span>
                  <span><strong>{step.title}</strong><small>{step.description}</small></span>
                  {isCurrent ? <em>Next</em> : <ArrowRight size={14} />}
                </button>
              );
            })}
          </div>
          <div className="workspace-launch-card__tip"><Activity size={15} /><span>{isLive ? 'Your QR is published. Keep the order desk open during service.' : 'Menu items can be edited anytime—even after your QR is published.'}</span></div>
        </div>
      </section>

      <section className="workspace-metrics" aria-label="Workspace overview">
        <article>
          <span className="workspace-metric__icon workspace-metric__icon--violet"><QrCode size={18} /></span>
          <div><small>Guest experience</small><strong>{isLive ? 'Published' : 'Draft'}</strong></div>
          <span className={`workspace-metric__pill ${isLive ? 'is-good' : ''}`}>{isLive ? 'Live now' : 'Needs QR'}</span>
        </article>
        <article>
          <span className="workspace-metric__icon workspace-metric__icon--blue"><ClipboardList size={18} /></span>
          <div><small>Order desk</small><strong>{isLive ? 'Queue open' : 'No orders yet'}</strong></div>
          <button type="button" onClick={() => navigate('/orders')}>View <ArrowRight size={13} /></button>
        </article>
        <article>
          <span className="workspace-metric__icon workspace-metric__icon--green"><Activity size={18} /></span>
          <div><small>Workspace</small><strong>{isLive ? 'Operational' : 'Being configured'}</strong></div>
          <span className="workspace-metric__detail">6 tools</span>
        </article>
        <article>
          <span className="workspace-metric__icon workspace-metric__icon--orange"><Clock3 size={18} /></span>
          <div><small>Recommended next</small><strong>{isLive ? 'Monitor service' : 'Build menu'}</strong></div>
          <button type="button" onClick={() => navigate(primaryPath)}>Start <ArrowRight size={13} /></button>
        </article>
      </section>

      <div className="workspace-sections">
        <section className="workspace-group workspace-group--tools">
          <div className="workspace-group__heading">
            <span><ChefHat size={18} /></span>
            <div><small>Restaurant operations</small><h2>Your workspace</h2><p>Everything needed to build, run, and improve service.</p></div>
            <button type="button" onClick={() => navigate('/modern/admin')}>Open admin <ArrowRight size={14} /></button>
          </div>
          <div className="workspace-group__grid">
            {ownerLinks.map((item, index) => <LaunchTile key={item.path} item={item} index={index} />)}
          </div>
        </section>

        <aside className="workspace-side-column">
          <section className="workspace-group workspace-group--guest">
            <div className="workspace-group__heading">
              <span><UsersRound size={18} /></span>
              <div><small>Customer-facing</small><h2>Guest experience</h2><p>Check every screen before sharing.</p></div>
              <span className="workspace-group__badge"><ExternalLink size={13} /> Preview</span>
            </div>
            <div className="workspace-group__grid">
              {customerLinks.map((item, index) => <LaunchTile key={item.path} item={item} index={ownerLinks.length + index} />)}
            </div>
          </section>

          <section className="workspace-service-note">
            <span className="workspace-service-note__icon"><TrendingUp size={19} /></span>
            <small>Built for the next service</small>
            <h2>Keep the menu current and the team in sync.</h2>
            <p>Use analytics after service and inventory before the next one.</p>
            <button type="button" onClick={() => navigate('/modern/admin/analytics')}>View performance <ArrowRight size={14} /></button>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default DashboardHub;
