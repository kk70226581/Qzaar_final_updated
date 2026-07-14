import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ChefHat,
  BarChart3,
  Package,
  Settings,
  ArrowLeft,
  ClipboardList,
  Menu,
  QrCode,
  X,
  Store,
  Moon,
  Sun,
  UtensilsCrossed
} from 'lucide-react';
import '../../styles/layout/AdminLayout.css';

const AdminLayout = ({ children, title = 'Restaurant Console' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('qzaar-theme') || 'light');

  const email = localStorage.getItem('email');
  const menuItems = [
    { label: 'Dashboard', path: '/modern/admin', icon: LayoutDashboard },
    { label: 'Menu', path: '/menu', icon: UtensilsCrossed },
    { label: 'Orders', path: '/orders', icon: ClipboardList },
    { label: 'QR code', path: '/qrcode', icon: QrCode },
    { label: 'Kitchen KDS', path: '/modern/admin/kitchen', icon: ChefHat },
    { label: 'Analytics', path: '/modern/admin/analytics', icon: BarChart3 },
    { label: 'Inventory', path: '/modern/admin/inventory', icon: Package },
    { label: 'Settings', path: '/modern/admin/settings', icon: Settings },
  ];

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('qzaar-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const SidebarContent = () => (
    <div className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <Store size={22} className="text-brand-500" />
        <div>
          <h2>Qzaar</h2>
          <small>Restaurant Admin</small>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`admin-sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeAdminLink"
                  className="admin-sidebar__active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <button
          onClick={() => navigate('/dashboard')}
          className="admin-sidebar__link admin-sidebar__link--back"
        >
          <ArrowLeft size={18} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`admin-layout-shell ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="admin-topbar__toggle"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <h1 className="admin-topbar__title">{title}</h1>
        </div>

        <div className="admin-topbar__right">
          {email && <span className="admin-topbar__user">{email}</span>}
          
          <button
            onClick={handleToggleTheme}
            className="admin-topbar__icon-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="admin-layout-body">
        {/* Desktop Sidebar */}
        <aside className="admin-layout-desktop-sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Modal */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="admin-layout-mobile-overlay"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="admin-layout-mobile-sidebar"
              >
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="admin-sidebar__close"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="admin-layout-main-content">
          <div className="admin-layout-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
