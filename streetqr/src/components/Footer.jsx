import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, QrCode } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__mark">
            <QrCode size={20} />
          </span>
          <div>
            <strong>Qzaar</strong>
            <p>QR ordering tools for faster, clearer restaurant service.</p>
          </div>
        </div>

        <nav className="site-footer__links" aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/login">Business login</Link>
          <a href="mailto:support@qzaar.app">
            Support <Mail size={14} />
          </a>
        </nav>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Qzaar. Built for modern food operations.</span>
          <Link to="/login">
            Start a workspace <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
