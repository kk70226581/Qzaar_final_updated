import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-primary mb-3">
            <span role="img" aria-label="utensils">🍽️</span> Welcome to Qzaar
          </h1>
          
          {/* SECTION WITH STEPS */}
          <div className="mb-5 mx-auto" style={{ maxWidth: '800px' }}>
            <h2 className="fw-bold text-dark mb-4">Create a mini website for your Restaurant</h2>
            <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <h3 className="fw-bold fs-5 text-primary">1. Sign up & Create Profile</h3>
                    <p className="text-muted small">Register your restaurant and set up your brand details, logo, and contact info.</p>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <h3 className="fw-bold fs-5 text-primary">2. Build Your Digital Menu</h3>
                    <p className="text-muted small">Easily add all your dishes, prices, and high-quality images under different categories.</p>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <h3 className="fw-bold fs-5 text-primary">3. Get Your Unique QR Code</h3>
                    <p className="text-muted small">Qzaar automatically generates a unique QR code for your menu that you can print.</p>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <h3 className="fw-bold fs-5 text-primary">4. Go Live & Track Orders</h3>
                    <p className="text-muted small">Place the QR code on your tables and track incoming orders from your dashboard.</p>
                </div>
            </div>
          </div>
          
          <Link to="/login" className="btn btn-primary btn-lg mt-4">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div
                id="qzaarCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="3000"
              >
                <div className="carousel-inner">
                  {/* Carousel Item 1 (Active) */}
                  <div className="carousel-item active">
                    <img
                      src="/images/step1.png"
                      className="d-block w-100"
                      alt="Create Menu"
                    />
                    {/* Caption for the image */}
                    {/*
                    <div className="carousel-caption d-none d-md-block">
                      <h5>Step 1: Create Your Digital Menu</h5>
                      <p>Easily add, edit, and organize all your menu items with prices and high-quality images.</p>
                    </div>
                    */}
                  </div>
                  {/* Carousel Item 2 */}
                  <div className="carousel-item">
                    <img
                      src="/images/step2.jpg"
                      className="d-block w-100"
                      alt="Scan QR"
                    />
                    {/* Caption for the image */}
                    {/*
                    <div className="carousel-caption d-none d-md-block">
                      <h5>Step 2: Scan and Browse</h5>
                      <p>Customers simply scan the QR code to instantly view your full menu on their phone.</p>
                    </div>
                    */}
                  </div>
                  {/* Carousel Item 3 */}
                  <div className="carousel-item">
                    <img
                      src="/images/step3.png"
                      className="d-block w-100"
                      alt="Track Orders"
                    />
                    {/* Caption for the image */}
                    {/*
                    <div className="carousel-caption d-none d-md-block">
                      <h5>Step 3: Track Orders in Real-Time</h5>
                      <p>Manage and track all incoming orders from a single, intuitive dashboard.</p>
                    </div>
                    */}
                  </div>
                  {/* Carousel Item 4 */}
                  <div className="carousel-item">
                    <img
                      src="/images/step4.png"
                      className="d-block w-100"
                      alt="Order Process"
                    />
                    {/* Caption for the image */}
                    {/*
                    <div className="carousel-caption d-none d-md-block">
                      <h5>Step 4: Streamlined Order Process</h5>
                      <p>From scanning to serving, Qzaar makes the entire ordering process fast and efficient.</p>
                    </div>
                    */}
                  </div>
                  {/* Carousel Item 5 */}
                  <div className="carousel-item">
                    <img
                      src="/images/step5.png"
                      className="d-block w-100"
                      alt="Cost Savings"
                    />
                    {/* Caption for the image */}
                    {/*
                    <div className="carousel-caption d-none d-md-block">
                      <h5>Step 5: Save Money, Go Digital</h5>
                      <p>Eliminate recurring printing costs and update your menu instantly without any hassle.</p>
                    </div>
                    */}
                  </div>
                </div>

                {/* Carousel Controls */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#qzaarCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#qzaarCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <h2 className="text-center text-primary mb-5 fw-bold">Why Choose Qzaar?</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h4>📱 Digital Menu</h4>
                <p>Replace your paper menu with a mobile-friendly digital version.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h4>📦 Real-Time Orders</h4>
                <p>Get notified instantly when a customer places an order.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 shadow-sm rounded bg-light h-100">
                <h4>📊 Business Insights</h4>
                <p>Track your top-selling items and daily order trends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section (Video) - NEW UI */}
      <section className="py-5 bg-light border-top">
        <div className="container">
          <h2 className="fw-bold text-primary mb-5 text-center">How to Use Qzaar</h2>
          <div className="row align-items-center g-5">
            {/* Video Column */}
            <div className="col-md-7">
              <div className="video-container">
                <video
                  controls
                  controlsList="nodownload"
                  className="w-100 h-100"
                >
                  <source src="/videos/tutorial.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            {/* Text Column */}
            <div className="col-md-5">
              <ul className="list-unstyled">
                <li className="mb-4">
                  <h4><span className="text-primary me-2 fw-bold">1.</span> Create your menu</h4>
                  <p className="text-muted">Easily add, edit, and organize all your menu items with prices and high-quality images in minutes.</p>
                </li>
                <li className="mb-4">
                  <h4><span className="text-primary me-2 fw-bold">2.</span> Generate QR codes</h4>
                  <p className="text-muted">Qzaar automatically generates unique QR codes for your menu that customers can scan.</p>
                </li>
                <li className="mb-4">
                  <h4><span className="text-primary me-2 fw-bold">3.</span> Track orders live</h4>
                  <p className="text-muted">Manage all incoming orders from a single, intuitive dashboard with real-time updates.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-3">About Qzaar</h2>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '800px' }}>
            Qzaar empowers street vendors across India to modernize their ordering process using QR code technology,
            a digital menu builder, and smart order management tools — all in one place.
          </p>
        </div>
      </section>

      {/* Updated Footer Section */}
      <footer className="bg-white pt-5 pb-4 mt-5 border-top">
        <div className="container">
          <div className="row gy-4 text-center text-md-start">
            {/* Qzaar Brand */}
            <div className="col-12 col-md-4">
              <h4 className="fw-bold text-dark">🍽️ Qzaar</h4>
              <p className="text-muted small">
                Qzaar is India’s leading platform helping street vendors go digital with QR code menus, live order tracking, and real-time business insights.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
                <a href="#"><i className="bi bi-facebook text-dark fs-5"></i></a>
                <a href="#"><i className="bi bi-instagram text-dark fs-5"></i></a>
                <a href="#"><i className="bi bi-twitter-x text-dark fs-5"></i></a>
                <a href="#"><i className="bi bi-youtube text-dark fs-5"></i></a>
              </div>
            </div>



