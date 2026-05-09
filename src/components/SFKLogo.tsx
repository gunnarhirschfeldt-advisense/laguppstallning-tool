type Props = { size?: number; className?: string };

export function SFKLogo({ size = 40, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gold outer shield */}
      <path
        d="M50 1 C37 1 10 7 6 23 C3 35 3 52 50 103 C97 52 97 35 94 23 C90 7 63 1 50 1Z"
        fill="#C1AA7C"
      />
      {/* Black border */}
      <path
        d="M50 8 C39 8 16 13 12 27 C9 38 9 53 50 96 C91 53 91 38 88 27 C84 13 61 8 50 8Z"
        fill="#000000"
      />
      {/* White inner field */}
      <path
        d="M50 16 C41 16 22 20 18 32 C16 41 16 54 50 89 C84 54 84 41 82 32 C78 20 59 16 50 16Z"
        fill="#FFFFFF"
      />

      {/* SFK text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="#000000"
        letterSpacing="-0.5"
      >
        SFK
      </text>

      {/* 5 pillars in lower half */}
      {/* Pillar positions: clip to shield shape using a clipPath */}
      <defs>
        <clipPath id="shield-clip">
          <path d="M50 16 C41 16 22 20 18 32 C16 41 16 54 50 89 C84 54 84 41 82 32 C78 20 59 16 50 16Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#shield-clip)">
        {/* Horizontal divider line */}
        <rect x="16" y="54" width="68" height="2.5" fill="#000000" />
        {/* 5 pillars */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect
            key={i}
            x={21 + i * 13}
            y="58"
            width="8"
            height="35"
            fill="#000000"
            rx="1"
          />
        ))}
      </g>
    </svg>
  );
}
