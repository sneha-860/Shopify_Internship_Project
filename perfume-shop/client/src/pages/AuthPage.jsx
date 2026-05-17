import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './AuthPage.css';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const updateForm = (key, value) => {
    setError('');
    setForm(current => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        await signup(form);
      } else {
        await login(form);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page fade-in">
      <div className="auth-panel">
        <p className="auth-eyebrow">Lumiere Account</p>
        <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-copy">
          Sign in to save your fragrance profile and speed through checkout.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setError('');
            setMode(current => current === 'signup' ? 'login' : 'signup');
          }}
        >
          {mode === 'signup' ? 'Already have an account? Log in' : 'New here? Create an account'}
        </button>
      </div>
    </section>
  );
};

export default AuthPage;
