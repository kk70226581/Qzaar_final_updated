import React from 'react';
import {
  Globe2,
  QrCode,
  Sparkles,
  Store,
  Users
} from 'lucide-react';
import Navbar from './Navbar';
import './AboutPage.css';

const featureList = [
  'Instant QR menu',
  'Live order updates',
  'Branded storefront',
  'Simple analytics'
];

function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="about-shell">
        <div className="about-container">
          <section className="about-hero">
            <div>
              <span className="about-kicker">
                <Sparkles size={16} />
                Built for practical digital ordering
              </span>
              <h1>Simple QR ordering for food businesses.</h1>
              <p>Publish a menu, share a QR, and manage orders.</p>
            </div>

            <div className="about-hero__card">
              <div className="about-hero__stat">
                <QrCode size={18} />
                <div>
                  <strong>Launch fast</strong>
                  <span>Menu to QR in minutes.</span>
                </div>
              </div>
              <div className="about-hero__stat">
                <Globe2 size={18} />
                <div>
                  <strong>Customer friendly</strong>
                  <span>Browse and order on phone.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-grid">
            <article className="about-panel">
              <div className="about-panel__header">
                <h2>What Qzaar offers</h2>
                <p>Useful tools, simple flow.</p>
              </div>
              <ul className="about-feature-list">
                {featureList.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>

            <article className="about-panel about-panel--creator">
              <div className="about-creator">
                <div className="about-creator__photo">
                  <Store size={34} />
                </div>
                <div>
                  <span className="about-panel__eyebrow">Who we serve</span>
                  <h2>Built for small food teams</h2>
                  <p>For vendors, cafes, kiosks, and restaurants.</p>
                </div>
              </div>

              <div className="about-creator__meta">
                <div><QrCode size={16} /><span>QR-first ordering</span></div>
                <div><Users size={16} /><span>Easy for staff</span></div>
                <div><Globe2 size={16} /><span>Works in browser</span></div>
              </div>

              <div className="about-creator__links">
                <a href="/login"><Store size={16} /> Open Dashboard</a>
                <a href="/menu/demo"><QrCode size={16} /> View Menu</a>
                <a href="mailto:support@qzaar.com"><Sparkles size={16} /> Contact Support</a>
              </div>
            </article>
          </section>

          <section className="about-panel about-panel--wide">
            <span className="about-panel__eyebrow">Why it matters</span>
            <h2>Less friction. Better service.</h2>
            <p>Keep the workflow light while your menu, brand, and orders stay organized.</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
