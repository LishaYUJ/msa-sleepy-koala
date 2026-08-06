import { describe, expect, it } from 'vitest';
import {
  formatRemainingTime,
  resolveBedtimeCardState,
  shouldShowEnjoyingLifeAnimation,
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
