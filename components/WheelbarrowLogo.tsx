interface WheelbarrowLogoProps {
  className?: string
}

export default function WheelbarrowLogo({ className = '' }: WheelbarrowLogoProps) {
  return (
    <svg
      viewBox="0 0 240 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wheelbarrow Invitational"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="120" y1="10" x2="120" y2="292" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f2240" />
          <stop offset="100%" stopColor="#060f1e" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="120" y1="0" x2="120" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8c96a" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#9a7530" />
        </linearGradient>
        <filter id="drop" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* ══════════════════════════════════════════════════════════════
          SHIELD
      ══════════════════════════════════════════════════════════════ */}
      <path
        d="M120 6 L232 50 L232 164 Q232 242 120 296 Q8 242 8 164 L8 50 Z"
        fill="url(#goldGrad)"
        filter="url(#drop)"
      />
      <path
        d="M120 16 L222 57 L222 164 Q222 236 120 287 Q18 236 18 164 L18 57 Z"
        fill="url(#shieldGrad)"
      />
      <path
        d="M120 22 L216 61 L216 164 Q216 230 120 279 Q24 230 24 164 L24 61 Z"
        stroke="#c9a84c"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* Corner diamond accents */}
      <rect x="8" y="44" width="8" height="8" fill="#c9a84c" transform="rotate(45 12 48)" />
      <rect x="224" y="44" width="8" height="8" fill="#c9a84c" transform="rotate(45 228 48)" />

      {/* ══════════════════════════════════════════════════════════════
          CIRCULAR MEDALLION — covers club crossing
      ══════════════════════════════════════════════════════════════ */}
      <circle cx="120" cy="155" r="56" fill="#c9a84c" />
      <circle cx="120" cy="155" r="52" fill="#0a1628" />
      <circle cx="120" cy="155" r="49" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <circle cx="120" cy="155" r="46" stroke="#c9a84c" strokeWidth="0.4" opacity="0.25" />

      {/* ══════════════════════════════════════════════════════════════
          WBI — large serif monogram in center
      ══════════════════════════════════════════════════════════════ */}
      <text
        x="120"
        y="172"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="52"
        fontWeight="bold"
        fill="#c9a84c"
        letterSpacing="2"
      >
        WBI
      </text>

      {/* Fine rule above and below WBI */}
      <line x1="78" y1="128" x2="162" y2="128" stroke="#c9a84c" strokeWidth="1" opacity="0.55" />
      <line x1="78" y1="181" x2="162" y2="181" stroke="#c9a84c" strokeWidth="1" opacity="0.55" />

      {/* ══════════════════════════════════════════════════════════════
          TOP: WHEELBARROW text + divider
      ══════════════════════════════════════════════════════════════ */}
      <line x1="38" y1="94" x2="202" y2="94" stroke="#c9a84c" strokeWidth="1.5" opacity="0.55" />
      <text
        x="120"
        y="83"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11.5"
        fontWeight="bold"
        fill="#c9a84c"
        letterSpacing="4"
      >
        WHEELBARROW
      </text>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM RIBBON BANNER
      ══════════════════════════════════════════════════════════════ */}
      <path d="M44 228 Q120 218 196 228 L192 246 Q120 256 48 246 Z" fill="#c9a84c" />
      <path d="M44 228 Q120 218 196 228 L192 246 Q120 256 48 246 Z" stroke="#9a7530" strokeWidth="0.8" />
      <path d="M44 228 L38 237 L48 246 L44 228 Z" fill="#9a7530" />
      <path d="M196 228 L202 237 L192 246 L196 228 Z" fill="#9a7530" />
      <text
        x="120"
        y="240"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="10"
        fontWeight="bold"
        fill="#0a1628"
        letterSpacing="3"
      >
        INVITATIONAL
      </text>
    </svg>
  )
}
