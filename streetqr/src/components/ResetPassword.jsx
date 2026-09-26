import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function ResetPassword() {
  const { token: urlParamToken } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryToken = new URLSearchParams(location.search).get('token');
  const [tokenInput, setTokenInput] = useState(urlParamToken || queryToken || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score <= 1) return 'Basic';
    if (score <= 3) return 'Good';
    return 'Strong';
  }, [password]);

  const handleReset = async () => {
    const activeToken = String(tokenInput || '').trim();
    if (!activeToken) {
      setMessage('Reset token is missing. Please enter your reset token or code.');
      return;
    }
    if (!password || !confirm) {
      setMessage('Please fill all password fields.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      let response;
      // 1. Try URL param endpoint
      try {
        response = await axios.post(`${API}/api/reset-password/${encodeURIComponent(activeToken)}`, { password });
      } catch (paramErr) {
        if (paramErr.response?.status === 404) {
          // 2. Fallback to body-payload endpoint
          response = await axios.post(`${API}/api/reset-password`, {
            resetToken: activeToken,
            token: activeToken,
            password
          });
        } else {
          throw paramErr;
        }
      }

      if (response && response.data && response.data.success) {
        setSuccess(true);
        setMessage('Password reset successful! Redirecting to login...');
        window.setTimeout(() => navigate('/login'), 1800);
      } else {
        setMessage(response?.data?.message || 'Could not reset password.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Server error. Please verify your token and try again.';
      setMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100 py-5 px-3" style={{ background: 'linear-gradient(180deg, #fff9f3 0%, #fffdf9 100%)' }}>
        <div className="container">
          <div className="mx-auto rounded-5 border bg-white shadow-lg p-4 p-md-5" style={{ maxWidth: 860 }}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="text-uppercase fw-bold small text-warning-emphasis mb-3">Secure reset flow</div>
                <h1 className="display-6 fw-bold mb-3">Create a stronger password and get back into your dashboard.</h1>
                <p className="text-muted mb-4">
                  This reset screen verifies your secure time-limited token and applies your new encrypted credentials instantly.
                </p>
                <div className="rounded-4 border bg-light p-4">
                  <div className="d-flex align-items-center gap-2 fw-bold mb-2">
                    <ShieldCheck size={18} />
                    Password checklist
                  </div>
                  <div className="small text-muted">Use at least 6 characters, include a number or special character, and avoid reusing old passwords.</div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="rounded-4 border p-4">
                  <h2 className="h3 fw-bold mb-3">Reset password</h2>

                  {message && (
                    <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">
                      {message}
                    </div>
                  )}

                  <div className="d-grid gap-3">
                    {!urlParamToken && (
                      <label>
                        <span className="d-block fw-semibold mb-2">Reset Token or Code</span>
                        <div className="d-flex align-items-center gap-2 border rounded-4 px-3 py-2">
                          <KeyRound size={16} />
                          <input
                            type="text"
                            className="form-control border-0 shadow-none p-0"
                            value={tokenInput}
                            onChange={(event) => setTokenInput(event.target.value)}
                            placeholder="Paste your reset token here"
                          />
                        </div>
                      </label>
                    )}

                    <label>
                      <span className="d-block fw-semibold mb-2">New password</span>
                      <div className="d-flex align-items-center gap-2 border rounded-4 px-3 py-2">
                        <Lock size={16} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control border-0 shadow-none p-0"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Enter new password"
                        />
                        <button type="button" className="btn btn-sm" onClick={() => setShowPassword((current) => !current)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </label>

                    <label>
                      <span className="d-block fw-semibold mb-2">Confirm password</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control rounded-4 py-3"
                        value={confirm}
                        onChange={(event) => setConfirm(event.target.value)}
                        placeholder="Repeat your new password"
                      />
                    </label>

                    <div className="rounded-4 bg-light px-3 py-3">
                      <div className="small text-muted">Password strength</div>
                      <strong>{password ? strength : 'Start typing'}</strong>
                    </div>

                    <button className="btn btn-dark rounded-pill py-3" onClick={handleReset} disabled={isSubmitting}>
                      {isSubmitting ? 'Updating password...' : 'Reset password'}
                      {!isSubmitting && <ArrowRight size={16} className="ms-2" />}
                    </button>

                    <div className="text-center mt-2">
                      <Link to="/login" className="small text-muted text-decoration-none">
                        Remember your password? Return to login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;

