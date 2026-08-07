import { describe, expect, it } from 'vitest';
import {
  formatRemainingTime,
  isCheckInWindowOpen,
  resolveBedtimeCardState,
  resolveDashboardCopy,
  shouldShowAwakeInBedAnimation,
  shouldShowEnjoyingLifeAnimation,
  shouldShowSleepingInBedAnimation,
  shouldShowVeryWeakEatingAnimation,
  shouldShowWeakEatingAnimation,
} from '../utils/bedtimeCard';

const at = (hours: number, minutes = 0) => new Date(2026, 7, 5, hours, minutes);

describe('resolveBedtimeCardState', () => {
  it('counts down to the personal bedtime during the on-time window', () => {
    const state = resolveBedtimeCardState(at(22), '23:30', false, null);
    expect(state.mode).toBe('goal');
    expect(state.remainingMinutes).toBe(90);
  });

  it('switches to the 2 AM closing time after the personal bedtime', () => {
    const state = resolveBedtimeCardState(at(23, 45), '23:30', false, null);
    expect(state.mode).toBe('lateWindow');
    expect(state.remainingMinutes).toBe(135);
  });

  it('continues the late-window countdown after midnight', () => {
    const state = resolveBedtimeCardState(at(1, 15), '23:30', false, null);
    expect(state.mode).toBe('lateWindow');
    expect(state.remainingMinutes).toBe(45);
  });

  it('supports a midnight bedtime goal', () => {
    const beforeMidnight = resolveBedtimeCardState(at(23, 45), '00:00', false, null);
    const afterMidnight = resolveBedtimeCardState(at(0, 15), '00:00', false, null);
    expect(beforeMidnight.mode).toBe('goal');
    expect(beforeMidnight.remainingMinutes).toBe(15);
    expect(afterMidnight.mode).toBe('lateWindow');
  });

  it('hides countdown data after an on-time or late check-in', () => {
    expect(resolveBedtimeCardState(at(23), '23:30', true, 'onTime').mode).toBe('onTime');
    expect(resolveBedtimeCardState(at(1), '23:30', true, 'late').mode).toBe('late');
    expect(resolveBedtimeCardState(at(1), '23:30', true, 'late').remainingMinutes).toBeNull();
  });

  it('shows missing after the window and upcoming for a new ungraded night', () => {
    expect(resolveBedtimeCardState(at(10), '23:30', false, 'missing').mode).toBe('missing');
    expect(resolveBedtimeCardState(at(10), '23:30', false, null).mode).toBe('upcoming');
  });

  it('formats remaining time in compact English', () => {
    expect(formatRemainingTime(135)).toBe('2h 15m');
    expect(formatRemainingTime(45)).toBe('45m');
  });
});

describe('resolveDashboardCopy', () => {
  it('uses shared daytime copy and the real nickname', () => {
    const morning = resolveDashboardCopy(at(9), '00:00', false, null, 'healthy', 'Lisa');
    const afternoon = resolveDashboardCopy(at(15), '00:00', false, null, 'healthy', 'Lisa');

    expect(morning.greeting).toBe('Good morning, Lisa ☀️');
    expect(afternoon.greeting).toBe('Good afternoon, Lisa 🌿');
    expect(morning.subtitle).toBe('Koala is enjoying the day, one leaf at a time.');
    expect(afternoon.subtitle).toBe(morning.subtitle);
    expect(morning.actionText).toBe('Check-in opens at 9:00 PM.');
  });

  it('uses fatigue copy before the check-in window', () => {
    expect(resolveDashboardCopy(at(14), '00:00', false, null, 'weak', 'Lisa').subtitle)
      .toBe('Koala is feeling a little tired today.');
    expect(resolveDashboardCopy(at(19), '00:00', false, null, 'veryWeak', 'Lisa').subtitle)
      .toBe('Koala is exhausted and could use an earlier night.');
  });

  it('uses one slide instruction throughout the open unchecked window', () => {
    expect(resolveDashboardCopy(at(21), '00:00', false, null, 'healthy', 'Lisa').actionText)
      .toBe('Slide to tuck Koala in for tonight.');
    expect(resolveDashboardCopy(at(23, 30), '00:00', false, null, 'healthy', 'Lisa').actionText)
      .toBe('Slide to tuck Koala in for tonight.');
    expect(resolveDashboardCopy(at(1), '00:00', false, null, 'healthy', 'Lisa').actionText)
      .toBe('Slide to tuck Koala in for tonight.');
  });

  it('uses the same greeting for on-time, late, and missing outcomes', () => {
    const onTime = resolveDashboardCopy(at(23), '00:00', true, 'onTime', 'healthy', 'Lisa');
    const late = resolveDashboardCopy(at(1), '00:00', true, 'late', 'healthy', 'Lisa');
    const missing = resolveDashboardCopy(at(3), '00:00', false, 'missing', 'healthy', 'Lisa');

    expect(onTime.greeting).toBe('Good night, Lisa 💜');
    expect(late.greeting).toBe(onTime.greeting);
    expect(missing.greeting).toBe(onTime.greeting);
    expect(missing.subtitle).toBe('Koala missed some rest and is taking it slow.');
    expect(missing.actionText).toBe('Your next check-in opens at 9:00 PM.');
    expect(`${missing.subtitle} ${missing.actionText}`.toLowerCase()).not.toContain('tonight');
  });

  it('stops the previous night outcome from overriding daytime and evening copy', () => {
    const morningAfterCheckIn = resolveDashboardCopy(at(8), '00:00', true, 'onTime', 'healthy', 'Lisa');
    const eveningAfterLate = resolveDashboardCopy(at(19, 30), '00:00', true, 'late', 'healthy', 'Lisa');
    const eveningAfterMissing = resolveDashboardCopy(at(19, 30), '00:00', false, 'missing', 'healthy', 'Lisa');

    expect(morningAfterCheckIn.greeting).toBe('Good morning, Lisa ☀️');
    expect(eveningAfterLate.greeting).toBe('Good evening, Lisa ✨');
    expect(eveningAfterMissing.greeting).toBe('Good evening, Lisa ✨');
    expect(eveningAfterLate.subtitle).toBe('The day is slowing down. Bedtime is getting closer.');
    expect(eveningAfterLate.actionText).toBe('Check-in opens at 9:00 PM.');
  });

  it('opens check-in only between 9 PM and 2 AM inclusive', () => {
    expect(isCheckInWindowOpen(at(20, 59))).toBe(false);
    expect(isCheckInWindowOpen(at(21))).toBe(true);
    expect(isCheckInWindowOpen(at(2))).toBe(true);
    expect(isCheckInWindowOpen(at(2, 1))).toBe(false);
  });
});

