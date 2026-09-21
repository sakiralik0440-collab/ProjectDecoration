// src/components/OtpVerification.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from './Auth/AuthLayout';
import AuthField from './Auth/AuthField';
import { KeyIcon, AlertIcon } from './Auth/authIcons';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useContext(AuthContext) || {};

  const { email, name, password, confirmPassword } = location.state || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name || !password || !confirmPassword) {
      setLocalError('Registration information is missing. Please register again.');
      if (setError) {
        setError(
          'Registration information is missing. Please register again.'
        );
      }
      navigate('/register');
      return;
    }

    if (otp.length !== 6) {
      setLocalError('OTP must be a 6-digit code.');
      if (setError) {
        setError('OTP must be a 6-digit code.');
      }
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register/verify-otp', {
        email,
        otp,
        name,
        password,
        confirmPassword,
      });

      console.log('OTP verification successful:', response.data);

      if (setError) {
        setError('Registration successful. Please login.');
      }

      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'OTP verification failed. Please try again.';

      setLocalError(message);
      if (setError) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const message = localError;

  return (
    <AuthLayout
      visualTitle="Design the Space You Dream Of"
      visualText="Your account is one step away. Enter the code to start designing with AI."
      cardTitle="Verify Your Email"
      cardSubtitle={
        <>
          A 6-digit verification code was generated for{' '}
          <strong>{email || 'your email'}</strong>.
        </>
      }
      footer={
        <>
          Didn't receive a code? <Link to="/register">Register again</Link>
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
          label="Verification Code"
          name="otp"
          type="text"
          icon={<KeyIcon />}
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={handleChange}
          autoComplete="one-time-code"
          disabled={loading}
        />

        <button
          type="submit"
          className="auth-submit"
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <>
              <span className="auth-submit-spinner" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default OtpVerification;