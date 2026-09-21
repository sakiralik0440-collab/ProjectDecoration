// src/components/Toast.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple toast that shows the latest error or success message from AuthContext
const Toast = () => {
  const { error } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!visible) return null;

  return <div className="toast">{error}</div>;
};

export default Toast;
