interface UploadIllustrationProps {
  size?: number;
}

export function UploadIllustration({ size = 180 }: UploadIllustrationProps) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* soft backdrop */}
      <circle cx="100" cy="80" r="76" fill="#F7F2EA" />

      {/* sparkle accents */}
      <path d="M35 42 L38 49 L45 52 L38 55 L35 62 L32 55 L25 52 L32 49 Z" fill="#FF7F11" opacity="0.85" />
      <circle cx="168" cy="38" r="4" fill="#FF7F11" opacity="0.7" />
      <circle cx="28" cy="112" r="3.5" fill="#FF3F00" opacity="0.6" />

      {/* tilted photo card */}
      <g transform="rotate(-6 100 80)">
        <rect x="52" y="33" width="112" height="92" rx="14" fill="#FFFFFF" stroke="#EDE9E1" strokeWidth="2" />
        <circle cx="132" cy="57" r="9" fill="#FFD9A8" />
        <path d="M62 112 L94 74 L114 96 L134 64 L156 112 Z" fill="#BEB7A4" />
      </g>

      {/* upload badge */}
      <circle cx="148" cy="118" r="23" fill="#FF3F00" stroke="#FFFFFC" strokeWidth="4" />
      <path
        d="M148 129 V107 M140 115 L148 107 L156 115"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
