import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { House, Info, LayoutDashboard, LogIn, LogOut, Menu, Phone, QrCode, Sparkles, X } from 'lucide-react';
import './Navbar.css';

function Navbar({ hideAuth = false, showAuthLinks = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true' || Boolean(localStorage.getItem('shopId'));
    setIsLoggedIn(loggedIn);
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('shopId');
    localStorage.removeItem('email');
    localStorage.removeItem('qr_id');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleScrollToContact = () => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shouldShowAuth = !hideAuth && showAuthLinks !== false;

  return (
    <nav className="site-nav">
      <div className="site-nav__container">
        <Link className="site-nav__brand" to="/">
          <span className="site-nav__brand-mark">
            <QrCode size={18} />
          </span>
          <span>Qzaar<small>Restaurant OS</small></span>
        </Link>

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
            <button type="button" className="site-nav__link site-nav__link--button" onClick={handleScrollToContact}>
              <Phone size={16} />
              <span>Contact</span>
            </button>
          </div>

          {shouldShowAuth && (
            <div className="site-nav__actions">
              {!isLoggedIn ? (
                <Link className="site-nav__cta" to="/login">
                  <LogIn size={16} />
                  <span>Login</span>
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