describe('shouldShowEnjoyingLifeAnimation', () => {
  it('starts showing at exactly 8 AM for a healthy koala', () => {
    expect(shouldShowEnjoyingLifeAnimation(at(8), '23:30', 'healthy')).toBe(true);
  });

  it('does not show before 8 AM', () => {
    expect(shouldShowEnjoyingLifeAnimation(at(7, 59), '23:30', 'healthy')).toBe(false);
  });

  it('stops at exactly 30 minutes before bedtime', () => {
    expect(shouldShowEnjoyingLifeAnimation(at(22, 59), '23:30', 'healthy')).toBe(true);
    expect(shouldShowEnjoyingLifeAnimation(at(23), '23:30', 'healthy')).toBe(false);
  });

  it('supports a midnight bedtime', () => {
    expect(shouldShowEnjoyingLifeAnimation(at(23, 29), '00:00', 'healthy')).toBe(true);
    expect(shouldShowEnjoyingLifeAnimation(at(23, 30), '00:00', 'healthy')).toBe(false);
  });

  it('never shows for weak or very weak koalas', () => {
    expect(shouldShowEnjoyingLifeAnimation(at(12), '23:30', 'weak')).toBe(false);
    expect(shouldShowEnjoyingLifeAnimation(at(12), '23:30', 'veryWeak')).toBe(false);
  });
});

describe('shouldShowWeakEatingAnimation', () => {
  it('shows a weak koala during the daytime mood window', () => {
    expect(shouldShowWeakEatingAnimation(at(8), '23:30', 'weak')).toBe(true);
    expect(shouldShowWeakEatingAnimation(at(22, 59), '23:30', 'weak')).toBe(true);
  });

  it('does not override the morning or wind-down states', () => {
    expect(shouldShowWeakEatingAnimation(at(7, 59), '23:30', 'weak')).toBe(false);
    expect(shouldShowWeakEatingAnimation(at(23), '23:30', 'weak')).toBe(false);
  });

  it('does not show for healthy or very weak koalas', () => {
    expect(shouldShowWeakEatingAnimation(at(12), '23:30', 'healthy')).toBe(false);
    expect(shouldShowWeakEatingAnimation(at(12), '23:30', 'veryWeak')).toBe(false);
  });
});

describe('shouldShowVeryWeakEatingAnimation', () => {
  it('shows a very weak koala during the daytime mood window', () => {
    expect(shouldShowVeryWeakEatingAnimation(at(8), '23:30', 'veryWeak')).toBe(true);
    expect(shouldShowVeryWeakEatingAnimation(at(22, 59), '23:30', 'veryWeak')).toBe(true);
  });

  it('does not override the morning or wind-down states', () => {
    expect(shouldShowVeryWeakEatingAnimation(at(7, 59), '23:30', 'veryWeak')).toBe(false);
    expect(shouldShowVeryWeakEatingAnimation(at(23), '23:30', 'veryWeak')).toBe(false);
  });

  it('does not show for healthy or weak koalas', () => {
    expect(shouldShowVeryWeakEatingAnimation(at(12), '23:30', 'healthy')).toBe(false);
    expect(shouldShowVeryWeakEatingAnimation(at(12), '23:30', 'weak')).toBe(false);
  });
});

describe('shouldShowAwakeInBedAnimation', () => {
  it('starts 30 minutes before bedtime for an unchecked koala', () => {
    expect(shouldShowAwakeInBedAnimation(at(22, 59), '23:30', false, null)).toBe(false);
    expect(shouldShowAwakeInBedAnimation(at(23), '23:30', false, null)).toBe(true);
  });

  it('continues through the late check-in window', () => {
    expect(shouldShowAwakeInBedAnimation(at(23, 45), '23:30', false, null)).toBe(true);
    expect(shouldShowAwakeInBedAnimation(at(1, 59), '23:30', false, null)).toBe(true);
  });

  it('does not show after a check-in or a recorded miss', () => {
    expect(shouldShowAwakeInBedAnimation(at(23), '23:30', true, 'onTime')).toBe(false);
    expect(shouldShowAwakeInBedAnimation(at(1), '23:30', false, 'missing')).toBe(false);
  });
});

describe('shouldShowSleepingInBedAnimation', () => {
  it('shows after check-in through the nighttime and before 8 AM', () => {
    expect(shouldShowSleepingInBedAnimation(at(21), true)).toBe(true);
    expect(shouldShowSleepingInBedAnimation(at(3), true)).toBe(true);
    expect(shouldShowSleepingInBedAnimation(at(7, 59), true)).toBe(true);
  });

  it('returns to a daytime mood at 8 AM and never shows before check-in', () => {
    expect(shouldShowSleepingInBedAnimation(at(8), true)).toBe(false);
    expect(shouldShowSleepingInBedAnimation(at(23), false)).toBe(false);
  });
});
