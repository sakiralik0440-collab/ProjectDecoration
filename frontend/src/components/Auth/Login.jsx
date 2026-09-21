// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import { MailIcon, LockIcon, AlertIcon } from './authIcons';

const Login = () => {
  const { login, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const validate = () => {
    const { email, password } = form;
    if (!email || !password) return 'Email and password are required';
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setValidationError(errMsg);
      return;
    }
    setValidationError('');
    login(form);
  };

  const message = validationError || error;

  return (
    <AuthLayout
      visualTitle="Design the Space You Dream Of"
      visualText="Transform your space into a beautiful personalized design with AI-powered interior design."
      cardTitle="Welcome Back"
      cardSubtitle="Sign in to continue designing your dream space."
      footer={
        <>
          Don't have an account? <Link to="/register">Create Account</Link>
        </>
      }
    >
      {message && (
        <div className="auth-alert" role="alert">
          <AlertIcon />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <AuthField
          label="Email"
          name="email"
          type="email"
          icon={<MailIcon />}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={loading}
        />

        <AuthField
          label="Password"
          name="password"
          type="password"
          icon={<LockIcon />}
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
        />

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="auth-submit-spinner" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;