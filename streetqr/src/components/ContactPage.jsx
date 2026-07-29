import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './ContactPage.css';

// Public project details intentionally live in code so the contact page works
// on every static deployment without requiring frontend environment variables.
const contactEmail = 'iit2023129@iiita.ac.in';
const contactPhone = '+91-7348112368';
const contactLocation = 'Gorakhpur, Uttar Pradesh';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [mailClientOpened, setMailClientOpened] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!contactEmail) return;

    const subject = `[Qzaar] ${formData.subject}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMailClientOpened(true);
  };

  return (
    <div className="contact-page">
      <Navbar />
      <main>
        <section className="contact-hero">
          <div className="container">
            <motion.div className="contact-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="contact-eyebrow">PROJECT CONTACT</span>
              <h1>Contact Qzaar</h1>
              <p>{contactEmail || contactPhone ? 'Reach out with a product question, feedback, or collaboration idea.' : 'A public contact channel has not been configured yet.'}</p>
            </motion.div>
          </div>
        </section>

        {(contactEmail || contactPhone || contactLocation) && (
          <section className="contact-cards-section">
            <div className="container">
              <div className="contact-cards">
                {contactEmail && <motion.article className="contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="contact-card-icon"><Mail size={24} /></div>
                  <h3>Email</h3>
                  <a href={`mailto:${contactEmail}`} className="contact-email">{contactEmail}</a>
                  <p>Product questions and feedback.</p>
                </motion.article>}
                {contactPhone && <motion.article className="contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <div className="contact-card-icon"><Phone size={24} /></div>
                  <h3>Phone</h3>
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="contact-email">{contactPhone}</a>
                  <p>Available via the verified project contact.</p>
                </motion.article>}
                {contactLocation && <motion.article className="contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div className="contact-card-icon"><MapPin size={24} /></div>
                  <h3>Location</h3>
                  <p className="contact-email">{contactLocation}</p>
                  <p>Project location.</p>
                </motion.article>}
              </div>
            </div>
          </section>
        )}

        <section className="contact-main-section">
          <div className="container">
            <div className="contact-grid contact-grid--single">
              <motion.div className="contact-form-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="glass-form-card">
                  <span className="contact-form-eyebrow">GET IN TOUCH</span>
                  <h2>{contactEmail ? 'Start a conversation' : 'Contact channel unavailable'}</h2>
                  {contactEmail ? (
                    <AnimatePresence mode="wait">
                      {mailClientOpened ? (
                        <motion.div className="success-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                          <CheckCircle2 size={48} className="success-icon" />
                          <h3>Your email app should be open</h3>
                          <p>Review the pre-filled message in your email app and send it when you are ready.</p>
                          <button className="btn-secondary mt-4" onClick={() => setMailClientOpened(false)}>Write another message</button>
                        </motion.div>
                      ) : (
                        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className={`form-group ${focusedField === 'name' || formData.name ? 'focused' : ''}`}>
                            <label htmlFor="name">Full name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required />
                          </div>
                          <div className={`form-group ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
                            <label htmlFor="email">Email address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required />
                          </div>
                          <div className={`form-group ${focusedField === 'subject' || formData.subject ? 'focused' : ''}`}>
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)} required />
                          </div>
                          <div className={`form-group ${focusedField === 'message' || formData.message ? 'focused' : ''}`}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleInputChange} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} required />
                          </div>
                          <button type="submit" className="submit-btn">Continue in email <Send size={18} /></button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  ) : <p className="contact-unavailable">Set <code>REACT_APP_CONTACT_EMAIL</code> in the frontend environment to publish a real contact address. No placeholder email, address, or social profile is shown.</p>}
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
