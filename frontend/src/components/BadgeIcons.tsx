import React from 'react';

export interface BadgeIconProps {
  isLocked?: boolean;
}

export const FirstSleepIcon: React.FC<BadgeIconProps> = ({ isLocked }) => {
  const base = isLocked ? '#E2E8F0' : '#818CF8';
  const shadow = isLocked ? '#CBD5E1' : '#6366F1';
  const moon = isLocked ? '#94A3B8' : '#FEF08A';
  const moonShadow = isLocked ? '#64748B' : '#FDE047';
  
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="44" r="36" fill={shadow} />
      <circle cx="40" cy="40" r="36" fill={base} />
      
      {/* Highlight on base */}
      <path d="M10 24C15 12 28 4 40 4C58 4 72 16 75 32C71 16 56 6 40 6C24 6 12 18 8 32C8 29 9 26 10 24Z" fill="#ffffff" opacity="0.3" />

      {/* Moon */}
      <path d="M48 24C38 24 30 32 30 42C30 52 38 60 48 60C43 60 28 58 28 42C28 26 43 24 48 24Z" fill={moonShadow} />
      <path d="M50 22C40 22 32 30 32 40C32 50 40 58 50 58C45 58 30 56 30 40C30 24 45 22 50 22Z" fill={moon} />
      
      {!isLocked && (
        <>
          <path d="M52 28L56 28L52 32H56" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M60 20L63 20L60 23H63" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="24" r="3" fill="white" opacity="0.6" />
          <circle cx="56" cy="52" r="2" fill="white" opacity="0.6" />
        </>
      )}
    </svg>
  );
};

export const ThreeDayIcon: React.FC<BadgeIconProps> = ({ isLocked }) => {
  const base = isLocked ? '#E2E8F0' : '#34D399';
  const shadow = isLocked ? '#CBD5E1' : '#059669';
  const starBase = isLocked ? '#94A3B8' : '#FCD34D';
  const starShadow = isLocked ? '#64748B' : '#F59E0B';
  
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8L70 24V50C70 68 40 80 40 80C40 80 10 68 10 50V24L40 8Z" fill={shadow} />
      <path d="M40 4L70 20V46C70 64 40 76 40 76C40 76 10 64 10 46V20L40 4Z" fill={base} />
      
      {/* Shield Highlight */}
      <path d="M12 24L40 8L68 24C65 14 50 8 40 8C30 8 15 14 12 24Z" fill="#ffffff" opacity="0.3" />

      {/* Main Star */}
      <path d="M40 24L43 36H55L45 42L49 54L40 46L31 54L35 42L25 36H37L40 24Z" fill={starShadow} />
      <path d="M40 20L43 32H55L45 38L49 50L40 42L31 50L35 38L25 32H37L40 20Z" fill={starBase} />

      {/* Left Star */}
      <path d="M22 22L24 28H30L25 32L27 38L22 34L17 38L19 32L14 28H20L22 22Z" fill={starShadow} />
      <path d="M22 18L24 24H30L25 28L27 34L22 30L17 34L19 28L14 24H20L22 18Z" fill={starBase} />

      {/* Right Star */}
      <path d="M58 22L60 28H66L61 32L63 38L58 34L53 38L55 32L50 28H56L58 22Z" fill={starShadow} />
      <path d="M58 18L60 24H66L61 28L63 34L58 30L53 34L55 28L50 24H56L58 18Z" fill={starBase} />
    </svg>
  );
};

export const OneWeekIcon: React.FC<BadgeIconProps> = ({ isLocked }) => {
  const base = isLocked ? '#E2E8F0' : '#FBBF24';
  const shadow = isLocked ? '#CBD5E1' : '#D97706';
  const crownBase = isLocked ? '#94A3B8' : '#FFFBEB';
  const crownShadow = isLocked ? '#64748B' : '#FEF08A';
  const jewel = isLocked ? '#64748B' : '#F43F5E';
  
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Octagon base */}
      <path d="M24 76L4 56V24L24 4H56L76 24V56L56 76H24Z" fill={shadow} />
      <path d="M24 72L4 52V20L24 0H56L76 20V52L56 72H24Z" fill={base} />
      
      {/* Octagon Highlight */}
      <path d="M24 4H56L72 20C66 8 50 2 36 2C24 2 12 8 8 20L24 4Z" fill="#ffffff" opacity="0.3" />

      {/* Crown */}
      <path d="M20 58L14 26L28 38L40 18L52 38L66 26L60 58H20Z" fill={crownShadow} />
      <path d="M20 54L14 22L28 34L40 14L52 34L66 22L60 54H20Z" fill={crownBase} />
      
      {/* Jewels */}
      <circle cx="40" cy="42" r="6" fill={jewel} />
      <circle cx="26" cy="44" r="4" fill={jewel} />
      <circle cx="54" cy="44" r="4" fill={jewel} />

      {/* Sparkles */}
      {!isLocked && (
        <>
          <path d="M40 4L42 8L46 10L42 12L40 16L38 12L34 10L38 8L40 4Z" fill="white" />
          <path d="M12 12L13 15L16 16L13 17L12 20L11 17L8 16L11 15L12 12Z" fill="white" />
          <path d="M68 12L69 15L72 16L69 17L68 20L67 17L64 16L67 15L68 12Z" fill="white" />
        </>
      )}
    </svg>
  );
};

export const BadgeGraphic: React.FC<{ name: string; isLocked?: boolean }> = ({ name, isLocked }) => {
  if (name.includes('First')) return <FirstSleepIcon isLocked={isLocked} />;
  if (name.includes('3-Day') || name.includes('3 Day')) return <ThreeDayIcon isLocked={isLocked} />;
  if (name.includes('Week') || name.includes('7-Day')) return <OneWeekIcon isLocked={isLocked} />;
  
  // Fallback
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="44" r="36" fill={isLocked ? '#CBD5E1' : '#94A3B8'} />
      <circle cx="40" cy="40" r="36" fill={isLocked ? '#E2E8F0' : '#CBD5E1'} />
      <circle cx="40" cy="40" r="16" fill={isLocked ? '#94A3B8' : '#F1F5F9'} />
    </svg>
  );
};
