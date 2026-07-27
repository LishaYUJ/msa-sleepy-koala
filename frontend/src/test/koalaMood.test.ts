import { describe, it, expect } from 'vitest';

// ─── Koala Mood Resolution Logic ───────────────────────────────────────────
// Extracted from Dashboard.tsx so it can be unit-tested independently.

interface KoalaMoodInput {
  todayCheckedIn: boolean;
  todayStatus: string | null;
  consecutiveBadDays: number;
  cutoffTime: string; // HH:mm
  now: Date;
}

function resolveKoalaMood(input: KoalaMoodInput): string {
  const { todayCheckedIn, todayStatus, consecutiveBadDays, cutoffTime, now } = input;

  if (todayCheckedIn) {
    return todayStatus === 'late' ? 'LATE_SLEEPING' : 'SLEEPING';
  }

  if (consecutiveBadDays >= 4) return 'VERY_WEAK';
  if (consecutiveBadDays >= 2) return 'WEAK';

  const [cutoffHour, cutoffMin] = cutoffTime.split(':').map(Number);
  const cutoffMinutes = cutoffHour * 60 + cutoffMin;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (nowMinutes >= cutoffMinutes) return 'MISSED';
  if (nowMinutes >= cutoffMinutes - 30) return 'WINDING_DOWN';
  return 'DEFAULT';
}

// ──────────────────────────────────────────────────────────────────────────

function makeDate(hour: number, minute = 0): Date {
  const d = new Date(2025, 0, 15); // arbitrary fixed date
  d.setHours(hour, minute, 0, 0);
  return d;
}

const baseInput: KoalaMoodInput = {
  todayCheckedIn: false,
  todayStatus: null,
  consecutiveBadDays: 0,
  cutoffTime: '23:30',
  now: makeDate(21, 0), // 21:00
};

describe('resolveKoalaMood – checked in today', () => {
  it('returns SLEEPING when checked in on time', () => {
    const result = resolveKoalaMood({ ...baseInput, todayCheckedIn: true, todayStatus: 'onTime' });
    expect(result).toBe('SLEEPING');
  });

  it('returns LATE_SLEEPING when checked in late', () => {
    const result = resolveKoalaMood({ ...baseInput, todayCheckedIn: true, todayStatus: 'late' });
    expect(result).toBe('LATE_SLEEPING');
  });

  it('SLEEPING takes priority over bad streak history', () => {
    const result = resolveKoalaMood({
      ...baseInput,
      todayCheckedIn: true,
      todayStatus: 'onTime',
      consecutiveBadDays: 5, // would normally be VERY_WEAK
    });
    expect(result).toBe('SLEEPING');
  });
});

describe('resolveKoalaMood – consecutive bad days (not yet checked in)', () => {
  it('returns VERY_WEAK when consecutiveBadDays >= 4', () => {
    expect(resolveKoalaMood({ ...baseInput, consecutiveBadDays: 4 })).toBe('VERY_WEAK');
    expect(resolveKoalaMood({ ...baseInput, consecutiveBadDays: 7 })).toBe('VERY_WEAK');
  });

  it('returns WEAK when consecutiveBadDays is 2 or 3', () => {
    expect(resolveKoalaMood({ ...baseInput, consecutiveBadDays: 2 })).toBe('WEAK');
    expect(resolveKoalaMood({ ...baseInput, consecutiveBadDays: 3 })).toBe('WEAK');
  });

  it('WEAK/VERY_WEAK take priority over time-based states', () => {
    // It is 23:40 – past cutoff, which would normally be MISSED
    const pastCutoff = makeDate(23, 40);
    expect(
      resolveKoalaMood({ ...baseInput, consecutiveBadDays: 4, now: pastCutoff })
    ).toBe('VERY_WEAK');
  });
});

describe('resolveKoalaMood – time-based states (not checked in, healthy streak)', () => {
  it('returns DEFAULT well before cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(21, 0) }); // 21:00, cutoff 23:30
    expect(result).toBe('DEFAULT');
  });

  it('returns WINDING_DOWN within 30 min of cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 10) }); // 23:10, cutoff 23:30
    expect(result).toBe('WINDING_DOWN');
  });

  it('returns WINDING_DOWN exactly 30 min before cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 0) }); // 23:00, cutoff 23:30
    expect(result).toBe('WINDING_DOWN');
  });

  it('returns MISSED when current time is at cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 30) }); // 23:30 == cutoff
    expect(result).toBe('MISSED');
  });

  it('returns MISSED when current time is past cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 55) }); // 23:55, cutoff 23:30
    expect(result).toBe('MISSED');
  });

  it('returns DEFAULT one minute before WINDING_DOWN window', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(22, 59) }); // 22:59, cutoff 23:30
    expect(result).toBe('DEFAULT');
  });
});

describe('resolveKoalaMood – edge cases', () => {
  it('consecutiveBadDays of 1 does not trigger WEAK', () => {
    const result = resolveKoalaMood({ ...baseInput, consecutiveBadDays: 1, now: makeDate(21, 0) });
    expect(result).toBe('DEFAULT');
  });

  it('handles midnight cutoff correctly', () => {
    const midnightCutoff = { ...baseInput, cutoffTime: '00:00', now: makeDate(0, 5) };
    expect(resolveKoalaMood(midnightCutoff)).toBe('MISSED');
  });

  it('handles early cutoff (20:00) correctly', () => {
    // 19:35 is 25 min before 20:00 cutoff → WINDING_DOWN
    const result = resolveKoalaMood({ ...baseInput, cutoffTime: '20:00', now: makeDate(19, 35) });
    expect(result).toBe('WINDING_DOWN');
  });
});
