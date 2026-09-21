// src/components/Auth/InteriorScene.jsx
import React from 'react';

// Stylized premium living-room illustration used as the auth pages' visual.
const InteriorScene = () => (
  <svg
    className="auth-scene-svg"
    viewBox="0 0 640 640"
    preserveAspectRatio="xMidYMax slice"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="is-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4f1ea" />
        <stop offset="1" stopColor="#eae4d6" />
      </linearGradient>
      <linearGradient id="is-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e8ddc8" />
        <stop offset="1" stopColor="#d8c9ab" />
      </linearGradient>
      <radialGradient id="is-glow" cx="0.4" cy="0.32" r="0.72">
        <stop offset="0" stopColor="#d8e4f4" stopOpacity="0.95" />
        <stop offset="1" stopColor="#d8e4f4" stopOpacity="0" />
      </radialGradient>
      <filter id="is-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    {/* walls + floor */}
    <rect width="640" height="640" fill="url(#is-wall)" />
    <rect width="640" height="640" fill="url(#is-glow)" />
    <path d="M0 522 640 522 640 640 0 640Z" fill="url(#is-floor)" />
    <line x1="0" y1="522" x2="640" y2="522" stroke="#d4c6a9" strokeWidth="7" />

    {/* rug */}
    <ellipse cx="336" cy="622" rx="252" ry="50" fill="#bfae8f" opacity="0.32" filter="url(#is-soft)" />
    <ellipse cx="336" cy="608" rx="234" ry="39" fill="#e8ceac" opacity="0.92" />

    {/* arched window */}
    <g>
      <path d="M74 470 V244 a118 118 0 0 1 236 0 V470 Z" fill="#c6daef" />
      <path d="M74 470 V244 a118 118 0 0 1 236 0 V470 Z" fill="none" stroke="#ffffff" strokeWidth="13" />
      <line x1="192" y1="128" x2="192" y2="470" stroke="#ffffff" strokeWidth="9" />
      <line x1="74" y1="302" x2="310" y2="302" stroke="#ffffff" strokeWidth="8" />
      <rect x="50" y="484" width="308" height="26" rx="11" fill="#ffffff" />
    </g>

    {/* framed art */}
    <g>
      <rect x="450" y="148" width="122" height="152" rx="9" fill="#ffffff" stroke="#dde3ea" strokeWidth="7" />
      <path d="M465 300 502 238 528 262 556 212 572 300Z" fill="#bcd3ea" />
      <circle cx="548" cy="194" r="15" fill="#f0d5a0" />
    </g>

    {/* pendant lamp */}
    <g>
      <line x1="378" y1="0" x2="378" y2="158" stroke="#aab6c3" strokeWidth="6" />
      <path d="M330 152 q48 34 96 0 l-15 -58 h-66 Z" fill="#dcc49e" />
      <line x1="378" y1="188" x2="378" y2="212" stroke="#caa86d" strokeWidth="6" />
    </g>

    {/* sofa */}
    <g>
      <ellipse cx="360" cy="606" rx="168" ry="34" fill="#a9b9c7" opacity="0.38" filter="url(#is-soft)" />
      <rect x="178" y="452" width="296" height="60" rx="19" fill="#c6d2de" />
      <rect x="178" y="508" width="296" height="74" rx="19" fill="#b2c1d2" />
      <rect x="166" y="446" width="31" height="126" rx="15" fill="#cdd8e3" />
      <rect x="455" y="446" width="31" height="126" rx="15" fill="#cdd8e3" />
      <rect x="202" y="516" width="120" height="58" rx="14" fill="#a2b3c8" />
      <rect x="332" y="516" width="120" height="58" rx="14" fill="#a2b3c8" />
      <rect x="186" y="582" width="17" height="24" rx="7" fill="#8b99a8" />
      <rect x="448" y="582" width="17" height="24" rx="7" fill="#8b99a8" />
      <rect x="214" y="506" width="58" height="54" rx="15" fill="#e5c49b" transform="rotate(9 243 533)" />
    </g>

    {/* floor lamp */}
    <g>
      <line x1="560" y1="366" x2="560" y2="592" stroke="#aab6c3" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="560" cy="366" rx="60" ry="26" fill="#f2d3aa" opacity="0.85" />
      <path d="M510 372 h100 l-21 46 h-58 Z" fill="#e3b98e" />
    </g>

    {/* plant */}
    <g>
      <path d="M96 600 h78 l-13 42 H109 Z" fill="#d5ba96" />
      <g fill="#6f926f">
        <ellipse cx="136" cy="558" rx="16" ry="48" transform="rotate(-30 136 586)" />
        <ellipse cx="136" cy="560" rx="16" ry="46" transform="rotate(26 136 586)" />
        <ellipse cx="136" cy="544" rx="14" ry="48" transform="rotate(-3 136 586)" />
        <ellipse cx="136" cy="560" rx="13" ry="42" transform="rotate(55 136 586)" />
      </g>
    </g>
  </svg>
);

export default InteriorScene;