

import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() =>
    localStorage.getItem('token')
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // True only while the initial session (stored token) is being re-validated
  // after a page refresh; cleared as soon as the /auth/me check settles.
  const [restoring, setRestoring] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof localStorage !== 'undefined' &&
      Boolean(localStorage.getItem('token'))
  );

  // Fetch logged-in user's profile when token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setRestoring(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setRestoring(false);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setRestoring(false);
      }
    };

    fetchUser();
  }, [token]);

  // REQUEST OTP
  const requestOtp = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register/request-otp', data);
      // Success handled by caller (Register component shows toast)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'OTP request failed'
      );
      throw err; // rethrow so caller can handle if needed
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', data);
      // Go to login page
      window.location.href = '/login';
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', data);

      const {
        token: receivedToken,
        user: userInfo,
      } = res.data;

      // Save token
      localStorage.setItem('token', receivedToken);

      // Update state
      setToken(receivedToken);
      setUser(userInfo);

      // Go to Home Page
      window.location.href = '/';
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
    setError(null);

    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        restoring,
        error,
        setError,
        requestOtp,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};