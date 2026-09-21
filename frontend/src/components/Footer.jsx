
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pd-footer">
      <div className="pd-footer-container">

        {/* Brand */}
        <div className="pd-footer-brand">
          <Link to="/" className="pd-footer-logo">
            Roomora<span>AI</span>
          </Link>

          <p className="pd-footer-description">
            Transform your room into a space you love with
            AI-powered interior design.
          </p>

          <Link to="/design" className="pd-footer-start">
            Start Designing
            <span>→</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pd-footer-column">
          <h4>Explore</h4>

          <Link to="/">Home</Link>
          <Link to="/design">Design My Space</Link>
          <Link to="/designs">My Designs</Link>
          <Link to="/profile">Profile</Link>
        </div>

        {/* Design */}
        <div className="pd-footer-column">
          <h4>Design Ideas</h4>

          <span>Living Room</span>
          <span>Bedroom</span>
          <span>Kitchen</span>
          <span>Office</span>
        </div>

        {/* About */}
        <div className="pd-footer-column pd-footer-about">
          <h4>Roomora AI</h4>

          <p>
            Create beautiful, personalized interiors
            without the complexity of traditional
            interior planning.
          </p>

          <div className="pd-footer-socials">
            <a href="#" aria-label="Instagram">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  className="social-dot"
                />
              </svg>
            </a>

            <a href="#" aria-label="Facebook">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3.5l.5-4H13V9c0-.7.3-1 1-1Z" />
              </svg>
            </a>

            <a href="#" aria-label="LinkedIn">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 8H2v11h3V8Zm.2-3.5C5.2 3.7 4.5 3 3.5 3S1.8 3.7 1.8 4.5 2.5 6 3.5 6s1.7-.7 1.7-1.5ZM22 12.5c0-3.3-1.8-4.9-4.2-4.9-1.9 0-2.8 1.1-3.3 1.8V8h-3v11h3v-5.8c0-1.5.3-2.9 2.1-2.9 1.7 0 1.7 1.6 1.7 3V19h3v-6.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pd-footer-bottom">
        <div className="pd-footer-bottom-inner">
          <p>
            © {currentYear} Roomora AI. All rights reserved.
          </p>

          <div className="pd-footer-bottom-links">
            <span>AI Interior Design</span>
            <span className="pd-footer-dot">•</span>
            <span>Made for Modern Spaces</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;