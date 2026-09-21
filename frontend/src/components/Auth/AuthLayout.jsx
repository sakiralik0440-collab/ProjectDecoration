// src/components/Auth/AuthLayout.jsx
import React from 'react';
import InteriorScene from './InteriorScene';
import { BrandLogo, SparkIcon, StarIcon } from './authIcons';

const AuthLayout = ({
  visualTitle,
  visualText,
  cardTitle,
  cardSubtitle,
  children,
  footer,
}) => (
  <div className="auth-page">
    <aside className="auth-visual">
      <div className="auth-visual-brand">
        <BrandLogo width="38" height="38" />
        <span className="auth-logo-text">
          Project<span>Decoration</span>
        </span>
      </div>

      <div className="auth-scene">
        <InteriorScene />
      </div>

      <div className="auth-chip auth-chip--ai">
        <SparkIcon />
        <span>AI-Powered Design</span>
      </div>
      <div className="auth-chip auth-chip--rating">
        <StarIcon />
        <span>Loved by interior designers</span>
      </div>

      <div className="auth-visual-content">
        <h1>{visualTitle}</h1>
        <p>{visualText}</p>
      </div>
    </aside>

    <main className="auth-panel">
      <div className="auth-card">
        <div className="auth-card-brand">
          <BrandLogo width="34" height="34" />
          <span className="auth-logo-text">
            Project<span>Decoration</span>
          </span>
        </div>

        <h2>{cardTitle}</h2>
        <p className="auth-card-sub">{cardSubtitle}</p>

        {children}

        {footer && <div className="auth-switch">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;