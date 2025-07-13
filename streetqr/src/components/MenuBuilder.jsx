// ✅ MenuBuilder.jsx (Shopkeeper Menu Builder Only, Vercel-ready with env variable)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const categories = ["Breakfast", "Lunch", "Brunch", "Dinner"];

function MenuBuilder() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || "");
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || '');
  const [openHours, setOpenHours] = useState(localStorage.getItem("openHours") || '');
  const [address, setAddress] = useState(localStorage.getItem("address") || '');
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isLoggedIn || !shopId) {
      navigate("/");
      return;
    }
    loadMenu(shopId);
  }, [isLoggedIn, shopId]);

  const loadMenu = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/menu/${id}`);
      if (res.data.success) {
        const loadedItems = [];
        for (const cat in res.data.menu) {
          res.data.menu[cat].forEach(item => {
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
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: "", remarks: "", category: "Breakfast", image: "" }]);
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
      if (!groupedData[item.category]) groupedData[item.category] = [];
      groupedData[item.category].push({
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
      <Navbar />
      <br />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-success">🍽️ Menu Builder</h2>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">🔓 Logout</button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => {
              setShopName(e.target.value);
              localStorage.setItem("shopName", e.target.value);
            }}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Open Hours (e.g. 9 AM - 10 PM)"
            value={openHours}
            onChange={(e) => {
              setOpenHours(e.target.value);
              localStorage.setItem("openHours", e.target.value);
            }}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              localStorage.setItem("address", e.target.value);
            }}
            className="form-control"
          />
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="card mb-3 border-success">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleChange(idx, "price", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    placeholder="Remarks"
                    value={item.remarks}
                    onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <select
                    value={item.category}
                    onChange={(e) => handleChange(idx, "category", e.target.value)}
                    className="form-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <input
                    placeholder="Image URL (optional)"
                    value={item.image || ''}
                    onChange={(e) => handleChange(idx, "image", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <button onClick={() => removeItem(idx)} className="btn btn-link text-danger mt-2">❌ Remove Item</button>
            </div>
          </div>
        ))}

        <div className="d-flex gap-3 justify-content-center mb-5">
          <button onClick={addItem} className="btn btn-outline-primary">➕ Add Item</button>
          <button onClick={handleSubmit} className="btn btn-success">🚀 Submit Menu</button>
        </div>

        <div className="text-center">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/orders')}>📦 View Orders Page</button>
        </div>
      </div>
    </>
  );
}

export default MenuBuilder;
