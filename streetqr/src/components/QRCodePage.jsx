import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Copy, Download, ExternalLink, Printer, QrCode, Share2, Smartphone, UtensilsCrossed } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Navbar from './Navbar';
import './QRCodePage.css';

function QRCodePage() {
  const location = useLocation();
  const id = location.state?.id || localStorage.getItem('qr_id');
  const [notice, setNotice] = useState('');

  if (!id) {
    return (
      <>
        <Navbar />
        <main className="qr-shell">
          <section className="qr-empty-state">
            <QrCode size={34} />
            <h1>Create a menu QR first</h1>
            <p>Save your menu to generate a shareable code for guests.</p>
            <Link to="/menu" className="qr-btn qr-btn--primary">Open menu builder <ArrowRight size={17} /></Link>
          </section>
        </main>
      </>
    );
  }

  const url = `${window.location.origin}/menu/${id}`;
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice((current) => (current === message ? '' : current)), 2600);
  };

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qzaar-menu-qr.png';
    link.click();
    showNotice('QR image downloaded.');
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else window.prompt('Copy your menu link:', url);
      showNotice('Menu link copied.');
    } catch {
      showNotice('Could not copy automatically. Please use the link below.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Qzaar menu', text: 'Open our digital menu.', url });
        showNotice('Share sheet opened.');
      } else {
        await handleCopy();
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showNotice('Sharing is not available on this device.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="qr-shell">
        <div className="qr-container">
          <div className="qr-page-heading">
            <span><QrCode size={15} /> Publish your menu</span>
            <p>Your QR code is ready to print, share, and scan.</p>
          </div>

          <section className="qr-workspace">
            <div className="qr-details">
              <div className="qr-heading">
                <span className="qr-status"><Check size={14} /> Ready to share</span>
                <h1>Put your menu in every guest’s hand.</h1>
                <p>Download a print-ready QR code, send the live link, or open the guest view before you publish.</p>
              </div>

              <div className="qr-primary-actions">
                <button type="button" className="qr-btn qr-btn--primary" onClick={handleDownload}><Download size={17} /> Download QR</button>
                <button type="button" className="qr-btn qr-btn--dark" onClick={handleShare}><Share2 size={17} /> Share menu</button>
              </div>

              <div className="qr-utility-actions">
                <button type="button" className="qr-utility-action" onClick={handleCopy}><Copy size={16} /> Copy live link</button>
                <a className="qr-utility-action" href={url} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Preview guest menu</a>
                <Link className="qr-utility-action" to="/orders"><UtensilsCrossed size={16} /> View incoming orders</Link>
              </div>

              <div className="qr-use-cases">
                <div><span className="qr-use-cases__icon"><Printer size={18} /></span><div><strong>Print and place</strong><p>Use it on tables, counters, takeaway bags, or posters.</p></div></div>
                <div><span className="qr-use-cases__icon"><Smartphone size={18} /></span><div><strong>Guest flow</strong><p>Guests scan, browse the menu, and send their order.</p></div></div>
              </div>
            </div>

            <aside className="qr-preview" aria-label="Menu QR code preview">
              <div className="qr-preview__topline"><span>LIVE MENU</span><span><Check size={14} /> Scan ready</span></div>
              <div className="qr-code-card__canvas">
                <QRCodeCanvas id="qr-code" value={url} size={272} includeMargin level="H" className="qr-code-card__image" />
              </div>
              <h2>Scan to open the menu</h2>
              <p>Point any phone camera at this code to open the guest menu.</p>
              <div className="qr-url-row"><code>{url}</code><button type="button" onClick={handleCopy} aria-label="Copy menu link"><Copy size={15} /></button></div>
            </aside>
          </section>
          {notice && <div className="qr-notice" role="status"><Check size={16} /> {notice}</div>}
        </div>
      </main>
    </>
  );
}

export default QRCodePage;
