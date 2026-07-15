import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CreditCard, Mail, QrCode, ShieldCheck } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__mark"><QrCode size={20} /></span>
          <div>
            <strong>Qzaar</strong>
            <p>QR ordering tools for faster, clearer restaurant service.</p>
          </div>
        </div>

        <div className="site-footer__content">
          <nav className="site-footer__links" aria-label="Footer navigation">
            <span>Platform</span>
            <Link to="/about">About Qzaar</Link>
            <Link to="/modern/menu">Menu preview</Link>
            <Link to="/login">Business login</Link>
          </nav>
          <div className="site-footer__links site-footer__links--support">
            <span>Need help?</span>
            <a href="mailto:support@qzaar.app">Support <Mail size={14} /></a>
            <p><ShieldCheck size={14} /> Secure payments by Razorpay</p>
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
