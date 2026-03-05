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
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const API_BASE = "https://streetqr-backend.onrender.com";

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
      showMessage("Enter a valid email.", "danger");
      return;
    }

    try {
      const endpoint = isSignup ? "/api/signup" : "/api/login";

      const res = await axios.post(`${API_BASE}${endpoint}`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("shopId", res.data.userId);
        localStorage.setItem("email", email);

        showMessage("Login successful!", "success");

        setTimeout(() => {
          navigate("/menu");
        }, 1000);
      } else {
        showMessage(res.data.message || "Authentication failed", "danger");
      }
    } catch (err) {
      console.error(err);
      showMessage("Server error. Try again.", "danger");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
          <h3 className="text-center mb-3">
            {isSignup ? "Sign Up" : "Login"}
          </h3>

          {message && (
            <div className={`alert alert-${messageType}`}>
              {message}
            </div>
          )}

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100" onClick={handleAuth}>
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p
            className="text-center mt-3 text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>
    </>
  );
}