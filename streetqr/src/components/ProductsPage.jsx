import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, BarChart3, Bell, CheckCircle2, ChefHat, Clock, Globe, Image, Languages, List, QrCode, RefreshCw, ShieldCheck, Smartphone, Star, TrendingUp, Users, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './ProductsPage.css';

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState('qrMenu');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const tabs = [
    { id: 'qrMenu', label: 'QR Menu', icon: <QrCode size={18} /> },
    { id: 'kitchen', label: 'Kitchen Display', icon: <ChefHat size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> }
  ];

  return (
    <div className="products-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="products-hero pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="hero-background"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <Zap size={14} className="text-accent-500" />
              <span>The Complete Restaurant Toolkit</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight max-w-4xl">
              Every tool your restaurant needs, in <span className="text-gradient">one platform.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
              From scanning menus to tracking sales, Qzaar provides a seamless experience for your guests and a powerful management system for you.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link to="/signup" className="btn btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all transform hover:scale-105">
                Start for free <ArrowRight size={18} />
              </Link>
              <Link to="/demo" className="btn btn-secondary flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                Book a demo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating background icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <motion.div className="absolute top-[20%] left-[10%] text-white" animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><QrCode size={48} /></motion.div>
            <motion.div className="absolute top-[30%] right-[15%] text-accent-500" animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}><ChefHat size={56} /></motion.div>
            <motion.div className="absolute bottom-[20%] left-[20%] text-blue-400" animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}><BarChart3 size={40} /></motion.div>
            <motion.div className="absolute top-[60%] right-[25%] text-green-400" animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}><Smartphone size={50} /></motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4">Powerful products that work together</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">Seamlessly integrated tools designed specifically for modern restaurants.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute inset-0 bg-slate-100 rounded-lg -z-10 border border-slate-200 shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'qrMenu' && (
                <motion.div
                  key="qrMenu"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="order-2 lg:order-1 space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-ink-900 mb-2">Digital QR Menus</h3>
                      <p className="text-ink-600 text-lg">Create beautiful, interactive digital menus that your guests will love. Update instantly without reprinting.</p>
                    </div>
                    
                    <ul className="space-y-4">
                      {[
                        { title: 'Instant QR generation', icon: <QrCode className="text-blue-500" /> },
                        { title: 'Beautiful menu layouts', icon: <Image className="text-blue-500" /> },
                        { title: 'Real-time updates', icon: <RefreshCw className="text-blue-500" /> },
                        { title: 'Category management', icon: <List className="text-blue-500" /> },
                        { title: 'Multi-language support', icon: <Languages className="text-blue-500" /> },
                        { title: 'Dietary badging', icon: <ShieldCheck className="text-blue-500" /> },
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <div className="p-2 bg-blue-50 rounded-md">
                            {feature.icon}
                          </div>
                          <span className="font-medium text-ink-800">{feature.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 lg:order-2 flex justify-center">
                    <div className="phone-mockup">
                       <div className="phone-screen bg-slate-50">
                          {/* Menu Mockup UI */}
                          <div className="h-48 bg-blue-600 rounded-b-3xl p-6 text-white flex flex-col justify-end">
                            <h4 className="text-2xl font-bold">Bistro Q</h4>
                            <p className="text-blue-100 text-sm">Italian & Mediterranean</p>
                          </div>
                          <div className="p-4 space-y-4 -mt-6">
                             <div className="bg-white rounded-xl p-4 shadow-sm">
                                <h5 className="font-bold text-ink-900 mb-2">Starters</h5>
                                <div className="space-y-3">
                                   <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                      <div>
                                         <p className="font-medium text-ink-800 text-sm">Truffle Fries</p>
                                         <p className="text-xs text-ink-500 mt-1">Crispy fries with truffle oil</p>
                                      </div>
                                      <span className="font-medium text-ink-900 text-sm">$8.00</span>
                                   </div>
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <p className="font-medium text-ink-800 text-sm">Calamari</p>
                                         <p className="text-xs text-ink-500 mt-1">Lightly breaded squid</p>
                                      </div>
                                      <span className="font-medium text-ink-900 text-sm">$12.00</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'kitchen' && (
                <motion.div
                  key="kitchen"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="order-2 lg:order-2 space-y-8">
                     <div>
                      <h3 className="text-2xl font-bold text-ink-900 mb-2">Kitchen Display System</h3>
                      <p className="text-ink-600 text-lg">Streamline your kitchen operations. Send orders directly from tables to the kitchen in real-time.</p>
                    </div>
                    
                    <ul className="space-y-4">
                      {[
                        { title: 'Live order queue', icon: <Clock className="text-orange-500" /> },
                        { title: 'Priority sorting', icon: <Star className="text-orange-500" /> },
                        { title: 'Timer alerts', icon: <Bell className="text-orange-500" /> },
                        { title: 'Status updates', icon: <Activity className="text-orange-500" /> },
                        { title: 'Sound notifications', icon: <Zap className="text-orange-500" /> },
                        { title: 'Multi-station support', icon: <Users className="text-orange-500" /> },
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <div className="p-2 bg-orange-50 rounded-md">
                            {feature.icon}
                          </div>
                          <span className="font-medium text-ink-800">{feature.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 lg:order-1 flex justify-center">
                    <div className="kds-mockup bg-ink-900 rounded-xl p-4 shadow-2xl border border-ink-800 w-full max-w-md relative overflow-hidden">
                       <div className="flex justify-between items-center mb-4 border-b border-ink-800 pb-2">
                          <h4 className="text-white font-bold flex items-center gap-2"><ChefHat size={20} className="text-orange-500" /> Kitchen Display</h4>
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">2 Delayed</span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          {/* Ticket 1 */}
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-lg p-3 shadow-sm border-t-4 border-t-orange-500"
                          >
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-ink-900">Table 4</span>
                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">04:23</span>
                             </div>
                             <ul className="text-sm space-y-1 mb-3 text-ink-800">
                                <li>1x Truffle Fries</li>
                                <li>2x Classic Burger</li>
                                <li className="text-red-500 text-xs pl-2">- No onions</li>
                             </ul>
                             <button className="w-full bg-slate-100 hover:bg-slate-200 text-ink-700 text-xs font-semibold py-1.5 rounded transition-colors">Complete</button>
                          </motion.div>
                          
                          {/* Ticket 2 */}
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="bg-white rounded-lg p-3 shadow-sm border-t-4 border-t-blue-500"
                          >
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-ink-900">Table 12</span>
                                <span className="text-xs font-medium text-ink-500 bg-slate-100 px-1.5 py-0.5 rounded">01:15</span>
                             </div>
                             <ul className="text-sm space-y-1 mb-3 text-ink-800">
                                <li>1x Caesar Salad</li>
                                <li>1x Margherita Pizza</li>
                             </ul>
                             <button className="w-full bg-slate-100 hover:bg-slate-200 text-ink-700 text-xs font-semibold py-1.5 rounded transition-colors">Complete</button>
                          </motion.div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="order-2 lg:order-1 space-y-8">
                     <div>
                      <h3 className="text-2xl font-bold text-ink-900 mb-2">Insights & Analytics</h3>
                      <p className="text-ink-600 text-lg">Make data-driven decisions to grow your business. Track sales, popular items, and staff performance.</p>
                    </div>
                    
                    <ul className="space-y-4">
                      {[
                        { title: 'Sales tracking', icon: <TrendingUp className="text-teal-500" /> },
                        { title: 'Popular items', icon: <Star className="text-teal-500" /> },
                        { title: 'Peak hour analysis', icon: <Clock className="text-teal-500" /> },
                        { title: 'Customer retention', icon: <Users className="text-teal-500" /> },
                        { title: 'Exportable reports', icon: <List className="text-teal-500" /> },
                        { title: 'Multi-location stats', icon: <Globe className="text-teal-500" /> },
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <div className="p-2 bg-teal-50 rounded-md">
                            {feature.icon}
                          </div>
                          <span className="font-medium text-ink-800">{feature.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="order-1 lg:order-2 flex justify-center">
                    <div className="analytics-mockup bg-white rounded-xl p-6 shadow-xl border border-slate-200 w-full max-w-md">
                       <div className="mb-6 flex justify-between items-end">
                          <div>
                             <p className="text-sm font-medium text-ink-500 mb-1">Total Revenue</p>
                             <h4 className="text-3xl font-bold text-ink-900">$12,450</h4>
                          </div>
                          <span className="flex items-center text-sm font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">
                             <TrendingUp size={14} className="mr-1" /> +14.5%
                          </span>
                       </div>
                       
                       {/* Bar Chart Mockup */}
                       <div className="h-40 flex items-end gap-2 mb-6 border-b border-slate-100 pb-2">
                          {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                             <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                                <motion.div 
                                  initial={{ height: 0 }} 
                                  animate={{ height: `${height}%` }} 
                                  transition={{ duration: 0.8, delay: i * 0.1 }}
                                  className="w-full bg-teal-100 group-hover:bg-teal-200 rounded-t-sm transition-colors relative"
                                >
                                   <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 rounded-t-sm"></div>
                                </motion.div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <p className="text-xs text-ink-500 mb-1">Top Item</p>
                             <p className="font-semibold text-ink-800 text-sm">Truffle Fries</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <p className="text-xs text-ink-500 mb-1">Orders</p>
                             <p className="font-semibold text-ink-800 text-sm">342</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4">Why choose Qzaar?</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">See how we stack up against traditional restaurant management methods.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 sm:p-6 font-semibold text-ink-900 border-b border-slate-200 w-1/3">Features</th>
                  <th className="p-4 sm:p-6 font-semibold text-ink-600 border-b border-slate-200 text-center w-1/3">Traditional Methods</th>
                  <th className="p-4 sm:p-6 font-bold text-accent-600 border-b border-slate-200 text-center w-1/3 bg-orange-50/50">Qzaar Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { feature: 'Setup time', trad: 'Weeks or months', qzaar: 'Minutes' },
                  { feature: 'Cost', trad: 'High upfront & maintenance', qzaar: 'Low, predictable subscription' },
                  { feature: 'Order accuracy', trad: <X className="mx-auto text-red-500" size={20} />, qzaar: <CheckCircle2 className="mx-auto text-green-500" size={20} /> },
                  { feature: 'Real-time updates', trad: <X className="mx-auto text-red-500" size={20} />, qzaar: <CheckCircle2 className="mx-auto text-green-500" size={20} /> },
                  { feature: 'Analytics', trad: 'Manual calculation', qzaar: 'Automated insights' },
                  { feature: 'Guest experience', trad: 'Wait times & confusion', qzaar: 'Seamless & interactive' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-6 font-medium text-ink-800">{row.feature}</td>
                    <td className="p-4 sm:p-6 text-ink-500 text-center">{row.trad}</td>
                    <td className="p-4 sm:p-6 font-medium text-ink-900 text-center bg-orange-50/30">{row.qzaar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4">Simple, transparent pricing.</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">Start for free, upgrade when you need to.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Free Plan */}
             <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                   <h3 className="text-2xl font-bold text-ink-900">Starter</h3>
                   <div className="mt-4 flex items-baseline text-5xl font-extrabold text-ink-900">
                      $0
                      <span className="ml-1 text-xl font-medium text-ink-500">/mo</span>
                   </div>
                   <p className="mt-4 text-ink-600">Everything you need to get started.</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                   {['1 Location', 'Digital QR Menu', 'Up to 50 items', 'Basic analytics', 'Email support'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                         <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                         <span className="text-ink-700">{feature}</span>
                      </li>
                   ))}
                </ul>
                
                <Link to="/signup" className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-ink-900 font-semibold rounded-lg text-center transition-colors">
                   Get Started Free
                </Link>
             </div>
             
             {/* Pro Plan */}
             <div className="bg-ink-950 rounded-2xl p-8 border border-ink-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                <div className="mb-6">
                   <h3 className="text-2xl font-bold text-white flex items-center gap-2">Pro <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full border border-white/20">Coming soon</span></h3>
                   <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                      $49
                      <span className="ml-1 text-xl font-medium text-ink-400">/mo</span>
                   </div>
                   <p className="mt-4 text-ink-300">Advanced features for growing restaurants.</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                   {['Unlimited Locations', 'Kitchen Display System', 'Unlimited items', 'Advanced analytics', 'Priority 24/7 support'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                         <CheckCircle2 size={18} className="text-accent-500 flex-shrink-0" />
                         <span className="text-ink-200">{feature}</span>
                      </li>
                   ))}
                </ul>
                
                <button disabled className="block w-full py-3 px-4 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-lg text-center transition-colors opacity-80 cursor-not-allowed">
                   Join Waitlist
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-gradient py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Start building your restaurant today</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of restaurants using Qzaar to streamline their operations.</p>
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-900 font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
            Create your free account <ArrowRight size={20} />
          </Link>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
