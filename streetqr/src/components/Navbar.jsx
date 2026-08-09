import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, LayoutDashboard, LogIn, LogOut, Mail, Menu, Route, ScanLine, Sparkles, X } from 'lucide-react';
import './Navbar.css';
import { clearSession, hasActiveSession } from '../utils/authSession';

const publicLinks = [
  { label: 'Home', path: '/', end: true },
  { label: 'Products', path: '/products' },
  { label: 'How it works', path: '/how-it-works', icon: Route },
  { label: 'Live demo', path: '/demo', icon: BookOpen },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact', icon: Mail },
];

const workspaceLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', path: '/orders', icon: Sparkles },
];

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

  const shouldShowAuth = !hideAuth && showAuthLinks !== false;
  const visibleLinks = isLoggedIn ? [...publicLinks, ...workspaceLinks] : publicLinks;

  return (
    <nav className={`qz-nav ${scrolled ? 'qz-nav--scrolled' : ''}`}>
      <div className="qz-nav__inner">
        {/* Brand */}
        <Link className="qz-nav__brand" to="/">
          <span className="qz-nav__logo" aria-hidden="true">
            <ScanLine className="qz-nav__logo-icon" size={23} strokeWidth={2.35} />
            <span className="qz-nav__logo-dot" />
          </span>
          <span className="qz-nav__brand-text">
            <strong>Qzaar</strong>
            <small>Restaurant OS</small>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="qz-nav__links" role="navigation" aria-label="Primary navigation">
          {visibleLinks.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              className={({ isActive }) => `qz-nav__link ${isActive ? 'qz-nav__link--active' : ''}`}
              to={path}
              end={end}
            >
              {Icon && <Icon size={15} aria-hidden="true" />} {label}
            </NavLink>
          ))}
        </div>

        {/* Auth actions */}
        {shouldShowAuth && (
          <div className="qz-nav__actions">
            {!isLoggedIn ? (
              <>
                <Link className="qz-nav__login" to="/login">Log in</Link>
                <Link className="qz-nav__cta" to="/signup">
                  Get started
                  <LogIn size={16} />
                </Link>
              </>
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
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{mobileOpen ? 'Close' : 'Menu'}</span>
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
              {visibleLinks.map(({ label, path, icon: Icon, end }) => (
                <NavLink
                  key={path}
                  className={({ isActive }) => `qz-nav__mobile-link ${isActive ? 'qz-nav__mobile-link--active' : ''}`}
                  to={path}
                  end={end}
                >
                  {Icon && <Icon size={17} aria-hidden="true" />} {label}
                </NavLink>
              ))}
              <div className="qz-nav__mobile-divider" />
              {shouldShowAuth && (
                !isLoggedIn ? (
                  <div className="qz-nav__mobile-auth">
                    <Link className="qz-nav__mobile-login" to="/login">Log in</Link>
                    <Link className="qz-nav__mobile-cta" to="/signup">
                      Get started <LogIn size={16} />
                    </Link>
                  </div>
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
