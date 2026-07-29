import { describe, it, expect } from 'vitest';
import { getCurrentSleepDateString, getLocalDateString, getLocalTimeString } from '../stores/useStore';

// localStorage is mocked in setup.ts via Object.defineProperty


describe('getLocalDateString', () => {
  it('returns today in yyyy-MM-dd format', () => {
    const result = getLocalDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formats a specific date correctly', () => {
    const d = new Date(2025, 5, 7); // June 7 2025 (month is 0-indexed)
    expect(getLocalDateString(d)).toBe('2025-06-07');
  });

  it('pads single-digit months and days with zeroes', () => {
    const d = new Date(2025, 0, 3); // January 3
    expect(getLocalDateString(d)).toBe('2025-01-03');
  });

  it('handles year-end date (December 31)', () => {
    const d = new Date(2025, 11, 31);
    expect(getLocalDateString(d)).toBe('2025-12-31');
  });
});

// ─── getLocalTimeString ─────────────────────────────────────────────────────

describe('getLocalTimeString', () => {
  it('returns time in HH:mm format', () => {
    const result = getLocalTimeString();
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('formats midnight as 00:00', () => {
    const d = new Date(2025, 0, 1, 0, 0, 0);
    expect(getLocalTimeString(d)).toBe('00:00');
  });

  it('formats noon as 12:00', () => {
    const d = new Date(2025, 0, 1, 12, 0, 0);
    expect(getLocalTimeString(d)).toBe('12:00');
  });

  it('pads single-digit hours and minutes', () => {
    const d = new Date(2025, 0, 1, 9, 5, 0);
    expect(getLocalTimeString(d)).toBe('09:05');
  });

  it('formats 23:59 correctly', () => {
    const d = new Date(2025, 0, 1, 23, 59, 0);
    expect(getLocalTimeString(d)).toBe('23:59');
  });
});

describe('getCurrentSleepDateString', () => {
  it('uses the same date during the evening check-in window', () => {
    const d = new Date(2026, 6, 28, 21, 0, 0);
    expect(getCurrentSleepDateString(d)).toBe('2026-07-28');
  });

  it('uses the previous date after midnight', () => {
    const d = new Date(2026, 6, 29, 0, 10, 0);
    expect(getCurrentSleepDateString(d)).toBe('2026-07-28');
  });

  it('keeps showing the previous sleep date during the day before the next window', () => {
    const d = new Date(2026, 6, 29, 14, 30, 0);
    expect(getCurrentSleepDateString(d)).toBe('2026-07-28');
  });

  it('rolls to the new sleep date at 21:00', () => {
    const d = new Date(2026, 6, 29, 21, 0, 0);
    expect(getCurrentSleepDateString(d)).toBe('2026-07-29');
  });
});
