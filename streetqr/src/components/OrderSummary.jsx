import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuView.css';

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from the state passed by the menu page
  const { customerName, tableNumber, items, total, orderId, shopId } = location.state || {};

  // Redirect if no order data is available
  if (!location.state) {
    navigate('/');
    return null;
  }

  const handleConfirmOrder = () => {
    alert("Order confirmed! Please pay with cash at the counter.");
  };

  const handleGoBack = () => {
    navigate(`/menu/${shopId}`);
  };

  return (
    <div className="order-summary-page-container">
      <div className="order-summary-card">
        <h2 className="summary-title">Thank You for Your Order!</h2>
        <div className="summary-section confirmation-details">
          <p className="order-id">Order ID: **#{orderId}**</p>
          <p className="order-message">Your order has been placed successfully. The kitchen has been notified and is preparing your items.</p>
        </div>

        <div className="summary-section customer-details">
          <p><strong>Customer Name:</strong> {customerName}</p>
          <p><strong>Table Number:</strong> {tableNumber}</p>
          <p><strong>Estimated Prep Time:</strong> 15-20 minutes</p>
        </div>

        <div className="summary-section order-items-review">
          <h3 className="section-heading">Order Summary</h3>
          <ul className="order-items-list-review">
            {items.map(item => (
              <li key={item.name} className="cart-item">
                <span className="item-name-review">{item.name}</span>
                <span className="item-qty-review">x {item.quantity}</span>
                <span className="item-price-review">₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-section order-total-review">
          <span className="total-label-review">Total Amount:</span>
          <span className="total-amount-review">₹{total.toFixed(2)}</span>
        </div>

        

        <button className="go-back-btn" onClick={handleGoBack}>
          Start a New Order
        </button>
        
        <p className="contact-info">
          For any issues, please contact us at: <a href="tel:+919876543210">+91 98765 43210</a>
        </p>
      </div>

      <footer className="professional-footer">
        <p className="footer-company-name">Qzaar Technologies Pvt. Ltd.</p>
      </footer>
    </div>
  );
}

export default OrderSummary;