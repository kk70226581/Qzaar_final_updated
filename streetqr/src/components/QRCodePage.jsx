import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodePage() {
  const location = useLocation();
  const id = location.state?.id || localStorage.getItem("qr_id");
  const [qrReady, setQrReady] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (id) {
      localStorage.setItem("qr_id", id);
      setTimeout(() => setQrReady(true), 500);
    }
  }, [id]);

  if (!id) {
    return (
      <div className="text-center mt-10 text-danger fw-bold fs-4">
        ❌ No menu ID found to generate QR code.
      </div>
    );
  }

  const url = `${window.location.origin}/menu/${id}`;

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "streetqr-menu.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light py-5 px-3">
      {/* Company Name */}
      <div className="text-center mb-4">
        <h2 className="text-orange fw-bold">🍽️ Qzaar</h2>
        <p className="text-muted">India’s Digital Menu and Ordering Platform for Street Vendors</p>
      </div>

      <div className="text-center mb-5">
        <h1 className="fw-bold text-success display-5 mb-3">📱 Your Digital QR Code</h1>
        <p className="text-muted fs-6">This QR links to your live digital menu. You can print or share it with your customers.</p>
      </div>

      <div className="bg-white p-4 rounded shadow-lg d-flex flex-column align-items-center mx-auto" style={{ maxWidth: '500px' }}>
        <QRCodeCanvas
          id="qr-code"
          value={url}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
          ref={qrRef}
        />

        <p className="mt-3 text-center text-primary small">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
            {url}
          </a>
        </p>

        <button
          onClick={handleDownload}
          className="btn btn-success mt-4 fw-semibold"
        >
          ⬇️ Download QR Code
        </button>
      </div>

      {/* Features */}
      <div className="container mt-5">
        <h4 className="fw-bold text-center text-success mb-3">✨ Key Benefits of Qzaar</h4>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h6 className="fw-bold">📲 Contactless Menus</h6>
              <p className="small text-muted">No need to print menus daily – just scan the QR to order.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h6 className="fw-bold">⏱️ Real-Time Order Tracking</h6>
              <p className="small text-muted">Instant updates for every order placed by your customer.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <h6 className="fw-bold">📊 Smart Insights</h6>
              <p className="small text-muted">See your most popular dishes and improve your offerings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions for Restaurant Owner */}
      <div className="mt-5 bg-white rounded shadow p-4 mx-auto" style={{ maxWidth: '700px' }}>
        <h4 className="fw-bold text-success mb-3">📖 How to Use This QR Code</h4>
        <ol className="text-muted small ps-3">
          <li>Print this QR code and paste it on your food cart or stall.</li>
          <li>Customers will scan it using their phone camera (no app needed).</li>
          <li>They will see your digital menu and place their orders directly.</li>
          <li>You will receive new order notifications in your dashboard.</li>
          <li>Track, complete, and manage all orders from your dashboard.</li>
        </ol>
        <p className="mt-3 text-muted">
          This solution helps reduce crowding, improves hygiene, and modernizes your food business.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center text-muted border-top py-4 mt-5">
        <div className="container">
          <p className="mb-1">© {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd.</p>
          <small>Empowering local vendors with digital solutions.</small>
        </div>
      </footer>
    </div>
  );
}

export default QRCodePage;