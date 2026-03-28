import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Copy, Download, ExternalLink, QrCode, Share2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Navbar from './Navbar';
import './QRCodePage.css';

function QRCodePage() {
  const location = useLocation();
  const id = location.state?.id || localStorage.getItem('qr_id');

  if (!id) {
    return <div className="container py-5 text-center text-danger fw-bold">No menu ID found to generate the QR code.</div>;
  }

  const url = `${window.location.origin}/menu/${id}`;

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'streetqr-menu.png';
    link.click();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    window.alert('Menu link copied to clipboard.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'StreetQR Menu', text: 'Open our digital menu here.', url });
      return;
    }

    handleCopy();
  };

  return (
    <>
      <Navbar />
      <div className="qr-shell">
        <div className="qr-container">
          <section className="qr-panel">
            <div className="qr-copy">
              <span className="qr-kicker">
                <QrCode size={16} />
                Publish and share
              </span>
              <h1>Your menu is ready to scan.</h1>
              <p>
                Download the QR, copy the live menu link, or open the public menu to review the exact customer
                experience before sharing it at the stall.
              </p>

              <div className="qr-actions">
                <button type="button" className="qr-btn qr-btn--primary" onClick={handleDownload}>
                  <Download size={16} />
                  Download QR
                </button>
                <button type="button" className="qr-btn qr-btn--secondary" onClick={handleCopy}>
                  <Copy size={16} />
                  Copy menu link
                </button>
                <button type="button" className="qr-btn qr-btn--secondary" onClick={handleShare}>
                  <Share2 size={16} />
                  Share menu
                </button>
                <a className="qr-btn qr-btn--ghost" href={url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  Open live menu
                </a>
                <Link className="qr-link" to="/orders">
                  Open orders dashboard
                </Link>
              </div>

              <div className="qr-tips">
                <div><strong>Best use:</strong><span>Print near the counter or place it on the table.</span></div>
                <div><strong>Customer flow:</strong><span>Scan, browse menu, add items, and place the order on mobile.</span></div>
              </div>
            </div>

            <div className="qr-code-card">
              <div className="qr-code-card__canvas">
                <QRCodeCanvas id="qr-code" value={url} size={260} includeMargin level="H" className="qr-code-card__image" />
              </div>
              <p>{url}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default QRCodePage;
