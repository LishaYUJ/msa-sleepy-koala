import React, { useMemo } from 'react';

interface TimeGoalPickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const TimeGoalPicker: React.FC<TimeGoalPickerProps> = ({ value, onChange, id }) => {
  const options = useMemo(() => {
    const opts = [];
    for (let h = 21; h <= 23; h++) {
      for (let m = 0; m < 60; m += 5) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const displayH = h > 12 ? h - 12 : h;
        opts.push({ value: `${hh}:${mm}`, label: `${displayH}:${mm} PM` });
      }
    }
    opts.push({ value: '00:00', label: '12:00 AM (Midnight)' });
    
    // Ensure current value exists in the dropdown if it was custom set before
    if (value && !opts.find(o => o.value === value)) {
      const [vh, vm] = value.split(':');
      const hInt = parseInt(vh);
      if (!isNaN(hInt)) {
        const displayH = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);
        const ampm = hInt >= 12 && hInt < 24 ? 'PM' : 'AM';
        opts.push({ value, label: `${displayH}:${vm} ${ampm} (Custom)` });
        opts.sort((a, b) => a.value.localeCompare(b.value));
      }
    }
    
    return opts;
  }, [value]);

  return (
    <div style={{ position: 'relative' }}>
      <select 
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ 
          width: '100%', 
          minHeight: '58px', 
          padding: '10px 16px', 
          borderRadius: '14px', 
          border: '1px solid var(--input-border)', 
          background: 'var(--input-bg)', 
          color: 'var(--text-main)', 
          font: 'inherit', 
          fontSize: '1.05rem', 
          appearance: 'none', 
          WebkitAppearance: 'none' 
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
        ▼
      </div>
    </div>
  );
};
