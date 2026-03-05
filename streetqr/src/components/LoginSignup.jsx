// src/components/LoginSignup.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function LoginSignup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Your backend
  const API_BASE = "https://updated-ver.onrender.com";

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleAuth = async () => {

    if (!email || !password) {
      showMessage("Please enter both email and password.", "danger");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address.", "danger");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "danger");
      return;
    }

    try {

      setLoading(true);

      const endpoint = isSignup ? "/api/signup" : "/api/login";

      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (res.data.success) {

        const userId = res.data.userId;

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("shopId", userId);
        localStorage.setItem("email", email);

        showMessage(
          isSignup
            ? "Signup successful! Redirecting..."
            : "Login successful! Redirecting...",
          "success"
        );

        setTimeout(() => {
          navigate("/menu");
        }, 1000);

      } else {
        showMessage(res.data.message || "Authentication failed", "danger");
      }

    } catch (err) {

      console.error("Auth error:", err);

      if (err.message === "Network Error") {
        showMessage("Cannot connect to server.", "danger");
      } else {
        showMessage("Server error. Please try again.", "danger");
      }

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

    try {

      const res = await axios.post(
        `${API_BASE}/api/forgot-password`,
        { email: userEmail }
      );

      if (res.data.success) {
        showMessage("Password reset link sent to your email.", "success");
      } else {
        showMessage(res.data.message || "Error sending reset email.", "danger");
      }

    } catch (error) {

      console.error("Forgot password error:", error);
      showMessage("Server error. Try again later.", "danger");

    }
  };

  return (
    <>
      <Navbar />

      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">

        <div className="card shadow-lg p-4 border-0 rounded-3"
          style={{ maxWidth: "420px", width: "100%" }}>

          <div className="text-center mb-4">
            <h1 className="fw-bold text-primary">🍽️ Qzaar</h1>
            <p className="text-muted small mb-0">
              India’s #1 Street Food Ordering Platform
            </p>

            <h4 className="mt-3 fw-bold">
              {isSignup ? "Create an Account" : "Login to Continue"}
            </h4>
          </div>

          {message && (
            <div className={`alert alert-${messageType}`} role="alert">
              {message}
            </div>
          )}

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email address</label>
          </div>

          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {!isSignup && (
            <div className="mb-3 text-end">
              <button
                className="btn btn-link p-0 small text-primary"
                onClick={handleForgotPassword}
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
            {loading
              ? "Please wait..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>

          <p
            className="text-center text-primary text-decoration-underline small mt-3"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>

          <p className="text-center text-muted small mt-4">
            © {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd.
          </p>

        </div>

      </div>
    </>
  );
}

export default LoginSignup;