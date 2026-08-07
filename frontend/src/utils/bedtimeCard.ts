export type BedtimeCardMode = 'goal' | 'lateWindow' | 'onTime' | 'late' | 'missing' | 'upcoming';

export interface BedtimeCardState {
  mode: BedtimeCardMode;
  title: "Tonight's bedtime" | "Last night's bedtime";
  remainingMinutes: number | null;
  progressPercent: number;
}

export interface DashboardCopy {
  greeting: string;
  subtitle: string;
  actionText: string;
}

const CHECK_IN_START_MINUTES = 21 * 60;
const CHECK_IN_END_MINUTES = 2 * 60;

const parseCutoffMinutes = (cutoffTime?: string) => {
  const [hours, minutes] = (cutoffTime || '23:30').split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 23 * 60 + 30;
  return hours * 60 + minutes;
};

export const isCheckInWindowOpen = (now: Date) => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= CHECK_IN_START_MINUTES || nowMinutes <= CHECK_IN_END_MINUTES;
};

export const resolveDashboardCopy = (
  now: Date,
  cutoffTime: string | undefined,
  todayCheckedIn: boolean,
  todayStatus: string | null | undefined,
  fatigueState: 'healthy' | 'weak' | 'veryWeak' | undefined,
  nickname: string | null | undefined,
): DashboardCopy => {
  const name = nickname?.trim() || 'Koala';
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isNightOutcomeWindow = nowMinutes >= CHECK_IN_START_MINUTES || nowMinutes < 8 * 60;

  if (isNightOutcomeWindow && todayCheckedIn) {
    if (todayStatus === 'late') {
      return {
        greeting: `Good night, ${name} 💜`,
        subtitle: 'Koala is finally tucked in for some well-earned rest.',
        actionText: 'Late check-in recorded. Tomorrow is a fresh start.',
      };
    }

    return {
      greeting: `Good night, ${name} 💜`,
      subtitle: 'Koala is sleeping soundly.',
      actionText: 'Bedtime check-in recorded. Right on time.',
    };
  }

  if (isNightOutcomeWindow && todayStatus === 'missing') {
    return {
      greeting: `Good night, ${name} 💜`,
      subtitle: 'Koala missed some rest and is taking it slow.',
      actionText: 'Your next check-in opens at 9:00 PM.',
    };
  }

  const cutoffMinutes = parseCutoffMinutes(cutoffTime);
  const windDownStartMinutes = cutoffMinutes === 0
    ? 23 * 60 + 30
    : cutoffMinutes - 30;
  const inCheckInWindow = isCheckInWindowOpen(now);

  if (inCheckInWindow) {
    const isAfterBedtime = cutoffMinutes === 0
      ? nowMinutes > 0 && nowMinutes <= CHECK_IN_END_MINUTES
      : nowMinutes >= CHECK_IN_START_MINUTES
        ? nowMinutes > cutoffMinutes
        : nowMinutes <= CHECK_IN_END_MINUTES;

    if (isAfterBedtime) {
      return {
        greeting: `Still awake, ${name}?`,
        subtitle: 'It is past your bedtime, but you can still check in.',
        actionText: 'Slide to tuck Koala in for tonight.',
      };
    }

    if (nowMinutes >= windDownStartMinutes || (cutoffMinutes === 0 && nowMinutes === 0)) {
      return {
        greeting: `Almost bedtime, ${name} 🌙`,
        subtitle: 'Koala is cozy in bed and waiting for you.',
        actionText: 'Slide to tuck Koala in for tonight.',
      };
    }

    return {
      greeting: `Bedtime check-in is open, ${name} 🌙`,
      subtitle: 'Check in whenever you are ready to wind down.',
      actionText: 'Slide to tuck Koala in for tonight.',
    };
  }

  const daytimeSubtitle = fatigueState === 'veryWeak'
    ? 'Koala is exhausted and could use an earlier night.'
    : fatigueState === 'weak'
      ? 'Koala is feeling a little tired today.'
      : 'Koala is enjoying the day, one leaf at a time.';

  if (nowMinutes >= 8 * 60 && nowMinutes < 12 * 60) {
    return {
      greeting: `Good morning, ${name} ☀️`,
      subtitle: daytimeSubtitle,
      actionText: 'Check-in opens at 9:00 PM.',
    };
  }

  if (nowMinutes >= 12 * 60 && nowMinutes < 18 * 60) {
    return {
      greeting: `Good afternoon, ${name} 🌿`,
      subtitle: daytimeSubtitle,
      actionText: 'Check-in opens at 9:00 PM.',
    };
  }

  if (nowMinutes >= 18 * 60 && nowMinutes < CHECK_IN_START_MINUTES) {
    return {
      greeting: `Good evening, ${name} ✨`,
      subtitle: fatigueState === 'veryWeak'
        ? 'Koala is exhausted and could use an earlier night.'
        : fatigueState === 'weak'
          ? 'Koala is feeling a little tired today.'
          : 'The day is slowing down. Bedtime is getting closer.',
      actionText: 'Check-in opens at 9:00 PM.',
    };
  }

  return {
    greeting: `Good night, ${name} 💜`,
    subtitle: 'Koala is resting quietly.',
    actionText: 'Check-in opens at 9:00 PM.',
  };
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

export const shouldShowAwakeInBedAnimation = (
  now: Date,
  cutoffTime: string | undefined,
  todayCheckedIn: boolean,
  todayStatus: string | null | undefined,
) => {
  if (todayCheckedIn || todayStatus === 'missing') return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = parseCutoffMinutes(cutoffTime);
  const windDownStartMinutes = cutoffMinutes === 0
    ? 23 * 60 + 30
    : cutoffMinutes - 30;

  return nowMinutes >= windDownStartMinutes || nowMinutes <= CHECK_IN_END_MINUTES;
};

export const shouldShowSleepingInBedAnimation = (
  now: Date,
  todayCheckedIn: boolean,
  todayStatus?: string | null,
) => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // A missed check-in is a recorded outcome, but the sanctuary should remain
  // in its nighttime sleeping scene until the daytime mood begins at 8 AM.
  if (todayStatus === 'missing') return nowMinutes < 8 * 60;
  if (!todayCheckedIn) return false;

  return nowMinutes >= CHECK_IN_START_MINUTES || nowMinutes < 8 * 60;
};

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
