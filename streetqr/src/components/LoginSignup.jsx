// src/components/LoginSignup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function LoginSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'danger'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Use environment variable if set, otherwise fallback to the backend URL
 const API_BASE = "https://streetqr-backend.onrender.com";

  // create axios instance so we can set withCredentials if needed later
  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const showMessage = (msg, type = "danger", timeout = 3500) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, timeout);
  };

  const handleAuth = async () => {
    if (loading) return;
    if (!email || !password) {
      showMessage("Please enter both email and password.", "danger");
      return;
    }
    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address.", "danger");
      return;
    }
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long.", "danger");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/signup" : "/api/login";
      const res = await api.post(endpoint, { email, password });

      if (res?.data?.success) {
        const userId = res.data.userId;
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("shopId", userId);
        localStorage.setItem("email", email);
        showMessage(
          isSignup ? "Signup successful! Redirecting..." : "Login successful! Redirecting...",
          "success",
          1500
        );
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        // backend returned success: false with message
        showMessage(res?.data?.message || "Authentication failed", "danger");
      }
    } catch (err) {
      // better error message handling
      if (err.response && err.response.data && err.response.data.message) {
        showMessage(err.response.data.message, "danger");
      } else if (err.message && err.message.includes("Network Error")) {
        showMessage("Network error: cannot reach backend. Check URL or server.", "danger");
      } else {
        showMessage("Server error. Please try again.", "danger");
      }
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const userEmail = prompt("Enter your registered email:");
    if (!userEmail || !validateEmail(userEmail)) {
      showMessage("Enter a valid email address.", "danger");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/forgot-password", { email: userEmail });
      if (res?.data?.success) {
        showMessage("Password reset link sent to your email.", "success");
      } else {
        showMessage(res?.data?.message || "Error sending reset email.", "danger");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.data?.message) {
        showMessage(error.response.data.message, "danger");
      } else {
        showMessage("Server error. Try again later.", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
        <div className="card shadow-lg p-4 border-0 rounded-3" style={{ maxWidth: 420, width: "100%" }}>
          <div className="text-center mb-4">
            <h1 className="fw-bold text-primary">🍽️ Qzaar</h1>
            <p className="text-muted small mb-0">India’s #1 Street Food Ordering Platform</p>
            <h4 className="mt-3 fw-bold">{isSignup ? "Create an Account" : "Login to Continue"}</h4>
          </div>

          {message && (
            <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage("")} aria-label="Close"></button>
            </div>
          )}

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
            <label htmlFor="floatingEmail">Email address</label>
          </div>

          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          {!isSignup && (
            <div className="mb-3 text-end">
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-primary"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            className="btn btn-primary w-100 mb-2 rounded-pill py-2"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
          </button>

          <p
            className="text-center text-primary text-decoration-underline small mt-3"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>

          <p className="text-center text-muted small mt-4">© {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd.</p>

          {/* debug line (optional) */}
          {/* <small className="text-muted">API: {API_BASE}</small> */}
        </div>
      </div>
    </>
  );
}