<section className="seo-text" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
  <h1>QR Menu for Restaurants, Cafes, and Hotels</h1>
  <p>
    Qzaar is a powerful digital menu system designed for modern restaurants, cafes, and hotels. Our QR code-based menu allows customers to scan a code, browse your menu, and place orders instantly from their smartphones.
  </p>
  <p>
    Whether you're a small café or a large hotel, Qzaar helps streamline service, reduce paper menus, and enhance customer experience. No app installation required — just scan and order.
  </p>
</section>



            {/* Quick Links */}
            <div className="col-12 col-md-2">
              <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-dark text-decoration-none small">Home</Link></li>
                <li><Link to="/login" className="text-dark text-decoration-none small">Login / Signup</Link></li>
                <li><a href="#about" className="text-dark text-decoration-none small">About Us</a></li>
                <li>
                  <a href="tel:8081845856" className="text-dark text-decoration-none small">📞 Call: 8081845856</a>
                </li>
                <li>
                  <a href="mailto:karankannaujiya129@gmail.com" className="text-dark text-decoration-none small">📧 Email: karankannaujiya129@gmail.com</a>
                </li>
              </ul>
            </div>
            {/* Features */}
            <div className="col-12 col-md-3">
              <h6 className="fw-bold text-dark mb-3">Platform Features</h6>
              <ul className="list-unstyled">
                <li className="text-muted small">✅ QR Code Menus</li>
                <li className="text-muted small">✅ Digital Order Management</li>
                <li className="text-muted small">✅ Live Order Dashboard</li>
                <li className="text-muted small">✅ Analytics & Sales Tracking</li>
              </ul>
            </div>
            {/* App / Info */}
            <div className="col-12 col-md-3">
              <h6 className="fw-bold text-dark mb-3">Coming Soon</h6>
              <p className="text-muted small">Download our mobile app to manage your menu and orders on the go.</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center text-muted small">
            © {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd. · Made with ❤️ in India
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;