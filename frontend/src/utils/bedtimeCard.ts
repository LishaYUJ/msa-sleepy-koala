export type BedtimeCardMode = 'goal' | 'lateWindow' | 'onTime' | 'late' | 'missing' | 'upcoming';

export interface BedtimeCardState {
  mode: BedtimeCardMode;
  title: "Tonight's bedtime" | "Last night's bedtime";
  remainingMinutes: number | null;
  progressPercent: number;
}

const CHECK_IN_START_MINUTES = 21 * 60;
const CHECK_IN_END_MINUTES = 2 * 60;

const parseCutoffMinutes = (cutoffTime?: string) => {
  const [hours, minutes] = (cutoffTime || '23:30').split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 23 * 60 + 30;
  return hours * 60 + minutes;
};

const isDaytimeKoalaWindow = (now: Date, cutoffTime?: string) => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = parseCutoffMinutes(cutoffTime);
  const windDownStartMinutes = cutoffMinutes === 0
    ? 23 * 60 + 30
    : cutoffMinutes - 30;

  return nowMinutes >= 8 * 60 && nowMinutes < windDownStartMinutes;
};

export const shouldShowEnjoyingLifeAnimation = (
  now: Date,
  cutoffTime: string | undefined,
  fatigueState: 'healthy' | 'weak' | 'veryWeak' | undefined,
) => {
  if (fatigueState !== 'healthy') return false;
  return isDaytimeKoalaWindow(now, cutoffTime);
};

export const shouldShowWeakEatingAnimation = (
  now: Date,
  cutoffTime: string | undefined,
  fatigueState: 'healthy' | 'weak' | 'veryWeak' | undefined,
) => fatigueState === 'weak' && isDaytimeKoalaWindow(now, cutoffTime);

export const shouldShowVeryWeakEatingAnimation = (
  now: Date,
  cutoffTime: string | undefined,
  fatigueState: 'healthy' | 'weak' | 'veryWeak' | undefined,
) => fatigueState === 'veryWeak' && isDaytimeKoalaWindow(now, cutoffTime);

export const resolveBedtimeCardState = (
  now: Date,
  cutoffTime: string | undefined,
  todayCheckedIn: boolean,
  todayStatus: string | null | undefined,
): BedtimeCardState => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = parseCutoffMinutes(cutoffTime);
  const isCheckInWindow = nowMinutes >= CHECK_IN_START_MINUTES || nowMinutes <= CHECK_IN_END_MINUTES;
  const isDaytime = nowMinutes > CHECK_IN_END_MINUTES && nowMinutes < CHECK_IN_START_MINUTES;
  const resultTitle = isDaytime ? "Last night's bedtime" : "Tonight's bedtime";

  if (todayCheckedIn) {
    return {
      mode: todayStatus === 'late' ? 'late' : 'onTime',
      title: resultTitle,
      remainingMinutes: null,
      progressPercent: 0,
    };
  }

  if (todayStatus === 'missing') {
    return {
      mode: 'missing',
      title: resultTitle,
      remainingMinutes: null,
      progressPercent: 0,
    };
  }

  if (!isCheckInWindow) {
    return {
      mode: 'upcoming',
      title: "Tonight's bedtime",
      remainingMinutes: null,
      progressPercent: 0,
    };
  }

  const isBeforeOrAtGoal = nowMinutes >= CHECK_IN_START_MINUTES
    ? cutoffMinutes === 0 || nowMinutes <= cutoffMinutes
    : cutoffMinutes === 0 && nowMinutes === 0;

  if (isBeforeOrAtGoal) {
    const remainingMinutes = cutoffMinutes === 0
      ? 24 * 60 - nowMinutes
      : Math.max(0, cutoffMinutes - nowMinutes);
    const goalWindowMinutes = Math.max(
      1,
      cutoffMinutes === 0
        ? 24 * 60 - CHECK_IN_START_MINUTES
        : cutoffMinutes - CHECK_IN_START_MINUTES,
    );

    return {
      mode: 'goal',
      title: "Tonight's bedtime",
      remainingMinutes,
      progressPercent: Math.max(0, Math.min(100, (remainingMinutes / goalWindowMinutes) * 100)),
    };
  }

  const remainingMinutes = nowMinutes >= CHECK_IN_START_MINUTES
    ? 24 * 60 - nowMinutes + CHECK_IN_END_MINUTES
    : Math.max(0, CHECK_IN_END_MINUTES - nowMinutes);
  const lateWindowMinutes = cutoffMinutes === 0
    ? CHECK_IN_END_MINUTES
    : 24 * 60 - cutoffMinutes + CHECK_IN_END_MINUTES;

  return {
    mode: 'lateWindow',
    title: "Tonight's bedtime",
    remainingMinutes,
    progressPercent: Math.max(0, Math.min(100, (remainingMinutes / Math.max(1, lateWindowMinutes)) * 100)),
  };
};

export const formatRemainingTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};
