import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
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
    if (!password || !confirm) {
      setMessage('Please fill all fields.');
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
    try {
      const response = await axios.post(`${API}/api/reset-password/${token}`, { password });
      if (response.data.success) {
        setSuccess(true);
        setMessage('Password reset successful. Redirecting to login...');
        window.setTimeout(() => navigate('/login'), 2200);
      } else {
        setMessage(response.data.message || 'Could not reset password.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error. Try again.');
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
                  This upgraded reset screen now gives clearer feedback, password visibility controls, and better state handling.
                </p>
                <div className="rounded-4 border bg-light p-4">
                  <div className="d-flex align-items-center gap-2 fw-bold mb-2">
                    <ShieldCheck size={18} />
                    Password checklist
                  </div>
                  <div className="small text-muted">Use at least 6 characters, include a number, and avoid reusing old passwords.</div>
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
