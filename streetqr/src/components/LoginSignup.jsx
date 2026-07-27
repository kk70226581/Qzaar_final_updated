import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  KeyRound,
  QrCode,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Navbar from './Navbar';
import { startSession } from '../utils/authSession';
import './LoginSignup.css';

const productPoints = [
  'QR storefront',
  'Menu builder',
  'Live orders'
];

function LoginSignup() {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPanel, setShowForgotPanel] = useState(false);
  const [resetStep, setResetStep] = useState('email');
  const [resetOtp, setResetOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const showMessage = useCallback((text, type) => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => {
      setMessage((current) => (current === text ? '' : current));
      setMessageType((current) => (current === type ? '' : current));
    }, 3200);
  }, []);

  const completeGoogleLogin = useCallback(async (credential) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/google`, { credential });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Google sign-in failed.');
      }

      startSession({ userId: response.data.userId, email: response.data.email });
      showMessage('Google sign-in successful. Redirecting...', 'success');
      window.setTimeout(() => navigate('/dashboard'), 650);
    } catch (error) {
      showMessage(error.response?.data?.message || error.message || 'Google sign-in failed. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  }, [API_BASE, navigate, showMessage]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return undefined;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => completeGoogleLogin(credential),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: isSignup ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
        width: 360
      });
    };

    const existingScript = document.getElementById('google-identity-services');
    if (existingScript) {
      renderGoogleButton();
      existingScript.addEventListener('load', renderGoogleButton);
      return () => existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
    return () => { script.onload = null; };
  }, [completeGoogleLogin, googleClientId, isSignup]);

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

  const handleAuth = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password.', 'danger');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'danger');
      return;
    }

    if (password.length < 10 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      showMessage('Use 10+ characters with uppercase, lowercase, and a number.', 'danger');
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

      startSession({ userId: response.data.userId, email });
      showMessage(isSignup ? 'Account created. Redirecting to your dashboard...' : 'Login successful. Redirecting...', 'success');
      window.setTimeout(() => navigate('/dashboard'), 900);
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
        setForgotEmail(targetEmail);
        setResetStep('otp');
        showMessage(response.data.message, 'success');
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

  const handleVerifyOtp = async () => {
    const targetEmail = forgotEmail || email;
    if (!/^\d{6}$/.test(resetOtp)) {
      showMessage('Enter the 6-digit code from your email.', 'danger');
      return;
    }

    setIsSendingReset(true);
    try {
      const response = await axios.post(`${API_BASE}/api/forgot-password/verify-otp`, { email: targetEmail, otp: resetOtp });
      if (!response.data.success) throw new Error(response.data.message || 'The code could not be verified.');
      setResetToken(response.data.resetToken);
      setResetStep('password');
      showMessage('Code confirmed. Choose a new password.', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || error.message || 'The code could not be verified.', 'danger');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handlePasswordReset = async () => {
    const targetEmail = forgotEmail || email;
    if (resetPassword.length < 10 || !/[a-z]/.test(resetPassword) || !/[A-Z]/.test(resetPassword) || !/\d/.test(resetPassword)) {
      showMessage('Use 10+ characters with uppercase, lowercase, and a number.', 'danger');
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      showMessage('Your passwords do not match.', 'danger');
      return;
    }

    setIsSendingReset(true);
    try {
      const response = await axios.post(`${API_BASE}/api/reset-password`, { email: targetEmail, resetToken, password: resetPassword });
      if (!response.data.success) throw new Error(response.data.message || 'Password reset failed.');
      setShowForgotPanel(false);
      setResetStep('email');
      setResetOtp('');
      setResetToken('');
      setResetPassword('');
      setResetConfirmPassword('');
      showMessage('Password updated. You can now log in.', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || error.message || 'Password reset failed.', 'danger');
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
            <h1>Access your Qzaar workspace.</h1>
            <p>Manage menu, QR, offers, and orders.</p>

            <div className="auth-highlight-card">
              <div className="auth-highlight-card__header">
                <QrCode size={18} />
                Workspace tools
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
                <strong>Menu control</strong>
                <span>Update and publish quickly.</span>
              </div>
              <div>
                <Lock size={18} />
                <strong>Secure access</strong>
                <span>Login, signup, reset.</span>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-panel__header">
              <p className="auth-panel__eyebrow">{isSignup ? 'Create account' : 'Welcome back'}</p>
              <h2>{isSignup ? 'Create your account' : 'Log in to your account'}</h2>
              <p>{isSignup ? 'Start building your restaurant workspace.' : 'Enter your details to access your Qzaar workspace.'}</p>
            </div>

            {message && (
              <div className={`auth-alert auth-alert--${messageType}`}>
                {message}
              </div>
            )}

            <div className="auth-form">
              <div className="auth-google">
                {googleClientId ? <div ref={googleButtonRef} aria-label="Continue with Google" /> : <button type="button" className="auth-google__unavailable" disabled><span aria-hidden="true">G</span> Continue with Google <small>Configure Google Client ID to enable</small></button>}
              </div>

              <div className="auth-divider"><span>or continue with email</span></div>

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
                <div className="auth-forgot-panel" aria-live="polite">
                  <div className="auth-reset-heading">
                    <KeyRound size={18} />
                    <div>
                      <strong>{resetStep === 'email' ? 'Verify your email' : resetStep === 'otp' ? 'Enter your code' : 'Create a new password'}</strong>
                      <span>{resetStep === 'email' ? 'We will send a 6-digit code that expires in 10 minutes.' : resetStep === 'otp' ? 'Check your inbox and enter the code below.' : 'Use a password you do not use elsewhere.'}</span>
                    </div>
                  </div>

                  {resetStep === 'email' && (
                    <label>
                      <span>Account email</span>
                      <div className="auth-input">
                        <Mail size={17} />
                        <input type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" />
                      </div>
                    </label>
                  )}

                  {resetStep === 'otp' && (
                    <label>
                      <span>6-digit verification code</span>
                      <div className="auth-input">
                        <KeyRound size={17} />
                        <input className="auth-otp-input" inputMode="numeric" maxLength="6" value={resetOtp} onChange={(event) => setResetOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" autoComplete="one-time-code" />
                      </div>
                    </label>
                  )}

                  {resetStep === 'password' && (
                    <>
                      <label>
                        <span>New password</span>
                        <div className="auth-input"><Lock size={17} /><input type={showPassword ? 'text' : 'password'} value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} placeholder="10+ characters" autoComplete="new-password" /></div>
                      </label>
                      <label>
                        <span>Confirm new password</span>
                        <div className="auth-input"><Lock size={17} /><input type={showPassword ? 'text' : 'password'} value={resetConfirmPassword} onChange={(event) => setResetConfirmPassword(event.target.value)} placeholder="Repeat password" autoComplete="new-password" /></div>
                      </label>
                    </>
                  )}

                  <button type="button" className="auth-secondary-btn" onClick={resetStep === 'email' ? handleForgotPassword : resetStep === 'otp' ? handleVerifyOtp : handlePasswordReset} disabled={isSendingReset}>
                    {isSendingReset ? 'Please wait...' : resetStep === 'email' ? 'Send verification code' : resetStep === 'otp' ? 'Verify code' : 'Update password'}
                  </button>
                  {resetStep === 'otp' && <button type="button" className="auth-reset-back" onClick={() => setResetStep('email')}>Use a different email</button>}
                </div>
              )}

              <button type="button" className="auth-primary-btn" onClick={handleAuth} disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>

              <p className="auth-legal">By continuing, you agree to Qzaar's <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>.</p>
            </div>

            <button
              type="button"
              className="auth-switch"
              onClick={() => {
                setIsSignup((current) => !current);
                setConfirmPassword('');
                setShowForgotPanel(false);
                setResetStep('email');
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
