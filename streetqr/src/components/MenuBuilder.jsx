import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const categories = ["Breakfast", "Lunch", "Brunch", "Dinner"];

function MenuBuilder() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || "");
  const [shopName, setShopName] = useState(''); // Initialized as empty string
  const [openHours, setOpenHours] = useState(''); // Initialized as empty string
  const [address, setAddress] = useState(''); // Initialized as empty string
  const navigate = useNavigate();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", remarks: "", category: "Breakfast", image: "" });

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isLoggedIn || !shopId) {
      navigate("/");
      return;
    }
    loadMenu(shopId);
  }, [isLoggedIn, shopId, navigate]);

  const loadMenu = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/menu/${id}`);
      if (res.data.success) {
        // Load shop details from the database
        setShopName(res.data.shopName || '');
        setOpenHours(res.data.openHours || '');
        setAddress(res.data.address || '');

        const loadedItems = [];
        for (const cat in res.data.menu) {
          res.data.menu[`${cat}`]?.forEach(item => {
            loadedItems.push({ ...item, category: cat });
          });
        }
        setItems(loadedItems);
      }
    } catch (err) {
      alert("Failed to load menu.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setItems([]);
    setShopId("");
    navigate("/");
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[`${index}`][field] = value;
    setItems(updatedItems);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [`${field}`]: value }));
  };

  const addItemToList = () => {
    setItems([...items, newItem]);
    setNewItem({ name: "", price: "", remarks: "", category: "Breakfast", image: "" });
    setIsAddingItem(false);
  };

  const cancelAddItem = () => {
    setIsAddingItem(false);
    setNewItem({ name: "", price: "", remarks: "", category: "Breakfast", image: "" });
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      alert("Add at least one item.");
      return;
    }

    const groupedData = {};
    items.forEach(item => {
      if (!groupedData[`${item.category}`]) groupedData[`${item.category}`] = [];
      groupedData[`${item.category}`].push({
        name: item.name,
        price: item.price,
        remarks: item.remarks,
        image: item.image
      });
    });

    try {
      const res = await axios.post(`${API_BASE}/api/menu/${shopId}`, {
        menu: groupedData,
        shopName,
        openHours,
        address
      });

      if (res.data.success) {
        localStorage.setItem("qr_id", res.data._id);
        alert("Menu submitted successfully.");
        navigate("/qrcode", { state: { id: res.data._id } });
      } else {
        alert("Failed to submit menu.");
      }
    } catch (err) {
      alert("Menu save failed.");
    }
  };

  return (
    <>
      <Navbar showAuthLinks={false} />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-success">🍽️ Menu Builder</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">🔓 Logout</button>
        </div>
        
        <p className="text-muted mb-4">
          Fill in your shop details and add your menu items below. To add an image to an item, simply copy and paste the direct image URL into the Image URL field.
        </p>

        {/* Shop Details */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white fw-bold">Shop Details</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="Open Hours (e.g. 9 AM - 10 PM)"
                  value={openHours}
                  onChange={(e) => {
                    setOpenHours(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  placeholder="Address (optional)"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add New Item Section */}
        <div className="mb-4">
          {!isAddingItem ? (
            <button onClick={() => setIsAddingItem(true)} className="btn btn-outline-primary btn-lg fw-bold">➕ Add New Item</button>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body row g-3 align-items-center">
                <div className="col-sm-3">
                  <input
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => handleNewItemChange("name", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-2">
                  <input
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => handleNewItemChange("price", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-3">
                  <select
                    value={newItem.category}
                    onChange={(e) => handleNewItemChange("category", e.target.value)}
                    className="form-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4">
                  <input
                    placeholder="Image URL (optional)"
                    value={newItem.image}
                    onChange={(e) => handleNewItemChange("image", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-auto">
                  <button onClick={addItemToList} className="btn btn-success fw-bold">💾 Save</button>
                </div>
                <div className="col-auto">
                  <button onClick={cancelAddItem} className="btn btn-outline-secondary">❌ Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items List */}
        <h3 className="fw-bold text-success mb-3">Current Menu Items</h3>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-4">
                    <input
                      value={item.name}
                      onChange={(e) => handleChange(idx, "name", e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-3">
                    <input
                      value={item.price}
                      onChange={(e) => handleChange(idx, "price", e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-3">
                    <select
                      value={item.category}
                      onChange={(e) => handleChange(idx, "category", e.target.value)}
                      className="form-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-2 text-end">
                    <button onClick={() => removeItem(idx)} className="btn btn-outline-danger btn-sm">🗑️ Remove</button>
                  </div>
                  <div className="col-12">
                    <input
                      placeholder="Image URL (optional)"
                      value={item.image || ''}
                      onChange={(e) => handleChange(idx, "image", e.target.value)}
                      className="form-control mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Submit Button */}
        {items.length > 0 && (
          <div className="d-flex justify-content-center mt-5">
            <button onClick={handleSubmit} className="btn btn-success btn-lg fw-bold">🚀 Save & Publish All Changes</button>
          </div>
        )}

        <div className="text-center mt-5">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/orders')}>📦 View Orders Page</button>
        </div>
      </div>
    </>
  );
}

export default MenuBuilder;