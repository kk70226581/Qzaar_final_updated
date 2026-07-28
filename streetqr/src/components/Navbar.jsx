import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogIn, LogOut, Mail, Menu, Route, Sparkles, X } from 'lucide-react';
import './Navbar.css';
import { clearSession, hasActiveSession } from '../utils/authSession';

function Navbar({ hideAuth = false, showAuthLinks = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasActiveSession());
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

          <Link className={`qz-nav__link ${isActive('/products') ? 'qz-nav__link--active' : ''}`} to="/products">Products</Link>

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
