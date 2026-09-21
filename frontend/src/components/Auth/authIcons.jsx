// src/components/Auth/authIcons.jsx
import React from 'react';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const BrandLogo = (props) => (
  <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" {...props}>
    <rect width="32" height="32" rx="9" fill="#4a90e2" />
    <rect x="10.4" y="8.2" width="2.6" height="15.6" rx="1.3" fill="#ffffff" />
    <path d="M13 8.2h2.1a4.4 4.4 0 0 1 0 8.8H13Z" fill="#ffffff" />
  </svg>
);

export const MailIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 8 9 6 9-6" />
  </svg>
);

export const LockIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <rect x="4.5" y="11" width="15" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const UserIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.6-3.8 3.7-6 7.5-6s6.9 2.2 7.5 6" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M2 12s3.4-7 10-7 10 7 10 7-3.4 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const KeyIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <circle cx="8" cy="15" r="4" />
    <path d="m10.85 12.15 8.9-8.9" />
    <path d="m18 5 3 3" />
    <path d="m14.5 8.5 2.5 2.5" />
  </svg>
);

export const SparkIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M12 2.2c.55 4.9 2.05 7.4 6.9 7.9-4.85.5-6.35 3-6.9 7.9-.55-4.9-2.05-7.4-6.9-7.9 4.85-.5 6.35-3 6.9-7.9Z" />
  </svg>
);

export const StarIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="m12 2.6 2.35 5.26 5.77.5-4.37 3.82 1.3 5.66L12 14.84l-5.05 3-1.3-5.66 4.37-3.82 5.77-.5Z" />
  </svg>
);

export const AlertIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);