// src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import { MailIcon, LockIcon, UserIcon, AlertIcon } from './authIcons';

const Register = () => {
  const { requestOtp, loading, error, setError } =
    useContext(AuthContext) || {};

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error while typing
    if (validationError) {
      setValidationError('');
    }
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = form;

    if (!name.trim()) {
      return 'Name is required';
    }

    if (!email.trim()) {
      return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }

    if (!password) {
      return 'Password is required';
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters and include a letter and a number';
    }

    if (!confirmPassword) {
      return 'Please confirm your password';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validate();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setValidationError('');
    setSendingOtp(true);

    try {
      if (typeof requestOtp !== 'function') {
        throw new Error(
          'requestOtp is not available in AuthContext'
        );
      }

      // Request OTP from backend
      await requestOtp(form);

      // Optional toast/message
      if (setError) {
        setError('OTP generated successfully. Check the backend terminal.');
      }

      // Move to OTP verification page
      navigate('/otp-verify', {
        state: {
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
      });
    } catch (error) {
      console.error('Request OTP error:', error);

      if (setError) {
        setError(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to generate OTP'
        );
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const isLoading = loading || sendingOtp;
  const message = validationError || error;

  return (
    <AuthLayout
      visualTitle="Create Your Dream Space"
      visualText="Join Roomora AI and start transforming your spaces with AI."
      cardTitle="Create Account"
      cardSubtitle="Start designing beautiful interiors with AI."
      footer={
        <>
          Already have an account? <Link to="/login">Sign In</Link>
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
          label="Full Name"
          name="name"
          type="text"
          icon={<UserIcon />}
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          disabled={isLoading}
        />

        <AuthField
          label="Email"
          name="email"
          type="email"
          icon={<MailIcon />}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={isLoading}
        />

        <AuthField
          label="Password"
          name="password"
          type="password"
          icon={<LockIcon />}
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <AuthField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={<LockIcon />}
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="auth-submit-spinner" />
              Sending OTP...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="auth-note">
          We'll send a one-time code to your email to verify your account.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;