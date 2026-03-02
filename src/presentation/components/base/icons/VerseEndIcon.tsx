import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

export const VerseEndIcon: React.FC<IconProps> = ({
  className = '',
  size = 36,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 120"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Pointed Frame */}
      <path
        d="M 50,8
           C 55,18 68,16 75,25
           C 86,35 94,45 94,60
           C 94,75 86,85 75,95
           C 68,104 55,102 50,112
           C 45,102 32,104 25,95
           C 14,85 6,75 6,60
           C 6,45 14,35 25,25
           C 32,16 45,18 50,8 Z"
        strokeWidth="3.5"
      />

      {/* Inner Oval */}
      <ellipse cx="50" cy="60" rx="26" ry="32" strokeWidth="2" />

      {/* Top Stem & Curls */}
      <path d="M 50,8 L 50,28" strokeWidth="3" />
      <path
        d="M 50,16 C 60,16 68,22 68,30 C 68,36 62,38 58,34 C 55,31 58,26 62,28"
        strokeWidth="2.5"
      />
      <path
        d="M 50,16 C 40,16 32,22 32,30 C 32,36 38,38 42,34 C 45,31 42,26 38,28"
        strokeWidth="2.5"
      />

      {/* Bottom Stem & Curls */}
      <path d="M 50,112 L 50,92" strokeWidth="3" />
      <path
        d="M 50,104 C 60,104 68,98 68,90 C 68,84 62,82 58,86 C 55,89 58,94 62,92"
        strokeWidth="2.5"
      />
      <path
        d="M 50,104 C 40,104 32,98 32,90 C 32,84 38,82 42,86 C 45,89 42,94 38,92"
        strokeWidth="2.5"
      />
    </g>

    {/* Decorative Finials (Top & Bottom Diamonds) */}
    <path d="M 50,0 L 53,4 L 50,8 L 47,4 Z" fill="currentColor" />
    <path d="M 50,120 L 53,116 L 50,112 L 47,116 Z" fill="currentColor" />
  </svg>
);
