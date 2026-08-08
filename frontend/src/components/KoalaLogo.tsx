import React from 'react';

export const KoalaLogo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Stars */}
    <path d="M 25 12 L 27 20 L 35 22 L 27 24 L 25 32 L 23 24 L 15 22 L 23 20 Z" fill="currentColor"/>
    <path d="M 75 16 L 76.5 21 L 81.5 22.5 L 76.5 24 L 75 29 L 73.5 24 L 68.5 22.5 L 73.5 21 Z" fill="currentColor"/>
    <path d="M 85 58 L 86 62 L 90 63 L 86 64 L 85 68 L 84 64 L 80 63 L 84 62 Z" fill="currentColor"/>
    <path d="M 12 62 L 13 65 L 16 66 L 13 67 L 12 70 L 11 67 L 8 66 L 11 65 Z" fill="currentColor"/>

    {/* Koala Line Drawing */}
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      {/* Left Ear */}
      <path d="M 32 46 C 10 30 15 70 30 70" />
      
      {/* Right Ear */}
      <path d="M 68 46 C 90 30 85 70 70 70" />
      
      {/* Head Outline */}
      <path d="M 32 46 C 35 26 65 26 68 46 C 75 60 70 82 50 82 C 30 82 25 60 32 46 Z" />
      
      {/* Left Inner Ear */}
      <path d="M 28 52 C 20 45 20 62 27 63" strokeWidth="2.5" />
      
      {/* Right Inner Ear */}
      <path d="M 72 52 C 80 45 80 62 73 63" strokeWidth="2.5" />

      {/* Nose (Filled) */}
      <ellipse cx="50" cy="65" rx="7" ry="10" fill="currentColor" stroke="none" />
      
      {/* Left Eye (Sleepy) */}
      <path d="M 34 54 Q 39 60 44 54" />
      {/* Right Eye (Sleepy) */}
      <path d="M 56 54 Q 61 60 66 54" />
    </g>
  </svg>
);
