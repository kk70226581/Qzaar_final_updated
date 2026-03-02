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

  // Use env var if set, otherwise fallback to your working backend
  // Ensure no trailing slash so endpoint joining is safe
  const rawApi = process.env.REACT_APP_API_URL || "https://streetqr-backend.onrender.com";
  const API_BASE = rawApi.replace(/\/+$/, "");

  const buildUrl = (endpoint) => {
    if (!endpoint) return API_BASE;
    return endpoint.startsWith("/") ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const showMessage = (msg, type = "info", timeout = 3000) => {
    setMessage(msg);
    setMessageType(type);
    if (timeout > 0) {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, timeout);
    }
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
      showMessage("Password must be at least 6 characters long.", "danger");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/signup" : "/api/login";
      const url = buildUrl(endpoint);

      const res = await axios.post(url, { email, password });

      // prefer a boolean success flag from backend; adapt if your backend uses different shape
      if (res?.data?.success) {
        const userId = res.data.userId ?? res.data.id ?? res.data._id;
        localStorage.setItem("loggedIn", "true");
        if (userId) localStorage.setItem("shopId", userId);
        localStorage.setItem("email", email);

        showMessage(isSignup ? "Signup successful! Redirecting..." : "Login successful! Redirecting...", "success", 2000);
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        // backend may return message
        const serverMsg = res?.data?.message || "Authentication failed. Check credentials.";
        showMessage(serverMsg, "danger");
      }
    } catch (err) {
      console.error("Auth error:", err);

      // Better error messages: prefer server response if present
      if (err?.response?.data?.message) {
        showMessage(err.response.data.message, "danger");
      } else if (err?.response) {
        showMessage(`Server error: ${err.response.status} ${err.response.statusText}`, "danger");
      } else {
        showMessage("Network error or server not reachable. Check API URL.", "danger");
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

    setLoading(true);
    try {
      const url = buildUrl("/api/forgot-password");
      const res = await axios.post(url, { email: userEmail });

      if (res?.data?.success) {
        showMessage("Password reset link sent to your email.", "success");
      } else {
        showMessage(res?.data?.message || "Error sending reset email.", "danger");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error?.response?.data?.message) {
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
        <div className="card shadow-lg p-4 border-0 rounded-3" style={{ maxWidth: "420px", width: "100%" }}>
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
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
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
            type="button"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isSignup ? "Signing up..." : "Logging in..."}
              </>
            ) : (
              <>{isSignup ? "Sign Up" : "Login"}</>
            )}
          </button>

          <p
            className="text-center text-primary text-decoration-underline small mt-3"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>

          <p className="text-center text-muted small mt-4">© {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd.</p>
        </div>
      </div>
    </>
  );
}

export default LoginSignup;