import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, Lock, Mail, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const AuthModal = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(() => {
    if (initialMode === 'signup' || location.pathname === '/signup') return false;
    return true;
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, register, authError, setAuthError } = useAuth();

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else if (location.pathname === '/login') {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      // Handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTab = (loginMode) => {
    setIsLogin(loginMode);
    setAuthError(null);
    navigate(loginMode ? '/login' : '/signup');
  };

  return (
    <div className="auth-container">
      {/* Background ambient Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>

      <div className="auth-card animate-scale-up">
        <div className="auth-brand">
          <div className="brand-icon-wrapper">
            <CheckSquare className="brand-icon" size={32} />
          </div>
          <h1 className="brand-title">TaskManager Pro</h1>
          <p className="brand-subtitle">
            {isLogin
              ? 'Welcome back! Sign in to access your dashboard'
              : 'Create a free account & manage tasks securely'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => toggleTab(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => toggleTab(false)}
          >
            Create Account
          </button>
        </div>

        {/* Error notification banner */}
        {authError && (
          <div className="auth-error-banner animate-fade-down" role="alert">
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Mandip Kushwaha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="auth-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="spinner-loader"></span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => toggleTab(false)} className="link-button">
                Sign Up <Sparkles size={14} />
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => toggleTab(true)} className="link-button">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
