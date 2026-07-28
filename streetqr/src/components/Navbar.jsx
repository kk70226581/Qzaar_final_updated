import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, ChefHat, ChevronDown, LayoutDashboard,
  LogIn, LogOut, Mail, Menu, QrCode, Route, Sparkles, X
} from 'lucide-react';
import './Navbar.css';
import { clearSession, hasActiveSession } from '../utils/authSession';

const products = [
  { icon: QrCode, label: 'QR Digital Menu', sub: 'Menus guests enjoy using', href: '/products' },
  { icon: ChefHat, label: 'Kitchen Display', sub: 'Live orders in sync', href: '/products' },
  { icon: BarChart3, label: 'Analytics', sub: 'Insights for every shift', href: '/products' },
];

function Navbar({ hideAuth = false, showAuthLinks = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(hasActiveSession());
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const shouldShowAuth = !hideAuth && showAuthLinks !== false;

  return (
    <nav className={`qz-nav ${scrolled ? 'qz-nav--scrolled' : ''}`}>
      <div className="qz-nav__inner">
        {/* Brand */}
        <Link className="qz-nav__brand" to="/">
          <span className="qz-nav__logo" aria-hidden="true">
            <span className="qz-nav__logo-q">Q</span>
            <span className="qz-nav__logo-dot" />
          </span>
          <span className="qz-nav__brand-text">
            Qzaar
            <small>Restaurant OS</small>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="qz-nav__links">
          <Link className={`qz-nav__link ${isActive('/') ? 'qz-nav__link--active' : ''}`} to="/">Home</Link>

          {/* Products dropdown */}
          <div className="qz-nav__dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`qz-nav__link qz-nav__link--btn ${productsOpen ? 'qz-nav__link--active' : ''}`}
              onClick={() => setProductsOpen((o) => !o)}
              aria-expanded={productsOpen}
            >
              Products <ChevronDown size={14} className={`qz-nav__chevron ${productsOpen ? 'qz-nav__chevron--open' : ''}`} />
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  className="qz-nav__dropdown-panel"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {products.map(({ icon: Icon, label, sub, href }) => (
                    <Link key={label} className="qz-nav__dropdown-item" to={href} onClick={() => setProductsOpen(false)}>
                      <span className="qz-nav__dropdown-icon"><Icon size={18} /></span>
                      <span>
                        <strong>{label}</strong>
                        <small>{sub}</small>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link className={`qz-nav__link ${isActive('/how-it-works') ? 'qz-nav__link--active' : ''}`} to="/how-it-works">
            <Route size={15} /> How it works
          </Link>
          <Link className={`qz-nav__link ${isActive('/about') ? 'qz-nav__link--active' : ''}`} to="/about">About</Link>
          <Link className={`qz-nav__link ${isActive('/contact') ? 'qz-nav__link--active' : ''}`} to="/contact">
            <Mail size={15} /> Contact
          </Link>

          {isLoggedIn && (
            <>
              <Link className={`qz-nav__link ${isActive('/dashboard') ? 'qz-nav__link--active' : ''}`} to="/dashboard">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link className={`qz-nav__link ${isActive('/orders') ? 'qz-nav__link--active' : ''}`} to="/orders">
                <Sparkles size={15} /> Orders
              </Link>
            </>
          )}
        </div>

        {/* Auth actions */}
        {shouldShowAuth && (
          <div className="qz-nav__actions">
            {!isLoggedIn ? (
              <Link className="qz-nav__cta" to="/login">
                <LogIn size={16} />
                Get started
              </Link>
            ) : (
              <button type="button" className="qz-nav__cta qz-nav__cta--ghost" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        )}

        {/* Mobile toggle */}
        <button
          type="button"
          className="qz-nav__burger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="qz-nav__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="qz-nav__mobile-inner">
              <Link className="qz-nav__mobile-link" to="/">Home</Link>
              <Link className="qz-nav__mobile-link" to="/products">Products</Link>
              <Link className="qz-nav__mobile-link" to="/how-it-works">How it works</Link>
              <Link className="qz-nav__mobile-link" to="/about">About</Link>
              <Link className="qz-nav__mobile-link" to="/contact">Contact</Link>
              {isLoggedIn && (
                <>
                  <Link className="qz-nav__mobile-link" to="/dashboard">Dashboard</Link>
                  <Link className="qz-nav__mobile-link" to="/orders">Orders</Link>
                </>
              )}
              <div className="qz-nav__mobile-divider" />
              {shouldShowAuth && (
                !isLoggedIn ? (
                  <Link className="qz-nav__mobile-cta" to="/login">
                    <LogIn size={16} /> Get started
                  </Link>
                ) : (
                  <button type="button" className="qz-nav__mobile-cta qz-nav__mobile-cta--ghost" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
