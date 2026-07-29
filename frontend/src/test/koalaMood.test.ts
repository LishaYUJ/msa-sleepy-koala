import { describe, it, expect } from 'vitest';

// ─── Koala Mood Resolution Logic ───────────────────────────────────────────
// Extracted from Dashboard.tsx so it can be unit-tested independently.

interface KoalaMoodInput {
  todayCheckedIn: boolean;
  todayStatus: string | null;
  fatigueState: 'healthy' | 'weak' | 'veryWeak';
  cutoffTime: string; // HH:mm
  now: Date;
}

function resolveKoalaMood(input: KoalaMoodInput): string {
  const { todayCheckedIn, todayStatus, fatigueState, cutoffTime, now } = input;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [cutoffHour, cutoffMin] = cutoffTime.split(':').map(Number);
  const cutoffMinutes = cutoffHour * 60 + cutoffMin;
  const windingDownStart = cutoffMinutes === 0 ? 23 * 60 + 30 : cutoffMinutes - 30;
  const isCheckInWindow = nowMinutes >= 21 * 60 || nowMinutes <= 2 * 60;
  const isBeforeMorningWake = nowMinutes < 8 * 60;
  const isWindingDown = cutoffMinutes === 0
    ? nowMinutes >= windingDownStart
    : nowMinutes >= windingDownStart && nowMinutes < cutoffMinutes;
  const isWaitingLate = cutoffMinutes === 0
    ? nowMinutes <= 2 * 60
    : nowMinutes >= cutoffMinutes || nowMinutes <= 2 * 60;

  if (todayCheckedIn) {
    if (isBeforeMorningWake || isCheckInWindow) {
      return todayStatus === 'late' ? 'LATE_SLEEPING' : 'SLEEPING';
    }
    return fatigueState === 'veryWeak' ? 'VERY_WEAK' : fatigueState === 'weak' ? 'WEAK' : 'ENJOYING_LIFE';
  }

  if (todayStatus === 'missing') {
    if (isBeforeMorningWake) return 'MISSED_SLEEPING';
    return fatigueState === 'veryWeak' ? 'VERY_WEAK' : 'WEAK';
  }

  if (isWindingDown) return 'MEDITATING';
  if (isWaitingLate) return 'WAITING_LATE';
  return fatigueState === 'veryWeak' ? 'VERY_WEAK' : fatigueState === 'weak' ? 'WEAK' : 'ENJOYING_LIFE';
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
  fatigueState: 'healthy',
  cutoffTime: '23:30',
  now: makeDate(21, 0), // 21:00
};

describe('resolveKoalaMood – checked in today', () => {
  it('returns SLEEPING when checked in on time', () => {
    const result = resolveKoalaMood({ ...baseInput, todayCheckedIn: true, todayStatus: 'onTime', now: makeDate(23, 0) });
    expect(result).toBe('SLEEPING');
  });

  it('returns LATE_SLEEPING when checked in late', () => {
    const result = resolveKoalaMood({ ...baseInput, todayCheckedIn: true, todayStatus: 'late', now: makeDate(23, 0) });
    expect(result).toBe('LATE_SLEEPING');
  });

  it('returns ENJOYING_LIFE after morning wake when checked in', () => {
    const result = resolveKoalaMood({
      ...baseInput,
      todayCheckedIn: true,
      todayStatus: 'onTime',
      now: makeDate(10, 0),
    });
    expect(result).toBe('ENJOYING_LIFE');
  });
});

describe('resolveKoalaMood – fatigue state', () => {
  it('returns VERY_WEAK during daytime when fatigueState is veryWeak', () => {
    expect(resolveKoalaMood({ ...baseInput, fatigueState: 'veryWeak', now: makeDate(10, 0) })).toBe('VERY_WEAK');
  });

  it('returns WEAK during daytime when fatigueState is weak', () => {
    expect(resolveKoalaMood({ ...baseInput, fatigueState: 'weak', now: makeDate(10, 0) })).toBe('WEAK');
  });

  it('time-based bedtime states take priority over fatigue before sleep', () => {
    expect(
      resolveKoalaMood({ ...baseInput, fatigueState: 'veryWeak', now: makeDate(23, 40) })
    ).toBe('WAITING_LATE');
  });
});

describe('resolveKoalaMood – time-based states (not checked in, healthy streak)', () => {
  it('returns ENJOYING_LIFE well before cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(21, 0) });
    expect(result).toBe('ENJOYING_LIFE');
  });

  it('returns MEDITATING within 30 min of cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 10) }); // 23:10, cutoff 23:30
    expect(result).toBe('MEDITATING');
  });

  it('returns MEDITATING exactly 30 min before cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 0) }); // 23:00, cutoff 23:30
    expect(result).toBe('MEDITATING');
  });

  it('returns WAITING_LATE when current time is at cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 30) }); // 23:30 == cutoff
    expect(result).toBe('WAITING_LATE');
  });

  it('returns WAITING_LATE when current time is past cutoff but before 02:00', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(23, 55) }); // 23:55, cutoff 23:30
    expect(result).toBe('WAITING_LATE');
  });

  it('returns ENJOYING_LIFE one minute before MEDITATING window', () => {
    const result = resolveKoalaMood({ ...baseInput, now: makeDate(22, 59) }); // 22:59, cutoff 23:30
    expect(result).toBe('ENJOYING_LIFE');
  });

  it('returns MISSED_SLEEPING after 02:00 and before 08:00 when missing', () => {
    const result = resolveKoalaMood({ ...baseInput, todayStatus: 'missing', fatigueState: 'weak', now: makeDate(3, 0) });
    expect(result).toBe('MISSED_SLEEPING');
  });

  it('supports a midnight cutoff winding-down window', () => {
    const result = resolveKoalaMood({ ...baseInput, cutoffTime: '00:00', now: makeDate(23, 45) });
    expect(result).toBe('MEDITATING');
  });
});

describe('resolveKoalaMood – edge cases', () => {
  it('healthy fatigue keeps the koala in ENJOYING_LIFE before wind-down', () => {
    const result = resolveKoalaMood({ ...baseInput, fatigueState: 'healthy', now: makeDate(21, 0) });
    expect(result).toBe('ENJOYING_LIFE');
  });

  it('handles midnight cutoff after midnight as WAITING_LATE', () => {
    const midnightCutoff = { ...baseInput, cutoffTime: '00:00', now: makeDate(0, 5) };
    expect(resolveKoalaMood(midnightCutoff)).toBe('WAITING_LATE');
  });

  it('returns WAITING_LATE after midnight for a regular cutoff', () => {
    const result = resolveKoalaMood({ ...baseInput, cutoffTime: '22:00', now: makeDate(1, 35) });
    expect(result).toBe('WAITING_LATE');
  });
});
