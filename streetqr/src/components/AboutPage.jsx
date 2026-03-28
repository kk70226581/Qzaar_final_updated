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
  'QR menus that customers can open instantly without installing an app',
  'Live order updates that help vendors manage busy service windows',
  'Digital storefront branding with menu highlights and cleaner presentation',
  'Simple analytics that surface revenue, order volume, and popular dishes'
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
              <h1>Qzaar helps street food vendors look more modern without losing simplicity.</h1>
              <p>
                The goal is straightforward: give small food businesses an easier way to publish a menu,
                share it with QR, take orders, and stay organized during service.
              </p>
            </div>

            <div className="about-hero__card">
              <div className="about-hero__stat">
                <QrCode size={18} />
                <div>
                  <strong>Fast to launch</strong>
                  <span>Create a storefront, publish a menu, and share a live QR link.</span>
                </div>
              </div>
              <div className="about-hero__stat">
                <Globe2 size={18} />
                <div>
                  <strong>Easy for customers</strong>
                  <span>Browse dishes, add items, and place orders from any phone browser.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-grid">
            <article className="about-panel">
              <div className="about-panel__header">
                <h2>What Qzaar offers</h2>
                <p>A practical toolkit designed to feel polished while staying easy to use.</p>
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
                  <h2>Built for growing food businesses</h2>
                  <p>
                    Qzaar is designed for street food vendors, cafes, kiosks, and small restaurant teams that
                    want a simpler way to manage digital menus and customer orders.
                  </p>
                </div>
              </div>

              <div className="about-creator__meta">
                <div><QrCode size={16} /><span>QR-first ordering for faster service</span></div>
                <div><Users size={16} /><span>Easy for staff, simple for customers</span></div>
                <div><Globe2 size={16} /><span>Accessible from any modern phone browser</span></div>
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
            <h2>Digitization feels more useful when it removes friction instead of adding it.</h2>
            <p>
              Qzaar bridges the gap between a local vendor and a better ordering experience. It keeps the
              workflow light, improves how the brand is presented, and helps teams stay more organized when
              orders start coming in.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
