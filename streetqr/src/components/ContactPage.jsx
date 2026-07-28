import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, TrendingUp, Mail, ArrowRight, Twitter, Linkedin, Github, Instagram, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const contactCards = [
    { icon: <LifeBuoy size={24} />, title: 'Support', email: 'help@qzaar.com', desc: 'Typical reply in 2 hours' },
    { icon: <TrendingUp size={24} />, title: 'Sales', email: 'sales@qzaar.com', desc: 'Talk to our team' },
    { icon: <Mail size={24} />, title: 'General', email: 'hello@qzaar.com', desc: 'For everything else' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <main>
        {/* HERO */}
        <section className="contact-hero">
          <div className="container">
            <motion.div 
              className="contact-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Get in touch with us</h1>
              <p>We're here to help you build a better restaurant experience. Our team responds quickly.</p>
            </motion.div>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="contact-cards-section">
          <div className="container">
            <div className="contact-cards">
              {contactCards.map((card, index) => (
                <motion.div 
                  className="contact-card"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="contact-card-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <a href={`mailto:${card.email}`} className="contact-email">{card.email}</a>
                  <p>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="contact-main-section">
          <div className="container">
            <div className="contact-grid">
              
              {/* FORM */}
              <motion.div 
                className="contact-form-container"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="glass-form-card">
                  <h2>Send us a message</h2>
                  <AnimatePresence>
                    {submitted ? (
                      <motion.div 
                        className="success-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle2 size={48} className="success-icon" />
                        <h3>Message sent!</h3>
                        <p>We've received your message and will get back to you shortly.</p>
                        <button className="btn-secondary mt-4" onClick={() => setSubmitted(false)}>Send another</button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={`form-group ${focusedField === 'name' || formData.name ? 'focused' : ''}`}>
                          <label htmlFor="name">Full Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            required 
                          />
                        </div>
                        
                        <div className={`form-group ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
                          <label htmlFor="email">Email Address</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required 
                          />
                        </div>

                        <div className={`form-group ${focusedField === 'subject' || formData.subject ? 'focused' : ''}`}>
                          <label htmlFor="subject">Subject</label>
                          <select 
                            id="subject" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('subject')}
                            onBlur={() => setFocusedField(null)}
                            required
                          >
                            <option value="" disabled hidden></option>
                            <option value="support">Support</option>
                            <option value="sales">Sales & Pricing</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className={`form-group ${focusedField === 'message' || formData.message ? 'focused' : ''}`}>
                          <label htmlFor="message">Message</label>
                          <textarea 
                            id="message" 
                            name="message" 
                            rows="4"
                            value={formData.message} 
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            required 
                          ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">
                          Send Message <ArrowRight size={18} />
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* MAP & SOCIAL */}
              <motion.div 
                className="contact-sidebar"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="map-card">
                  <div className="fake-map">
                    <div className="map-grid"></div>
                    <div className="map-pin">
                      <div className="pin-dot"></div>
                      <div className="pin-pulse"></div>
                    </div>
                    <div className="map-label">Qzaar HQ, Bangalore, India</div>
                  </div>
                </div>

                <div className="social-card">
                  <h3>Connect with us</h3>
                  <div className="social-links">
                    <a href="#" className="social-icon twitter"><Twitter size={20} /></a>
                    <a href="#" className="social-icon linkedin"><Linkedin size={20} /></a>
                    <a href="#" className="social-icon github"><Github size={20} /></a>
                    <a href="#" className="social-icon instagram"><Instagram size={20} /></a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
