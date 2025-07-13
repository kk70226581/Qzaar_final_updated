import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API = process.env.REACT_APP_API_URL;

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setMessage("Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/reset-password/${token}`, { password });
      if (res.data.success) {
        setSuccess(true);
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("❌ " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
        <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: '100%' }}>
          <h3 className="text-center mb-3">🔐 Reset Password</h3>

          {message && (
            <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message}
            </div>
          )}

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              id="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="newPassword">New Password</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              id="confirmPassword"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button className="btn btn-primary w-100" onClick={handleReset}>
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
