import React, { useEffect } from 'react';
import './Lightbox.css';

const Lightbox = ({ isOpen, src, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('lightbox-overlay')) {
      onClose();
    }
  };

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <img src={src} alt="Enlarged preview" className="lightbox-image" />
    </div>
  );
};

export default Lightbox;
