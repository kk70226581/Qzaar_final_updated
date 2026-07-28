import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Heart, Lightbulb, Search, Activity, Linkedin } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutPage.css';

const AboutPage = () => {
  const timelineEvents = [
    { year: '2023', title: 'Identified the problem', desc: 'Restaurateurs struggling with disjointed ordering systems.' },
    { year: '2024', title: 'Built the first QR menu system', desc: 'Our MVP helped 50+ local restaurants survive.' },
    { year: '2024', title: 'Added live kitchen display', desc: 'Connecting front-of-house to back-of-house seamlessly.' },
    { year: '2025', title: 'Launched analytics dashboard', desc: 'Giving owners real actionable data.' },
  ];

  const values = [
    { icon: <Zap size={24} />, title: 'Simplicity', desc: 'Complex problems deserve elegant, intuitive solutions.' },
    { icon: <Activity size={24} />, title: 'Speed', desc: 'In a kitchen, every second counts.' },
    { icon: <Shield size={24} />, title: 'Reliability', desc: 'Rock-solid infrastructure when it matters most.' },
    { icon: <Heart size={24} />, title: 'Empathy', desc: 'We build for humans, not just businesses.' },
    { icon: <Lightbulb size={24} />, title: 'Innovation', desc: 'Constantly rethinking the status quo.' },
    { icon: <Search size={24} />, title: 'Transparency', desc: 'Open communication with our partners and users.' },
  ];

  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', bio: 'Former restaurateur turned tech builder.', initials: 'AC', color: '#f59e0b' },
    { name: 'Priya Sharma', role: 'Head of Design', bio: 'Creating beautiful, functional experiences.', initials: 'PS', color: '#f97316' },
    { name: 'Marcus Lee', role: 'Lead Engineer', bio: 'Architecting robust, scalable systems.', initials: 'ML', color: '#3b82f6' },
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <main>
        {/* HERO */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-content">
              <motion.div 
                className="about-hero-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1>We build tools that make restaurant service feel more human.</h1>
                <p>Technology should disappear into the background, letting hospitality take center stage. Qzaar is built by people who love food, for people who serve it.</p>
              </motion.div>
              
              <motion.div 
                className="about-hero-art"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="art-circle art-circle-1"></div>
                <div className="art-circle art-circle-2"></div>
                <div className="art-circle art-circle-3"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="about-timeline-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Journey</h2>
              <p>How we got to where we are today.</p>
            </div>
            
            <div className="timeline-container">
              {timelineEvents.map((item, index) => (
                <motion.div 
                  className="timeline-item"
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h3 className="timeline-title">{item.title}</h3>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-values-section">
          <div className="container">
            <div className="section-header">
              <h2>What Drives Us</h2>
              <p>The principles that guide every feature we build.</p>
            </div>
            
            <div className="values-grid">
              {values.map((val, index) => (
                <motion.div 
                  className="value-card"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="value-icon">{val.icon}</div>
                  <h3>{val.title}</h3>
                  <p>{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="about-team-section">
          <div className="container">
            <div className="section-header">
              <h2>Built with heart</h2>
              <p>Meet the people behind the platform.</p>
            </div>
            
            <div className="team-grid">
              {team.map((member, index) => (
                <motion.div 
                  className="team-card"
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="team-avatar" style={{ '--avatar-color': member.color }}>
                    {member.initials}
                  </div>
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-bio">{member.bio}</p>
                  <button className="linkedin-btn"><Linkedin size={18} /></button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Every great restaurant deserves great technology.</h2>
              <div className="cta-buttons">
                <button className="btn-primary">
                  Join us <ArrowRight size={18} />
                </button>
                <button className="btn-secondary">View openings</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
