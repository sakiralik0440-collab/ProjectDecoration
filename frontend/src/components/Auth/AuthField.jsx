// src/components/Auth/AuthField.jsx
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './authIcons';

const AuthField = ({
  label,
  name,
  type = 'text',
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  error,
}) => {
  const isPassword = type === 'password';
  const [reveal, setReveal] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={`auth-${name}`}>
        {label}
        <span className="auth-required" aria-hidden="true">
          {' '}*
        </span>
      </label>

      <div
        className={`auth-input${error ? ' auth-input--error' : ''}`}
      >
        {icon && <span className="auth-input-icon">{icon}</span>}

        <input
          id={`auth-${name}`}
          name={name}
          type={isPassword && reveal ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />

        {isPassword && (
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            disabled={disabled}
          >
            {reveal ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <span className="auth-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default AuthField;