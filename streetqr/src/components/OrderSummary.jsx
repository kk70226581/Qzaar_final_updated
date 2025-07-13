import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    customerName, 
    tableNumber, 
    items, 
    total, 
    orderId, 
    shopId, 
    shopName, 
    shopAddress 
  } = location.state || {};

  const engagementMessages = [
    "Did you know our chef uses a family recipe that's been passed down for generations?",
    "We use only the freshest, locally sourced ingredients to create every dish!",
    "Follow us on Instagram for behind-the-scenes content and special offers!",
    "Sign up for our loyalty program and get a free drink on your next visit!",
    "Our team is hard at work making your delicious meal. We appreciate your patience!"
  ];

  const [currentMessage, setCurrentMessage] = useState(engagementMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const messageTimer = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % engagementMessages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(messageTimer);
  }, [location.state, navigate]);

  useEffect(() => {
    setCurrentMessage(engagementMessages[messageIndex]);
  }, [messageIndex]);

  const handleGoBack = () => {
    navigate(`/menu/${shopId}`);
  };

  const handleShareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Order from ${shopName}`,
          text: `Just placed an amazing order at ${shopName}! Order ID: #${orderId}. Check out their menu!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert(`Order #${orderId} from ${shopName} details have been copied. You can share them manually.`);
      navigator.clipboard.writeText(`My order from ${shopName}, Order ID: #${orderId}, Total: ₹${total.toFixed(2)}.`);
    }
  };

  if (!location.state) {
    return null;
  }

  return (
    <div className="order-page-container">
      <div className="order-card">
        <header className="card-header">
          <div className="restaurant-info">
            <h1 className="restaurant-name">{shopName}</h1>
            {shopAddress && <p className="restaurant-address">{shopAddress}</p>}
          </div>
          <div className="confirmation-banner">
            <p className="confirmed-text">Order Confirmed</p>
          </div>
        </header>

        <section className="order-details-section">
          <div className="detail-item">
            <span className="detail-label">Order ID</span>
            <span className="detail-value order-id">#{orderId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Table Number</span>
            <span className="detail-value">{tableNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Customer Name</span>
            <span className="detail-value">{customerName}</span>
          </div>
        </section>

        <section className="engagement-section">
          <p className="engagement-message">{currentMessage}</p>
        </section>

        <section className="order-items-section">
          <h2 className="section-heading">Order Summary</h2>
          <ul className="order-items-list">
            {items.map(item => (
              <li key={item.name} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">x {item.quantity}</span>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="total-and-actions">
          <div className="total-row">
            <span className="total-label">Total Amount:</span>
            <span className="total-amount">₹{total.toFixed(2)}</span>
          </div>
          
          <button className="secondary-btn" onClick={handleGoBack}>
            Start New Order
          </button>
          
          <button className="secondary-btn" onClick={handleShareOrder}>
            Share Order with Friends
          </button>
          
          <a href="tel:+919876543210" className="support-call-btn">
            Have a Question? Call Us
          </a>
        </section>
      </div>

      <footer className="footer">
        <div className="company-info">
            <p className="company-brand">Qzaar Technologies Pvt. Ltd.</p>
        </div>
        <div className="cross-promotion">
            <p className="cross-promo-text">Looking for a future-ready education?</p>
            <a 
              href="https://www.qzaar.com/school" 
              className="cross-promo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore our school system!
            </a>
        </div>
      </footer>
      <style jsx>{`
        .order-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background-color: #F8F0E3;
          font-family: 'Poppins', sans-serif;
          color: #4A3B31;
          padding: 2rem 1rem;
        }
        .order-card {
          background-color: #FCF8F5;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          max-width: 550px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #E0E0E0;
        }
        .restaurant-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .restaurant-name {
          font-size: 2.5rem;
          font-weight: 700;
          color: #4A3B31;
          margin: 0;
        }
        .restaurant-address {
          font-size: 0.9rem;
          color: #8C7B71;
          margin: 0.25rem 0 0;
        }
        .confirmation-banner {
          width: 100%;
          background-color: #E6F7E9;
          padding: 1rem;
          border-radius: 8px;
        }
        .confirmed-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: #4CAF50;
          margin: 0;
        }
        .order-details-section,
        .engagement-section,
        .order-items-section,
        .total-and-actions {
          width: 100%;
        }
        .order-details-section,
        .order-items-section,
        .total-and-actions {
          padding-bottom: 2rem;
          border-bottom: 1px dashed #dcdcdc;
        }
        .order-details-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          text-align: left;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .detail-label {
          color: #8C7B71;
          font-size: 0.9rem;
        }
        .detail-value {
          font-weight: 500;
          font-size: 1rem;
        }
        .order-id {
          font-size: 1.2rem;
          font-weight: 700;
          color: #FF9500;
        }
        .engagement-section {
          background-color: #F0F8FF;
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid #cceeff;
        }
        .engagement-message {
          font-size: 1.1rem;
          font-style: italic;
          color: #34495E;
          margin: 0;
          animation: fadeIn 1s ease-in-out;
        }
        .section-heading {
          font-size: 1.2rem;
          font-weight: 600;
          color: #4A3B31;
          margin-bottom: 1rem;
        }
        .order-items-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          font-size: 1rem;
          border-bottom: 1px solid #eee;
        }
        .order-item:last-child {
          border-bottom: none;
        }
        .item-name {
          font-weight: 500;
          flex-grow: 1;
        }
        .item-qty {
          font-style: italic;
          color: #8C7B71;
          margin: 0 1rem;
        }
        .item-price {
          font-weight: 700;
          color: #FF9500;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .total-label {
          color: #4A3B31;
        }
        .total-amount {
          color: #FF9500;
        }
        .secondary-btn,
        .support-call-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
          text-decoration: none;
          display: block;
          text-align: center;
        }
        .secondary-btn {
          background-color: #4A3B31;
          color: white;
        }
        .secondary-btn:hover {
          background-color: #3b2f27;
        }
        .support-call-btn {
          border: 1px solid #FF9500;
          color: #FF9500;
          background-color: transparent;
        }
        .support-call-btn:hover {
          background-color: #fffaf2;
        }
        .footer {
          text-align: center;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 550px;
        }
        .company-info, .cross-promotion {
            padding: 1rem;
            background-color: #4A3B31;
            border-radius: 10px;
        }
        .company-brand {
            font-size: 1rem;
            color: #dcdcdc;
            margin: 0;
        }
        .cross-promotion {
            background-color: #FF9500;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .cross-promo-text {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        .cross-promo-link {
            background-color: white;
            color: #FF9500;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        .cross-promo-link:hover {
            background-color: #f0f0f0;
        }
        @media (max-width: 550px) {
          .order-card {
            padding: 1.5rem;
          }
          .restaurant-name {
            font-size: 2rem;
          }
          .order-details-section {
            grid-template-columns: 1fr;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default OrderSummary;