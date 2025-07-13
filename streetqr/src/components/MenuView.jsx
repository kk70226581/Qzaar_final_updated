import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API}/api/menu/${id}`)
      .then(res => {
        if (res.data.success) {
          setMenuData(res.data.menu);
          setShop({
            logo: res.data.logo,
            shopName: res.data.shopName,
            openHours: res.data.openHours,
            address: res.data.address
            // You will need to add a line for ownerName if your API provides it
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

  const getItemQuantity = (itemName) =>
    selectedItems.find(item => item.name === itemName)?.quantity || 0;

  const getTotal = () =>
    selectedItems.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0);

  const getTotalItems = () =>
    selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = async () => {
    setIsPlacingOrder(true);
    
    if (!customerName || !tableNumber || selectedItems.length === 0) {
      alert("Please fill in all required fields and select items.");
      setIsPlacingOrder(false);
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
      const res = await axios.post(`${API}/api/order`, orderPayload);
      if (res.data.success) {
        navigate("/order-summary", {
          state: { ...orderPayload, orderId: res.data.orderId }
        });
      }
    } catch {
      alert("Order failed. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state-clean">
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-state-clean">{error}</div>;
  }

  return (
    <div className="menu-container-clean">
      <header className="menu-header-clean">
        <div className="shop-info-clean">
          {shop.logo && (
            <img src={shop.logo} alt="Shop Logo" className="shop-logo-clean" />
          )}
          <div className="shop-details-clean">
            <h1 className="shop-name-clean">{shop.shopName || "Restaurant Name"}</h1>
            <p className="shop-owner-clean">{"Owner's Name Here"}</p>
            <p className="shop-address-clean">{shop.address || "Address not available"}</p>
          </div>
        </div>
      </header>

      <div className="menu-main-clean">
        <div className="menu-section-clean">
          {Object.entries(menuData).map(([category, items]) => (
            <div key={category} className="menu-category-clean">
              <h2 className="category-title-clean">{category}</h2>
              <div className="menu-items-grid-clean">
                {items.map(item => {
                  const itemQuantity = getItemQuantity(item.name);
                  return (
                    <div key={item.name} className="menu-item-card-clean">
                      {item.image && (
                        <div className="item-image-wrapper-clean">
                          <img src={item.image} alt={item.name} className="item-image-clean" />
                        </div>
                      )}
                      <div className="item-card-content-clean">
                        <div className="item-details-clean">
                          <h4 className="item-name-clean">{item.name}</h4>
                          <p className="item-remarks-clean">{item.remarks}</p>
                          <p className="item-price-clean">₹{Number(item.price).toFixed(2)}</p>
                        </div>
                        {itemQuantity > 0 ? (
                          <div className="quantity-controls-clean">
                            <button className="btn-qty-clean" onClick={() => updateQuantity(item.name, itemQuantity - 1)}>-</button>
                            <span className="qty-value-clean">{item.quantity}</span>
                            <button className="btn-qty-clean" onClick={() => updateQuantity(item.name, itemQuantity + 1)}>+</button>
                          </div>
                        ) : (
                          <button className="add-to-cart-btn-clean" onClick={() => handleAddToCart(item)}>
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

        <div className={`cart-panel-clean ${isCartOpen ? 'open' : ''}`}>
          <div className="cart-header-clean">
            <h2 className="cart-title-clean">Your Order</h2>
            <button className="close-cart-btn-clean" onClick={() => setIsCartOpen(false)}>&times;</button>
          </div>

          <div className="customer-inputs-clean">
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

          <ul className="cart-items-list-clean">
            {selectedItems.length === 0 ? (
              <p className="empty-cart-clean">No items selected.</p>
            ) : (
              selectedItems.map(item => (
                <li key={item.name} className="cart-item-clean">
                  <div className="cart-item-info-clean">
                    <span className="cart-item-name-clean">{item.name}</span>
                    <span className="cart-item-price-clean">₹{Number(item.price).toFixed(2)}</span>
                  </div>
                  <div className="item-controls-clean">
                    <button className="btn-qty-clean" onClick={() => updateQuantity(item.name, item.quantity - 1)}>-</button>
                    <span className="qty-value-clean">{item.quantity}</span>
                    <button className="btn-qty-clean" onClick={() => updateQuantity(item.name, item.quantity + 1)}>+</button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="cart-footer-clean">
            <div className="total-row-clean">
              <span className="total-label-clean">Total:</span>
              <span className="total-amount-clean">₹{getTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              className="checkout-btn-clean" 
              disabled={isPlacingOrder || selectedItems.length === 0}
            >
              {isPlacingOrder ? 'Processing...' : 'Checkout Order'}
            </button>
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && !isCartOpen && (
        <button className="mobile-floating-cart-clean" onClick={() => setIsCartOpen(true)}>
          <span className="item-count-clean">{getTotalItems()} Items</span>
          <span className="view-cart-text-clean">View Cart</span>
          <span className="cart-total-clean">₹{getTotal().toFixed(2)}</span>
        </button>
      )}
      
      {isCartOpen && (
        <div className="cart-backdrop-clean" onClick={() => setIsCartOpen(false)}></div>
      )}

      <footer className="menu-footer-clean">
        <p>Powered by <strong>Qzaar Technologies Pvt. Ltd.</strong></p>
      </footer>

      <style jsx>{`
        /* --- General Styling & Layout --- */
        .menu-container-clean {
          font-family: 'Poppins', sans-serif;
          background-color: #F8F0E3;
          color: #4A3B31;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .menu-main-clean {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          padding: 2rem 1.5rem;
          flex-grow: 1;
        }

        /* --- Header --- */
        .menu-header-clean {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: #FCF8F5;
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .shop-info-clean {
          display: flex;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
        }

        .shop-logo-clean {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 1.5rem;
          border: 2px solid #FF9500;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .shop-details-clean {
          line-height: 1.2;
        }

        .shop-name-clean {
          font-size: 2rem;
          font-weight: 700;
          color: #4A3B31;
          margin: 0;
        }
        
        .shop-owner-clean {
            font-size: 1rem;
            color: #8C7B71;
            font-weight: 500;
            margin: 0;
        }

        .shop-address-clean {
          font-size: 0.9rem;
          color: #8C7B71;
          margin: 0;
        }

        /* --- Menu Items Section --- */
        .menu-section-clean {
          flex-grow: 1;
          max-width: 1000px;
        }

        .category-title-clean {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #4A3B31;
          border-left: 5px solid #FF9500;
          padding-left: 1rem;
        }

        .menu-items-grid-clean {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .menu-item-card-clean {
          background-color: #FCF8F5;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
        }

        .menu-item-card-clean:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .item-image-wrapper-clean {
          width: 100%;
          padding-bottom: 75%;
          position: relative;
          overflow: hidden;
        }

        .item-image-clean {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .item-card-content-clean {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
        }

        .item-name-clean {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #4A3B31;
        }

        .item-remarks-clean {
          font-size: 0.95rem;
          color: #8C7B71;
          margin: 0 0 1rem 0;
        }

        .item-price-clean {
          font-size: 1.4rem;
          font-weight: 700;
          color: #FF9500;
          margin: 0;
        }

        .add-to-cart-btn-clean {
          background-color: #FF9500;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
          margin-top: 1rem;
        }

        .add-to-cart-btn-clean:hover {
          background-color: #E68500;
          transform: translateY(-2px);
        }

        .quantity-controls-clean {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-qty-clean {
          background-color: transparent;
          border: 2px solid #FF9500;
          color: #FF9500;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .btn-qty-clean:hover {
          background-color: #FF9500;
          color: white;
        }

        .qty-value-clean {
          font-size: 1.2rem;
          font-weight: bold;
          min-width: 25px;
          text-align: center;
        }

        /* --- Cart Panel --- */
        .menu-main-clean > .cart-panel-clean {
          position: sticky;
          top: 9rem;
          width: 350px;
          min-width: 300px;
          background-color: #FCF8F5;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          height: fit-content;
          z-index: 99;
        }
        
        .cart-backdrop-clean {
            display: none;
        }

        .cart-header-clean {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #E0E0E0;
          padding-bottom: 1rem;
        }

        .cart-title-clean {
          font-size: 1.75rem;
          font-weight: 700;
          color: #4A3B31;
          margin: 0;
        }
        
        .customer-inputs-clean {
          margin-bottom: 1.5rem;
        }
        
        .customer-inputs-clean input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          color: #4A3B31;
          background-color: #fcfcfc;
        }
        
        .customer-inputs-clean input::placeholder {
            color: #8C7B71;
        }

        .cart-items-list-clean {
          list-style: none;
          padding: 0;
          margin: 0;
          border-bottom: 1px dashed #ddd;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .cart-item-clean {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
        }
        
        .cart-item-clean:last-child {
            border-bottom: none;
        }
        
        .cart-item-info-clean {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 1rem;
        }
        
        .cart-item-name-clean {
            font-size: 1.1rem;
            font-weight: 500;
            color: #4A3B31;
        }
        
        .cart-item-price-clean {
            font-size: 1rem;
            font-weight: bold;
            color: #FF9500;
        }
        
        .item-controls-clean .btn-qty-clean {
            width: 30px;
            height: 30px;
            font-size: 1.2rem;
        }

        .empty-cart-clean {
          text-align: center;
          color: #8C7B71;
          font-style: italic;
          padding: 2rem;
        }

        .cart-footer-clean {
          padding-top: 1rem;
        }

        .total-row-clean {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .total-label-clean {
          color: #4A3B31;
        }

        .total-amount-clean {
          color: #FF9500;
        }

        .checkout-btn-clean {
          width: 100%;
          background-color: #FF9500;
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 50px;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .checkout-btn-clean:hover {
          background-color: #E68500;
          transform: translateY(-2px);
        }
        
        .checkout-btn-clean:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        /* --- Footer --- */
        .menu-footer-clean {
          text-align: center;
          background-color: #FCF8F5;
          color: #8C7B71;
          padding: 1rem 0;
          margin-top: auto;
        }
        
        /* --- Mobile Floating Cart --- */
        .mobile-floating-cart-clean {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4A3B31;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          border: none;
          z-index: 10000;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px) translateX(-50%); }
            to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        
        .item-count-clean, .cart-total-clean {
            font-weight: 700;
        }
        
        .view-cart-text-clean {
            font-weight: 500;
            color: #FF9500;
        }

        /* --- Responsive Design --- */
        @media (max-width: 1024px) {
            .menu-main-clean {
                flex-direction: column;
                gap: 1.5rem;
            }
            .menu-main-clean > .cart-panel-clean {
                position: relative;
                width: 100%;
                top: 0;
            }
        }
        
        @media (max-width: 768px) {
            .shop-logo-clean {
                height: 50px;
                width: 50px;
            }
            .shop-name-clean {
                font-size: 1.75rem;
            }
            .menu-items-grid-clean {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .item-image-wrapper-clean {
                padding-bottom: 75%;
            }

            .menu-main-clean {
                padding: 1rem; /* Adjust padding for a wider feel */
            }
            
            .menu-main-clean > .cart-panel-clean {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                padding: 1.5rem;
                border-radius: 0;
                box-shadow: none;
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.4s ease-in-out;
                overflow-y: auto;
            }
            
            .menu-main-clean > .cart-panel-clean.open {
                transform: translateX(0);
            }
            
            .cart-backdrop-clean {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: block;
            }
        }
      `}</style>
    </div>
  );
}

export default MenuView;