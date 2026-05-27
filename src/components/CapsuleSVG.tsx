export function CapsuleSVG() {
  return (
    <svg
      width="140"
      height="240"
      viewBox="0 0 140 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_60px_rgba(108,92,231,0.15)]"
    >
      {/* Outer glow */}
      <ellipse
        cx="70"
        cy="120"
        rx="55"
        ry="105"
        fill="url(#glowGrad)"
        opacity="0.3"
      />

      {/* Capsule body */}
      <rect
        x="25"
        y="35"
        width="90"
        height="170"
        rx="45"
        fill="url(#capsuleGrad)"
        stroke="#2d1f5e"
        strokeWidth="1.5"
      />

      {/* Inner dark core */}
      <rect
        x="35"
        y="45"
        width="70"
        height="150"
        rx="35"
        fill="#07060a"
        opacity="0.8"
      />

      {/* Seal line — middle */}
      <line
        x1="25"
        y1="120"
        x2="115"
        y2="120"
        stroke="#3d3475"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.7"
      />

      {/* Seal circles */}
      <circle cx="70" cy="120" r="8" fill="#1a1530" stroke="#6c5ce7" strokeWidth="1" opacity="0.8" />
      <circle cx="70" cy="120" r="3" fill="#6c5ce7" opacity="0.4" />

      {/* Top seal cap */}
      <rect
        x="45"
        y="22"
        width="50"
        height="16"
        rx="8"
        fill="#1a1530"
        stroke="#2d1f5e"
        strokeWidth="1"
      />
      <rect
        x="55"
        y="18"
        width="30"
        height="6"
        rx="3"
        fill="#2d1f5e"
        stroke="#3d3475"
        strokeWidth="0.5"
      />

      {/* Bottom seal cap */}
      <rect
        x="45"
        y="202"
        width="50"
        height="16"
        rx="8"
        fill="#1a1530"
        stroke="#2d1f5e"
        strokeWidth="1"
      />
      <rect
        x="55"
        y="216"
        width="30"
        height="6"
        rx="3"
        fill="#2d1f5e"
        stroke="#3d3475"
        strokeWidth="0.5"
      />

      {/* Glyph — question mark */}
      <text
        x="70"
        y="135"
        textAnchor="middle"
        fill="#6c5ce7"
        fontSize="28"
        fontFamily="VT323, monospace"
        opacity="0.5"
      >
        ?
      </text>

      {/* Trait dots */}
      <circle cx="50" cy="160" r="2" fill="#3d3475" opacity="0.5" />
      <circle cx="70" cy="165" r="2" fill="#3d3475" opacity="0.5" />
      <circle cx="90" cy="160" r="2" fill="#3d3475" opacity="0.5" />

      {/* Gradients */}
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="capsuleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d0b14" />
          <stop offset="50%" stopColor="#1a1530" />
          <stop offset="100%" stopColor="#0d0b14" />
        </linearGradient>
      </defs>
    </svg>
  );
}
