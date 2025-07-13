import React from 'react';

function AboutPage() {
  return (
    <div className="container py-5">
      {/* Page Header */}
      <h1 className="fw-bold text-primary mb-4 text-center">About Qzaar</h1>

      {/* Vision Section */}
      <section className="mb-5">
        <h4 className="fw-bold text-dark mb-3">🚀 Our Vision</h4>
        <p className="text-muted">
          Qzaar is India’s #1 digital ordering platform for street food vendors. We aim to help small vendors digitize their business using QR code menus, real-time order tracking, and smart analytics — all in one place.
        </p>
      </section>

      {/* Creator Bio Card */}
      <section className="mb-5">
        <h4 className="fw-bold text-dark mb-4 text-center">👨‍💻 Meet the Creator</h4>
        <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '700px' }}>
          <div className="row g-0">
            <div className="col-md-4 col-12">
              <img
                src="/images/karan.jpg"
                className="img-fluid rounded-start w-100"
                alt="Karan Kannaujiya"
                style={{ height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-8 col-12">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Karan Kannaujiya</h5>
                <p className="card-text text-muted mb-1">🎓 B.Tech in Information Technology</p>
                <p className="card-text text-muted mb-1">🏫 IIIT Allahabad</p>
                <p className="card-text text-muted mb-1">📍 From Gorakhpur, Uttar Pradesh</p>
                <p className="card-text small mt-2">
                  I'm passionate about building digital solutions that solve real-world problems. Qzaar is my step toward helping local vendors thrive through simple, powerful, and accessible technology.
                </p>

                {/* Social Media Links */}
                <div className="mt-3 d-flex gap-3">
                  <a href="https://www.linkedin.com/in/karankannaujiya" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin fs-4 text-primary"></i>
                  </a>
                  <a href="https://github.com/karankannaujiya" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github fs-4 text-dark"></i>
                  </a>
                  <a href="mailto:karankannaujiya@example.com">
                    <i className="bi bi-envelope fs-4 text-danger"></i>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-5">
        <h4 className="fw-bold text-dark mb-3">💡 What Qzaar Offers</h4>
        <ul className="text-muted">
          <li>✅ QR Code Menus – No app needed for customers</li>
          <li>✅ Live Order Notifications – Vendors get instant alerts</li>
          <li>✅ Digital Dashboard – Track sales & top-selling items</li>
          <li>✅ Smart & Affordable – Designed for Indian street vendors</li>
        </ul>
      </section>

      {/* Why Qzaar Matters */}
      <section>
        <h4 className="fw-bold text-dark mb-3">🌍 Why Qzaar Matters</h4>
        <p className="text-muted">
          In a rapidly digitizing world, Qzaar bridges the technology gap for small food vendors. We bring the convenience of digital ordering, payment tracking, and customer experience – all at their fingertips.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
