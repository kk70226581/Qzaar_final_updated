import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChevronDown, ChefHat, House, Info, LayoutDashboard, LogIn, LogOut, Menu, Phone, QrCode, Route, Sparkles, X } from 'lucide-react';
import './Navbar.css';
import { clearSession, hasActiveSession } from '../utils/authSession';

function Navbar({ hideAuth = false, showAuthLinks = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  useEffect(() => {
    const loggedIn = hasActiveSession();
    setIsLoggedIn(loggedIn);
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProductOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleScrollTo = (id) => {
    setIsMenuOpen(false);
    setIsProductOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const shouldShowAuth = !hideAuth && showAuthLinks !== false;

  return (
    <nav className="site-nav">
      <div className="site-nav__container">
        <Link className="site-nav__brand" to="/">
          <span className="site-nav__brand-mark" aria-hidden="true">
            <span className="site-nav__brand-q">Q</span>
            <span className="site-nav__brand-pixel site-nav__brand-pixel--one" />
            <span className="site-nav__brand-pixel site-nav__brand-pixel--two" />
          </span>
          <span>Qzaar<small>Restaurant OS</small></span>
        </Link>
        <span className="site-nav__statement">A calmer way to run service.</span>

        <button
          type="button"
          className="site-nav__menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className={`site-nav__links-wrap ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="site-nav__links">
            <Link className={`site-nav__link ${location.pathname === '/' ? 'is-active' : ''}`} to="/" aria-label="Home" title="Home">
              <House size={17} />
              <span>Home</span>
            </Link>
            <div className="site-nav__product">
              <button type="button" className={`site-nav__link site-nav__link--button ${isProductOpen ? 'is-open' : ''}`} onClick={() => setIsProductOpen((current) => !current)} aria-expanded={isProductOpen}>
                <span>Products</span><ChevronDown size={15} />
              </button>
              {isProductOpen && <div className="site-nav__product-menu">
                <button type="button" onClick={() => handleScrollTo('platform')}><span className="site-nav__product-icon"><QrCode size={17} /></span><span><strong>QR ordering</strong><small>Menus guests enjoy using</small></span></button>
                <button type="button" onClick={() => handleScrollTo('workflow')}><span className="site-nav__product-icon"><ChefHat size={17} /></span><span><strong>Live operations</strong><small>Orders that stay in sync</small></span></button>
                <button type="button" onClick={() => handleScrollTo('platform')}><span className="site-nav__product-icon"><BarChart3 size={17} /></span><span><strong>Business insight</strong><small>See each day more clearly</small></span></button>
              </div>}
            </div>
            <button type="button" className="site-nav__link site-nav__link--button" onClick={() => handleScrollTo('workflow')}>
              <Route size={16} />
              <span>How it works</span>
            </button>
            <Link className={`site-nav__link ${location.pathname === '/about' ? 'is-active' : ''}`} to="/about" aria-label="About" title="About">
              <Info size={17} />
              <span>About</span>
            </Link>
            {isLoggedIn && (
              <>
                <Link className={`site-nav__link ${location.pathname === '/dashboard' ? 'is-active' : ''}`} to="/dashboard">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link className={`site-nav__link ${location.pathname === '/menu' ? 'is-active' : ''}`} to="/menu">
                  <QrCode size={16} />
                  <span>Menu</span>
                </Link>
                <Link className={`site-nav__link ${location.pathname === '/orders' ? 'is-active' : ''}`} to="/orders">
                  <Sparkles size={16} />
                  <span>Orders</span>
                </Link>
              </>
            )}
            <button type="button" className="site-nav__link site-nav__link--button" onClick={() => handleScrollTo('contact')}>
              <Phone size={16} />
              <span>Contact</span>
            </button>
          </div>

          {shouldShowAuth && (
            <div className="site-nav__actions">
              {!isLoggedIn ? (
                <Link className="site-nav__cta" to="/login">
                  <LogIn size={16} />
                  <span>Get started</span>
                </Link>
              ) : (
                <button type="button" className="site-nav__cta site-nav__cta--ghost" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isMenuOpen && <button className="site-nav__scrim" type="button" aria-label="Close navigation" onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
}

export default Navbar;
