interface WheelbarrowLogoProps {
  className?: string
}

export default function WheelbarrowLogo({ className = '' }: WheelbarrowLogoProps) {
  return (
    <svg
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wheelbarrow Invitational"
    >
      {/* ── Shield fill ─────────────────────────────────────────────── */}
      <path
        d="M22 12 L178 12 L178 148 Q178 208 100 245 Q22 208 22 148 Z"
        fill="#0a1628"
      />

      {/* ── Outer border ────────────────────────────────────────────── */}
      <path
        d="M22 12 L178 12 L178 148 Q178 208 100 245 Q22 208 22 148 Z"
        stroke="#c9a84c"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* ── Inner decorative border ──────────────────────────────────── */}
      <path
        d="M30 20 L170 20 L170 148 Q170 200 100 233 Q30 200 30 148 Z"
        stroke="#c9a84c"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* ── Top-corner diamonds ──────────────────────────────────────── */}
      <rect x="19" y="9" width="7" height="7" fill="#c9a84c" transform="rotate(45 22.5 12.5)" />
      <rect x="174" y="9" width="7" height="7" fill="#c9a84c" transform="rotate(45 177.5 12.5)" />

      {/* ── Dots on top inner border ─────────────────────────────────── */}
      <circle cx="60"  cy="20" r="1.5" fill="#c9a84c" opacity="0.45" />
      <circle cx="100" cy="20" r="1.5" fill="#c9a84c" opacity="0.45" />
      <circle cx="140" cy="20" r="1.5" fill="#c9a84c" opacity="0.45" />

      {/* ══════════════════════════════════════════════════════════════
          CROSSED GOLF CLUBS  (drawn first, behind medallion)
          Both clubs rotate around the scene center (100, 112).
          Club template:  grip cap at y=28, shaft to y=196, iron head at y=196-208.
      ══════════════════════════════════════════════════════════════ */}

      {/* Club 1 — +35° */}
      <g transform="rotate(35 100 112)" opacity="0.88">
        {/* Shaft */}
        <rect x="98.75" y="28" width="2.5" height="168" fill="#c9a84c" rx="1.25" />
        {/* Grip (wider section, top ~38px) */}
        <rect x="97"    y="28" width="6"   height="38"  fill="#c9a84c" rx="3" />
        {/* Grip cap */}
        <circle cx="100" cy="28" r="5.5" fill="#c9a84c" />
        {/* Grip wrap lines */}
        <line x1="97" y1="39" x2="103" y2="39" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        <line x1="97" y1="47" x2="103" y2="47" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        <line x1="97" y1="55" x2="103" y2="55" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        {/* Hosel */}
        <rect x="98.25" y="190" width="3.5" height="8" fill="#c9a84c" />
        {/* Iron blade */}
        <rect x="90" y="196" width="20" height="9" fill="#c9a84c" rx="1.5" />
        {/* Sole plate detail */}
        <rect x="89.5" y="202" width="21" height="3" fill="#c9a84c" rx="1.5" opacity="0.65" />
      </g>

      {/* Club 2 — −35° */}
      <g transform="rotate(-35 100 112)" opacity="0.88">
        <rect x="98.75" y="28" width="2.5" height="168" fill="#c9a84c" rx="1.25" />
        <rect x="97"    y="28" width="6"   height="38"  fill="#c9a84c" rx="3" />
        <circle cx="100" cy="28" r="5.5" fill="#c9a84c" />
        <line x1="97" y1="39" x2="103" y2="39" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        <line x1="97" y1="47" x2="103" y2="47" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        <line x1="97" y1="55" x2="103" y2="55" stroke="#0a1628" strokeWidth="0.9" opacity="0.35" />
        <rect x="98.25" y="190" width="3.5" height="8" fill="#c9a84c" />
        <rect x="90" y="196" width="20" height="9" fill="#c9a84c" rx="1.5" />
        <rect x="89.5" y="202" width="21" height="3" fill="#c9a84c" rx="1.5" opacity="0.65" />
      </g>

      {/* ── Circular medallion (creates depth, covers club crossing) ─── */}
      <circle cx="100" cy="112" r="55" fill="#0a1628" />
      <circle cx="100" cy="112" r="55" stroke="#c9a84c" strokeWidth="1"   opacity="0.45" />
      <circle cx="100" cy="112" r="51" stroke="#c9a84c" strokeWidth="0.5" opacity="0.25" />

      {/* ══════════════════════════════════════════════════════════════
          DETAILED WHEELBARROW  (foreground)
          Wheel cx=70 cy=133 r=16. Tray above wheel.
      ══════════════════════════════════════════════════════════════ */}

      {/* Wheel rim */}
      <circle cx="70" cy="133" r="16" stroke="#c9a84c" strokeWidth="2.5" />
      {/* 8 spokes */}
      <line x1="70"  y1="117" x2="70"  y2="149" stroke="#c9a84c" strokeWidth="1.5" />
      <line x1="54"  y1="133" x2="86"  y2="133" stroke="#c9a84c" strokeWidth="1.5" />
      <line x1="58.7" y1="121.7" x2="81.3" y2="144.3" stroke="#c9a84c" strokeWidth="1.3" />
      <line x1="58.7" y1="144.3" x2="81.3" y2="121.7" stroke="#c9a84c" strokeWidth="1.3" />
      {/* Hub ring + axle */}
      <circle cx="70" cy="133" r="5"   fill="#c9a84c" />
      <circle cx="70" cy="133" r="2.5" fill="#0a1628" />
      {/* Outer rim highlight */}
      <circle cx="70" cy="133" r="14" stroke="#c9a84c" strokeWidth="0.6" opacity="0.35" />

      {/* Front support arm (tray → wheel) */}
      <line x1="63" y1="118" x2="70" y2="117" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />

      {/* Tray body */}
      <path d="M58 90 L132 90 L136 118 L54 118 Z" fill="#c9a84c" />
      {/* Interior depth shadow */}
      <path d="M61 94 L129 94 L133 115 L57 115 Z" fill="#0a1628" opacity="0.18" />
      {/* Tray top rim */}
      <line x1="58" y1="90" x2="132" y2="90" stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" />
      {/* Tray front wall */}
      <line x1="58" y1="90" x2="54" y2="118" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
      {/* Tray bottom */}
      <line x1="54" y1="118" x2="136" y2="118" stroke="#c9a84c" strokeWidth="1.8" />

      {/* Load mound (irregular natural pile) */}
      <path
        d="M58 90 C65 78 76 68 89 71 C95 69 101 66 108 68 C117 66 126 75 132 90 Z"
        fill="#c9a84c"
        opacity="0.88"
      />
      {/* Mound surface texture */}
      <path d="M74 80 Q79 74 85 78" stroke="#0a1628" strokeWidth="1"   fill="none" opacity="0.22" />
      <path d="M96 69 Q101 65 106 69" stroke="#0a1628" strokeWidth="1"   fill="none" opacity="0.22" />
      <path d="M114 76 Q118 71 123 76" stroke="#0a1628" strokeWidth="0.8" fill="none" opacity="0.22" />

      {/* Handles */}
      <line x1="135" y1="98"  x2="164" y2="84"  stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="135" y1="115" x2="164" y2="113" stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" />
      {/* Crossbar */}
      <line x1="164" y1="84" x2="164" y2="113" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      {/* Grip wrap detail */}
      <rect x="161" y="85" width="6" height="27" rx="3" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.45" />
      <line x1="161.5" y1="92"  x2="167" y2="92"  stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
      <line x1="161.5" y1="99"  x2="167" y2="99"  stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
      <line x1="161.5" y1="106" x2="167" y2="106" stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />

      {/* ── 5-pointed star above scene ───────────────────────────────── */}
      {/* Outer r=9, inner r=3.8, center (100, 68) */}
      <path
        d="M100 59 L101.9 65.3 L108.6 65.3 L103.3 69.1 L105.2 75.4 L100 71.6 L94.8 75.4 L96.7 69.1 L91.4 65.3 L98.1 65.3 Z"
        fill="#c9a84c"
      />

    </svg>
  )
}
