import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isLogin
      ? await login(formData.email, formData.password)
      : await register(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="auth-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
        }}
      >
        <h2
          className="title-gradient"
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '8px',
          }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginBottom: '28px',
          }}
        >
          {isLogin
            ? 'Sign in to continue'
            : 'Create your account to get started'}
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className="input-field"
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          <input
            className="input-field"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            className="input-field"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '0.95rem',
          }}
        >
          {isLogin
            ? "Don't have an account? "
            : "Already have an account? "}

          <span
            className="toggle-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;