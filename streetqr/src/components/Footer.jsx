import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CreditCard, Mail, QrCode, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__mark"><QrCode size={20} /></span>
          <div>
            <strong>Qzaar</strong>
            <p>The restaurant operating system that turns a simple scan into smoother, more considered service.</p>
            <Link className="site-footer__brand-link" to="/login">Build your workspace <ArrowUpRight size={15} /></Link>
          </div>
        </div>

        <div className="site-footer__content">
          <nav className="site-footer__links" aria-label="Platform links">
            <span>Platform</span>
            <Link to="/products">Products</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/modern/menu">Guest menu</Link>
            <Link to="/login">Get started</Link>
          </nav>
          <nav className="site-footer__links" aria-label="Operations links">
            <span>Operations</span>
            <Link to="/orders">Live orders</Link>
            <Link to="/qrcode">QR tools</Link>
            <Link to="/dashboard">Owner dashboard</Link>
          </nav>
          <nav className="site-footer__links" aria-label="Company links">
            <span>Company</span>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <div className="site-footer__links site-footer__links--support">
            <span>Need help?</span>
            <a href="mailto:support@qzaar.app">Support <Mail size={14} /></a>
            <p><ShieldCheck size={14} /> Secure payments by Razorpay</p>
            <p><UtensilsCrossed size={14} /> Built for independent restaurants</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>&copy; {new Date().getFullYear()} Qzaar. Built for modern food operations.</span>
          <span className="site-footer__payments"><CreditCard size={14} /> UPI &middot; Cards &middot; Netbanking</span>
          <Link to="/login">Start a workspace <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
