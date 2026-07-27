import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Clock,
  DollarSign,
  Bell,
  MapPin,
  Save,
  AlertCircle,
} from 'lucide-react';
import {
  ModernCard,
  ModernButton,
  ModernInput,
} from '../ui';
import AdminLayout from '../layout/AdminLayout';
import '../../styles/pages/SettingsPage.css';

/**
 * SettingsPage - Restaurant admin settings
 * 
 * Features:
 * - Restaurant profile settings
 * - Operating hours configuration
 * - Payment method settings
 * - Notification preferences
 * - Staff management
 * - Delivery settings
 * - Tax and fee configuration
 * - Account security
 */

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    restaurantName: 'Food Haven Restaurant',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@foodhaven.com',
    phone: '+91-9876543210',
    address: '123 Main Street, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    description: 'Authentic Indian cuisine with modern twist',
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '10:00 AM', close: '10:00 PM', closed: false },
    tuesday: { open: '10:00 AM', close: '10:00 PM', closed: false },
    wednesday: { open: '10:00 AM', close: '10:00 PM', closed: false },
    thursday: { open: '10:00 AM', close: '10:00 PM', closed: false },
    friday: { open: '10:00 AM', close: '10:00 PM', closed: false },
    saturday: { open: '10:00 AM', close: '11:00 PM', closed: false },
    sunday: { open: '11:00 AM', close: '10:00 PM', closed: false },
  });

  const [paymentSettings, setPaymentSettings] = useState({
    creditCard: true,
    debitCard: true,
    upi: true,
    wallet: true,
    cashOnDelivery: true,
    bankTransfer: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    staffMessages: true,
    promotionalOffers: false,
    customerReviews: true,
    systemAlerts: true,
  });

  const [deliverySettings, setDeliverySettings] = useState({
    minOrderValue: 250,
    deliveryChargeFlat: 30,
    freeDeliveryAbove: 1000,
    estimatedTime: '30-40 mins',
    maxDeliveryRadius: '5 km',
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <Store size={18} /> },
    { id: 'hours', label: 'Hours', icon: <Clock size={18} /> },
    { id: 'payment', label: 'Payment', icon: <DollarSign size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'delivery', label: 'Delivery', icon: <MapPin size={18} /> },
  ];

  return (
    <AdminLayout title="System Settings">
      <motion.div
        className="settings"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="settings__container-inner">
        <motion.div className="settings__hero" variants={itemVariants}>
          <div>
            <p className="settings__eyebrow"><span /> Workspace preferences</p>
            <h2>Make Qzaar work your way.</h2>
            <p>Manage your restaurant details, service hours, payment methods and alerts.</p>
          </div>
          <div className="settings__secure-note"><span>✓</span><div><strong>Changes are protected</strong><small>Saved preferences apply to your workspace</small></div></div>
        </motion.div>
        {/* TABS */}
        <nav className="settings__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings__tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <motion.div
          className="settings__content"
          key={activeTab}
          variants={itemVariants}
        >
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="settings__tab-content">
              <ModernCard variant="elevated">
                <div className="settings__card-header">
                  <h2 className="settings__card-title">Restaurant Profile</h2>
                  <ModernButton
                    variant={isEditing ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="settings__loading-spinner" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    ) : (
                      <>Edit</>
                    )}
                  </ModernButton>
                </div>

                <div className="settings__form-grid">
                  <div className="settings__form-row">
                    <div className="settings__form-group">
                      <label className="settings__label">Restaurant Name</label>
                      <ModernInput
                        type="text"
                        value={profileForm.restaurantName}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          restaurantName: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="Restaurant name"
                      />
                    </div>
                    <div className="settings__form-group">
                      <label className="settings__label">Owner Name</label>
                      <ModernInput
                        type="text"
                        value={profileForm.ownerName}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          ownerName: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="Owner name"
                      />
                    </div>
                  </div>

                  <div className="settings__form-row">
                    <div className="settings__form-group">
                      <label className="settings__label">Email</label>
                      <ModernInput
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="Email address"
                      />
                    </div>
                    <div className="settings__form-group">
                      <label className="settings__label">Phone</label>
                      <ModernInput
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Address</label>
                    <ModernInput
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        address: e.target.value,
                      })}
                      disabled={!isEditing}
                      placeholder="Full address"
                    />
                  </div>

                  <div className="settings__form-row">
                    <div className="settings__form-group">
                      <label className="settings__label">City</label>
                      <ModernInput
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          city: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="City"
                      />
                    </div>
                    <div className="settings__form-group">
                      <label className="settings__label">State</label>
                      <ModernInput
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          state: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="State"
                      />
                    </div>
                    <div className="settings__form-group">
                      <label className="settings__label">Pincode</label>
                      <ModernInput
                        type="text"
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          pincode: e.target.value,
                        })}
                        disabled={!isEditing}
                        placeholder="Pincode"
                      />
                    </div>
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Description</label>
                    <textarea
                      className="settings__textarea"
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({
                        ...profileForm,
                        description: e.target.value,
                      })}
                      disabled={!isEditing}
                      placeholder="Restaurant description"
                      rows="4"
                    />
                  </div>
                </div>
              </ModernCard>
            </div>
          )}

          {/* OPERATING HOURS TAB */}
          {activeTab === 'hours' && (
            <div className="settings__tab-content">
              <ModernCard variant="elevated">
                <h2 className="settings__card-title">Operating Hours</h2>

                <div className="settings__hours-grid">
                  {Object.entries(operatingHours).map(([day, hours]) => (
                    <div key={day} className="settings__hour-item">
                      <div className="settings__hour-day">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </div>
                      <div className="settings__hour-inputs">
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => setOperatingHours({
                            ...operatingHours,
                            [day]: { ...hours, open: e.target.value },
                          })}
                          disabled={hours.closed}
                          className="settings__time-input"
                        />
                        <span className="settings__hour-separator">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => setOperatingHours({
                            ...operatingHours,
                            [day]: { ...hours, close: e.target.value },
                          })}
                          disabled={hours.closed}
                          className="settings__time-input"
                        />
                      </div>
                      <label className="settings__closed-label">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => setOperatingHours({
                            ...operatingHours,
                            [day]: { ...hours, closed: e.target.checked },
                          })}
                        />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>

                <div className="settings__alert">
                  <AlertCircle size={18} />
                  <p>Operating hours are displayed on the customer menu page</p>
                </div>

                <ModernButton variant="primary" size="md" className="settings__save-btn">
                  Save Hours
                </ModernButton>
              </ModernCard>
            </div>
          )}

          {/* PAYMENT METHODS TAB */}
          {activeTab === 'payment' && (
            <div className="settings__tab-content">
              <ModernCard variant="elevated">
                <h2 className="settings__card-title">Payment Methods</h2>

                <div className="settings__payment-list">
                  {Object.entries(paymentSettings).map(([method, enabled]) => (
                    <div key={method} className="settings__payment-item">
                      <div className="settings__payment-info">
                        <h3 className="settings__payment-name">
                          {method === 'creditCard' && 'Credit Card'}
                          {method === 'debitCard' && 'Debit Card'}
                          {method === 'upi' && 'UPI'}
                          {method === 'wallet' && 'Digital Wallet'}
                          {method === 'cashOnDelivery' && 'Cash on Delivery'}
                          {method === 'bankTransfer' && 'Bank Transfer'}
                        </h3>
                        <p className="settings__payment-desc">
                          {enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <label className="settings__toggle">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            [method]: e.target.checked,
                          })}
                        />
                        <span className="settings__toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="settings__tab-content">
              <ModernCard variant="elevated">
                <h2 className="settings__card-title">Notification Preferences</h2>

                <div className="settings__notifications-list">
                  {Object.entries(notificationSettings).map(([type, enabled]) => (
                    <div key={type} className="settings__notification-item">
                      <div className="settings__notification-info">
                        <h3 className="settings__notification-name">
                          {type === 'newOrders' && 'New Orders'}
                          {type === 'orderUpdates' && 'Order Updates'}
                          {type === 'lowStock' && 'Low Stock Alerts'}
                          {type === 'staffMessages' && 'Staff Messages'}
                          {type === 'promotionalOffers' && 'Promotional Offers'}
                          {type === 'customerReviews' && 'Customer Reviews'}
                          {type === 'systemAlerts' && 'System Alerts'}
                        </h3>
                        <p className="settings__notification-desc">
                          {enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <label className="settings__toggle">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [type]: e.target.checked,
                          })}
                        />
                        <span className="settings__toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>
          )}

          {/* DELIVERY SETTINGS TAB */}
          {activeTab === 'delivery' && (
            <div className="settings__tab-content">
              <ModernCard variant="elevated">
                <h2 className="settings__card-title">Delivery Settings</h2>

                <div className="settings__form-grid">
                  <div className="settings__form-group">
                    <label className="settings__label">Minimum Order Value (₹)</label>
                    <ModernInput
                      type="number"
                      value={deliverySettings.minOrderValue}
                      onChange={(e) => setDeliverySettings({
                        ...deliverySettings,
                        minOrderValue: parseInt(e.target.value),
                      })}
                      placeholder="Minimum order value"
                    />
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Delivery Charge (₹)</label>
                    <ModernInput
                      type="number"
                      value={deliverySettings.deliveryChargeFlat}
                      onChange={(e) => setDeliverySettings({
                        ...deliverySettings,
                        deliveryChargeFlat: parseInt(e.target.value),
                      })}
                      placeholder="Delivery charge"
                    />
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Free Delivery Above (₹)</label>
                    <ModernInput
                      type="number"
                      value={deliverySettings.freeDeliveryAbove}
                      onChange={(e) => setDeliverySettings({
                        ...deliverySettings,
                        freeDeliveryAbove: parseInt(e.target.value),
                      })}
                      placeholder="Free delivery threshold"
                    />
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Estimated Delivery Time</label>
                    <ModernInput
                      type="text"
                      value={deliverySettings.estimatedTime}
                      onChange={(e) => setDeliverySettings({
                        ...deliverySettings,
                        estimatedTime: e.target.value,
                      })}
                      placeholder="e.g., 30-40 mins"
                    />
                  </div>

                  <div className="settings__form-group">
                    <label className="settings__label">Max Delivery Radius</label>
                    <ModernInput
                      type="text"
                      value={deliverySettings.maxDeliveryRadius}
                      onChange={(e) => setDeliverySettings({
                        ...deliverySettings,
                        maxDeliveryRadius: e.target.value,
                      })}
                      placeholder="e.g., 5 km"
                    />
                  </div>
                </div>

                <ModernButton variant="primary" size="md" className="settings__save-btn">
                  Save Delivery Settings
                </ModernButton>
              </ModernCard>
            </div>
          )}
        </motion.div>
      </div>
      </motion.div>
    </AdminLayout>
  );
};




export default SettingsPage;
