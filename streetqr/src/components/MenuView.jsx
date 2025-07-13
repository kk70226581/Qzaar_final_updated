import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuView.css'; // New custom CSS for the professional design

function MenuView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [shop, setShop] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:5000/api/menu/${id}`)
      .then(res => {
        if (res.data.success) {
          setMenuData(res.data.menu);
          setShop({
            logo: res.data.logo,
            shopName: res.data.shopName,
            openHours: res.data.openHours,
            address: res.data.address
          });
          setError(null);
        } else {
          setError("Failed to load menu. Please try again.");
        }
      })
      .catch(() => {
        setError("Failed to load menu. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleAddToCart = (item, quantity = 1) => {
    const existingItem = selectedItems.find(i => i.name === item.name);
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity }]);
    }
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) {
      setSelectedItems(prev => prev.filter(i => i.name !== itemName));
    } else {
      setSelectedItems(prev =>
        prev.map(item =>
          item.name === itemName ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getItemQuantity = (itemName) => selectedItems.find(item => item.name === itemName)?.quantity || 0;
  const getTotal = () => selectedItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);
  const getTotalItems = () => selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName || !tableNumber || selectedItems.length === 0) {
      alert("Please fill in all required fields and select items.");
      return;
    }
    const orderPayload = {
      shopId: id,
      customerName,
      tableNumber,
      items: selectedItems,
      total: getTotal()
    };
    try {
      const res = await axios.post("http://localhost:5000/api/order", orderPayload);
      if (res.data.success) {
        navigate("/order-summary", {
          state: { ...orderPayload, orderId: res.data.orderId }
        });
      }
    } catch {
      alert("Order failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="menu-container">
      {/* Sticky Header */}
      <header className="menu-header">
        <div className="shop-info">
          {shop.logo && (
            <img src={shop.logo} alt="Shop Logo" className="shop-logo" />
          )}
          <div className="shop-details">
            <h1 className="shop-name">{shop.shopName || "Restaurant Name"}</h1>
            <p className="shop-address">{shop.address || "Address not available"}</p>
          </div>
        </div>
      </header>

      {/* Main Content Area (Menu & Cart) */}
      <div className="menu-main">
        {/* Menu Items Section */}
        <div className="menu-section">
          {Object.entries(menuData).map(([category, items]) => (
            <div key={category} className="menu-category">
              <h2 className="category-title">{category}</h2>
              <div className="menu-items-grid">
                {items.map(item => {
                  const itemQuantity = getItemQuantity(item.name);
                  return (
                    <div key={item.name} className="menu-item-card">
                      {item.image && (
                        <div className="item-image-wrapper">
                          <img src={item.image} alt={item.name} className="item-image" />
                        </div>
                      )}
                      <div className="item-card-content">
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-remarks">{item.remarks}</p>
                          <p className="item-price">₹{Number(item.price).toFixed(2)}</p>
                        </div>
                        {itemQuantity > 0 ? (
                          <div className="quantity-controls">
                            <button className="btn-qty" onClick={() => updateQuantity(item.name, itemQuantity - 1)}>-</button>
                            <span className="qty-value">{itemQuantity}</span>
                            <button className="btn-qty" onClick={() => updateQuantity(item.name, itemQuantity + 1)}>+</button>
                          </div>
                        ) : (
                          <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Section */}
        <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h2 className="cart-title">Your Order</h2>
            <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
          </div>
          <div className="customer-inputs">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          <ul className="cart-items-list">
            {selectedItems.length === 0 ? (
              <p className="empty-cart">No items selected.</p>
            ) : (
              selectedItems.map(item => (
                <li key={item.name} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">₹{Number(item.price).toFixed(2)}</span>
                  </div>
                  <div className="item-controls">
                    <button className="btn-qty" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="btn-qty" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="cart-footer">
            <div className="total-row">
              <span className="total-label">Total:</span>
              <span className="total-amount">₹{getTotal().toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn" disabled={selectedItems.length === 0}>
              Checkout Order
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {selectedItems.length > 0 && !isCartOpen && (
        <button className="mobile-floating-cart" onClick={() => setIsCartOpen(true)}>
          <span className="item-count">{getTotalItems()} Items</span>
          <span className="view-cart-text">View Cart</span>
          <span className="cart-total">₹{getTotal().toFixed(2)}</span>
        </button>
      )}

      {/* Footer */}
      <footer className="menu-footer">
        <p>Powered by **Qzaar Technologies Pvt. Ltd.**</p>
      </footer>
    </div>
  );
}

export default MenuView;