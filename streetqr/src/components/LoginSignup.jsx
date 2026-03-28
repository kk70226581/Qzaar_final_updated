import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  QrCode,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Navbar from './Navbar';
import './LoginSignup.css';

const productPoints = [
  'Brandable vendor profile and QR-ready storefront',
  'Featured items, availability, prep-time, and category filters',
  'Live order queue with lightweight analytics'
];

function LoginSignup() {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPanel, setShowForgotPanel] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return 'Basic';
    if (score <= 3) return 'Good';
    return 'Strong';
  }, [password]);

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => {
      setMessage((current) => (current === text ? '' : current));
      setMessageType((current) => (current === type ? '' : current));
    }, 3200);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password.', 'danger');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'danger');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long.', 'danger');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      showMessage('Password and confirm password do not match.', 'danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isSignup ? '/api/signup' : '/api/login';
      const response = await axios.post(`${API_BASE}${endpoint}`, { email, password });

      if (!response.data.success) {
        showMessage(response.data.message || 'Authentication failed.', 'danger');
        return;
      }

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('shopId', response.data.userId);
      localStorage.setItem('email', email);
      showMessage(isSignup ? 'Account created. Redirecting to your dashboard...' : 'Login successful. Redirecting...', 'success');
      window.setTimeout(() => navigate('/menu'), 900);
    } catch (error) {
      console.error(error);
      showMessage('Server error. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const targetEmail = forgotEmail || email;
    if (!targetEmail || !validateEmail(targetEmail)) {
      showMessage('Enter a valid email address for password reset.', 'danger');
      return;
    }

    setIsSendingReset(true);
    try {
      const response = await axios.post(`${API_BASE}/api/forgot-password`, { email: targetEmail });
      if (response.data.success) {
        showMessage('Password reset link sent to your email.', 'success');
        setShowForgotPanel(false);
      } else {
        showMessage(response.data.message || 'Error sending reset email.', 'danger');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showMessage('Server error. Try again later.', 'danger');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-shell">
        <div className="auth-container">
          <section className="auth-showcase">
            <span className="auth-pill">
              <Sparkles size={16} />
              Secure business access
            </span>
            <h1>Sign in to manage your menu, QR ordering, and daily business operations.</h1>
            <p>
              Access your business account, update your menu, publish changes, and monitor incoming orders from
              one simple workspace.
            </p>

            <div className="auth-highlight-card">
              <div className="auth-highlight-card__header">
                <QrCode size={18} />
                What you can manage
              </div>
              <ul className="auth-bullets">
                {productPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="auth-trust-row">
              <div>
                <ShieldCheck size={18} />
                <strong>Business-ready workflow</strong>
                <span>Manage menus, publish updates, and track orders from one place.</span>
              </div>
              <div>
                <Lock size={18} />
                <strong>Protected account access</strong>
                <span>Password confirmation, clear feedback, and an easy reset flow.</span>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-panel__header">
              <p className="auth-panel__eyebrow">{isSignup ? 'Create account' : 'Welcome back'}</p>
              <h2>{isSignup ? 'Start publishing your digital menu' : 'Log in to continue'}</h2>
              <p>{isSignup ? 'Create your business account and start setting up your digital menu.' : 'Access your menu dashboard, QR tools, and live orders.'}</p>
            </div>

            {message && (
              <div className={`auth-alert auth-alert--${messageType}`}>
                {message}
              </div>
            )}

            <div className="auth-form">
              <label>
                <span>Email address</span>
                <div className="auth-input">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
              </label>

              <label>
                <span>Password</span>
                <div className="auth-input">
                  <Lock size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                  <button type="button" className="auth-input__toggle" onClick={() => setShowPassword((current) => !current)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {isSignup && (
                <>
                  <label>
                    <span>Confirm password</span>
                    <div className="auth-input">
                      <Lock size={17} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat password"
                      />
                    </div>
                  </label>

                  <div className="auth-password-strength">
                    <span>Password strength</span>
                    <strong>{password ? passwordStrength : 'Start typing'}</strong>
                  </div>
                </>
              )}

              {!isSignup && (
                <button type="button" className="auth-link" onClick={() => setShowForgotPanel((current) => !current)}>
                  {showForgotPanel ? 'Hide reset form' : 'Forgot password?'}
                </button>
              )}

              {showForgotPanel && (
                <div className="auth-forgot-panel">
                  <label>
                    <span>Reset email</span>
                    <div className="auth-input">
                      <Mail size={17} />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(event) => setForgotEmail(event.target.value)}
                        placeholder="Enter your registered email"
                      />
                    </div>
                  </label>
                  <button type="button" className="auth-secondary-btn" onClick={handleForgotPassword} disabled={isSendingReset}>
                    {isSendingReset ? 'Sending reset link...' : 'Send reset link'}
                  </button>
                </div>
              )}

              <button type="button" className="auth-primary-btn" onClick={handleAuth} disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </div>

            <button
              type="button"
              className="auth-switch"
              onClick={() => {
                setIsSignup((current) => !current);
                setConfirmPassword('');
                setShowForgotPanel(false);
              }}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>

            <p className="auth-footer">(c) {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd.</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default LoginSignup;
