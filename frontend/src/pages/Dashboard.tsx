import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore, getCurrentSleepDateString, getLocalDateString } from '../stores/useStore';
import { Sparkles, Moon, CheckCircle, X, Award, Flame, AlertCircle, Clock3, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  formatRemainingTime,
  resolveBedtimeCardState,
  shouldShowAwakeInBedAnimation,
  shouldShowEnjoyingLifeAnimation,
  shouldShowSleepingInBedAnimation,
  shouldShowVeryWeakEatingAnimation,
  shouldShowWeakEatingAnimation,
} from '../utils/bedtimeCard';

import isolatedKoalaPet from '../assets/isolated_koala_pet.png';
import koalaAwakeInBed from '../assets/koala_awake_in_bed.png';
import koalaEnjoyingLife from '../assets/koala_enjoying_life.png';
import koalaSleepingInBed from '../assets/koala_sleeping_in_bed.png';
import koalaVeryWeakEating from '../assets/koala_very_weak_eating.png';
import koalaWeakEating from '../assets/koala_weak_eating.png';


export const Dashboard: React.FC = () => {
  const { summary, loadSummary, performCheckIn, isLoading, error, history, loadHistory } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState<'pet' | 'progress'>('pet');
  
  const [justCheckedInMsg, setJustCheckedInMsg] = useState<{
    status: string;
    newStreak: number;
    unlockedBadges: string[];
  } | null>(null);

  // Sync state on load
  useEffect(() => {
    const sleepDate = getCurrentSleepDateString();
    loadSummary(sleepDate);
    loadHistory();
  }, [loadSummary, loadHistory]);

  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      loadSummary(getCurrentSleepDateString());
    }, 30000);
    return () => clearInterval(interval);
  }, [loadSummary]);

  // Format 24h cutoff time string to 12h format (e.g. "23:30" -> "11:30 PM")
  const formatCutoff12h = (cutoffStr?: string): string => {
    if (!cutoffStr) return '11:30 PM';
    const [h, m] = cutoffStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mStr = String(m).padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  const bedtimeState = resolveBedtimeCardState(
    currentTime,
    summary?.cutoffTime,
    summary?.todayCheckedIn ?? false,
    summary?.todayStatus,
  );
  const gaugeCircumference = 2 * Math.PI * 68;
  const gaugeOffset = gaugeCircumference * (1 - bedtimeState.progressPercent / 100);
  const showCountdown = bedtimeState.mode === 'goal' || bedtimeState.mode === 'lateWindow';
  const previewKoalaMood = (searchParams.get('koalaMood') || '')
    .replace(/[-_]/g, '')
    .toLowerCase();
  const previewWeakEating = previewKoalaMood === 'weak';
  const previewVeryWeakEating = previewKoalaMood === 'veryweak';
  const previewAwakeInBed = previewKoalaMood === 'awakeinbed';
  const previewSleepingInBed = previewKoalaMood === 'sleepinginbed';
  const hasKoalaPreview = previewWeakEating
    || previewVeryWeakEating
    || previewAwakeInBed
    || previewSleepingInBed;
  const showEnjoyingLifeAnimation = !hasKoalaPreview && shouldShowEnjoyingLifeAnimation(
    currentTime,
    summary?.cutoffTime,
    summary?.fatigueState,
  );
  const showWeakEatingAnimation = previewWeakEating || (!hasKoalaPreview && shouldShowWeakEatingAnimation(
    currentTime,
    summary?.cutoffTime,
    summary?.fatigueState,
  ));
  const showVeryWeakEatingAnimation = previewVeryWeakEating || (!hasKoalaPreview && shouldShowVeryWeakEatingAnimation(
    currentTime,
    summary?.cutoffTime,
    summary?.fatigueState,
  ));
  const showAwakeInBedAnimation = previewAwakeInBed || (!hasKoalaPreview && shouldShowAwakeInBedAnimation(
    currentTime,
    summary?.cutoffTime,
    summary?.todayCheckedIn ?? false,
    summary?.todayStatus,
  ));
  const showSleepingInBedAnimation = previewSleepingInBed || (!hasKoalaPreview && shouldShowSleepingInBedAnimation(
    currentTime,
    summary?.todayCheckedIn ?? false,
  ));
  const isInBedAnimation = showAwakeInBedAnimation || showSleepingInBedAnimation;
  const koalaImage = showSleepingInBedAnimation
    ? koalaSleepingInBed
    : showAwakeInBedAnimation
      ? koalaAwakeInBed
      : showVeryWeakEatingAnimation
    ? koalaVeryWeakEating
    : showWeakEatingAnimation
      ? koalaWeakEating
      : showEnjoyingLifeAnimation
        ? koalaEnjoyingLife
        : isolatedKoalaPet;
  const koalaAlt = showSleepingInBedAnimation
    ? 'Koala sleeping peacefully under a blanket'
    : showAwakeInBedAnimation
      ? 'Koala awake in bed and ready for bedtime'
      : showVeryWeakEatingAnimation
    ? 'An exhausted koala sleepily eating a eucalyptus leaf'
    : showWeakEatingAnimation
      ? 'A tired koala slowly eating a eucalyptus leaf'
      : showEnjoyingLifeAnimation
        ? 'Koala happily eating eucalyptus leaves'
        : 'Your virtual pet koala';

  const bedtimeResult = {
    onTime: {
      label: 'On time',
      heading: 'Right on schedule',
      description: 'You checked in by your bedtime goal. Sleep well.',
    },
    late: {
      label: 'Late',
      heading: 'Checked in after bedtime',
      description: 'You still made time to check in before the window closed.',
    },
    missing: {
      label: 'Missing',
      heading: 'No check-in recorded',
      description: 'The check-in window closed at 2:00 AM.',
    },
    upcoming: {
      label: 'Opens at 9:00 PM',
      heading: 'Your next check-in is tonight',
      description: 'The bedtime countdown will appear when the check-in window opens.',
    },
  } as const;
  const bedtimeResultMode = bedtimeState.mode === 'goal' || bedtimeState.mode === 'lateWindow'
    ? 'upcoming'
    : bedtimeState.mode;
  const bedtimeResultCopy = bedtimeResult[bedtimeResultMode];

  // Energy percentage based on fatigueScore (0..6 fatigue -> 100%..30% energy)
  const fatigueScore = summary?.fatigueScore ?? 0;
  const energyPercent = Math.max(30, Math.min(100, Math.round(100 - (fatigueScore / 6) * 70)));

  const handleCheckIn = async () => {
    try {
      const response = await performCheckIn();
      if (response) {
        setJustCheckedInMsg({
          status: response.status,
          newStreak: response.currentStreak,
          unlockedBadges: response.unlockedBadges || []
        });
        // Automatically slide to progress view upon successful checkin
        setTimeout(() => {
           setCurrentView('progress');
        }, 500);
      }
    } catch (err) {
      // Handled in store
    }
  };

  const closeCheckInModal = () => {
    setJustCheckedInMsg(null);
  };

  // Resolve real days of the current week for bottom tracker
  const today = new Date();
  const currentDayOfWeek = today.getDay() || 7; // Sunday = 0, map to 7 for mon-sun format
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDayOfWeek + 1);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = getLocalDateString(d);
    
    // The visual tracker should check the user's "sleep date", not calendar date
    const sleepDate = getCurrentSleepDateString();
    const isCurrentSleepDate = sleepDate === dStr;
    const hasHistory = history.some((h: any) => h.localCheckInDate === dStr && h.status !== 'missed');
    
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      checked: isCurrentSleepDate ? !!summary?.todayCheckedIn : hasHistory
    };
  });

  return (
    <div className="dashboard-viewport">
      <style>{`
        .dashboard-viewport {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden; /* Hide the slider track */
          padding-top: 80px; /* Accounts for top transparent navbar */
          box-sizing: border-box;
        }

        .dashboard-slider-track {
          display: flex;
          width: 200vw; /* 2 panels wide */
          height: 100%;
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .view-panel {
          width: 100vw;
          height: 100%;
          flex: 0 0 100vw;
          position: relative;
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* -------------------------------------
           VIEW A: PET SANCTUARY
           ------------------------------------- */
        .pet-sanctuary-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding-bottom: 10vh; /* Lift slightly off absolute center */
        }

        .pet-sprite-image {
          width: 320px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4));
          animation: float-pet 6s ease-in-out infinite;
          margin-bottom: 24px;
        }

        .pet-sprite-image.in-bed {
          animation: none;
        }

        @keyframes float-pet {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .pet-narrative-text {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: #f3edd7;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
          margin-bottom: 8px;
        }

        .pet-goal-subtext {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #aeb9cc;
          margin-bottom: 32px;
          text-align: center;
          font-weight: 500;
        }

        /* Sleep Action Button (Coral Red Pill) */
        .sleep-action-btn-large {
          padding: 18px 36px;
          border-radius: 99px;
          background: linear-gradient(135deg, #e06354 0%, #d25344 100%);
          border: none;
          color: #ffffff;
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(224, 99, 84, 0.4);
          transition: all 0.2s ease;
          min-width: 280px;
        }

        .sleep-action-btn-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(224, 99, 84, 0.5);
        }

        .sleep-action-btn-large:active {
          transform: translateY(0);
        }
        
        .sleep-action-btn-large:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Navigation Arrows */
        .nav-arrow-btn {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f3edd7;
          border-radius: 50%;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
          transition:
            transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.72s ease,
            border-color 0.72s ease,
            color 0.72s ease,
            box-shadow 0.72s ease;
          isolation: isolate;
        }

        .nav-arrow-btn::before {
          content: '';
          position: absolute;
          inset: -8px;
          z-index: -1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(243, 237, 215, 0.32) 0%, rgba(243, 237, 215, 0) 72%);
          opacity: 0;
          transform: scale(0.78);
          transition: opacity 0.72s ease, transform 0.72s ease;
          pointer-events: none;
        }

        .nav-arrow-btn:hover,
        .nav-arrow-btn:focus-visible {
          background: rgba(255, 255, 255, 0.17);
          border-color: rgba(243, 237, 215, 0.46);
          color: #fffdf3;
          transform: translateY(calc(-50% - 4px)) scale(1.045);
          box-shadow:
            0 16px 30px rgba(0, 0, 0, 0.3),
            0 0 24px rgba(243, 237, 215, 0.34),
            inset 0 0 14px rgba(255, 255, 255, 0.12);
          outline: none;
        }

        .nav-arrow-btn:hover::before,
        .nav-arrow-btn:focus-visible::before {
          opacity: 0.82;
          transform: scale(1.08);
          animation: nav-arrow-breathe 2.8s ease-in-out infinite;
        }

        @keyframes nav-arrow-breathe {
          0%, 100% {
            opacity: 0.58;
            transform: scale(1.02);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.12);
          }
        }

        .nav-arrow-btn:active {
          transform: translateY(-50%) scale(0.98);
        }

        .nav-arrow-icon {
          filter: brightness(1);
          transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1), filter 0.72s ease;
        }

        .nav-arrow-btn:hover .nav-arrow-icon,
        .nav-arrow-btn:focus-visible .nav-arrow-icon {
          filter: brightness(1.28) drop-shadow(0 0 7px rgba(243, 237, 215, 0.82));
        }

        .nav-arrow-btn.right-edge:hover .nav-arrow-icon,
        .nav-arrow-btn.right-edge:focus-visible .nav-arrow-icon {
          transform: translateX(1px) scale(1.04);
        }

        .nav-arrow-btn.left-edge:hover .nav-arrow-icon,
        .nav-arrow-btn.left-edge:focus-visible .nav-arrow-icon {
          transform: translateX(-1px) scale(1.04);
        }
        .nav-arrow-btn.right-edge {
          right: 30px;
        }
        .nav-arrow-btn.left-edge {
          left: 30px;
        }
        .arrow-text-label {
          position: absolute;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          color: #f3edd7;
          text-shadow: 0 0 10px rgba(243, 237, 215, 0.28);
          transition: opacity 0.72s ease, transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .right-edge:hover .arrow-text-label,
        .right-edge:focus-visible .arrow-text-label {
          opacity: 1;
          transform: translateX(-60px);
        }
        .left-edge:hover .arrow-text-label,
        .left-edge:focus-visible .arrow-text-label {
          opacity: 1;
          transform: translateX(60px);
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-arrow-btn,
          .nav-arrow-btn::before,
          .nav-arrow-icon,
          .arrow-text-label {
            transition-duration: 0.01ms;
          }

          .nav-arrow-btn::before {
            animation: none !important;
          }
        }

        /* -------------------------------------
           VIEW B: MY PROGRESS
           ------------------------------------- */
        .progress-container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 60px 0;
          gap: 24px;
        }

        .section-big-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 600;
          color: #f3edd7;
          margin-bottom: 10px;
          align-self: flex-start;
          text-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }

        .progress-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }

        @media (min-width: 900px) {
          .progress-grid {
             grid-template-columns: 1.1fr 1fr;
          }
        }

        /* Dark Immersive Glass Card Base */
        .dark-glass-card {
          background: rgba(24, 30, 56, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          padding: 28px;
          color: #f3edd7;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        /* Countdown Gauge modifications for Dark Card */
        .countdown-gauge-container {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }
        .gauge-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .gauge-bg-circle {
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 8;
          fill: none;
        }
        .gauge-progress-circle {
          stroke: #818cf8;
          stroke-width: 8;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 440;
          stroke-dashoffset: 120;
          transition: stroke-dashoffset 1s ease;
        }
        .gauge-progress-circle.late-window {
          stroke: #fbbf24;
        }
        .gauge-center-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gauge-time-val {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: #f3edd7;
          line-height: 1.1;
        }
        .gauge-left-label {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          color: #8e9bb4;
          margin-top: 4px;
        }
        .gauge-star-accent {
          position: absolute;
          top: 14px;
          color: #818cf8;
        }
        .gauge-star-accent.late-window {
          color: #fbbf24;
        }

        /* Stats Sub Headers */
        .card-header-small {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
          color: #aeb9cc;
          margin-bottom: 20px;
        }

        /* Streak & Rewards Adjustments */
        .middle-cards-stack {
           display: flex;
           flex-direction: column;
           gap: 24px;
        }
        
        .streak-val-text {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: #f3edd7;
        }
        .streak-rank-subtext {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #8e9bb4;
          margin-bottom: 6px;
        }
        .view-leaderboard-link {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: #818cf8;
          text-decoration: none;
          cursor: pointer;
        }
        .view-leaderboard-link:hover {
          text-decoration: underline;
        }

        /* Badges */
        .badge-shield-icon {
          width: 46px;
          height: 50px;
          background: rgba(129, 140, 248, 0.15);
          border: 1px solid rgba(129, 140, 248, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .badge-total-text {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: #f3edd7;
          margin-top: 10px;
        }
        
        /* Thin Koala Energy Bar (Horizontal) */
        .energy-horizontal-meter {
           width: 100%;
           display: flex;
           align-items: center;
           gap: 16px;
           background: rgba(8, 12, 29, 0.6);
           padding: 12px 20px;
           border-radius: 16px;
           border: 1px solid rgba(255, 255, 255, 0.08);
           margin-top: 16px;
        }
        .horizontal-track {
           flex: 1;
           height: 12px;
           background: rgba(255, 255, 255, 0.1);
           border-radius: 99px;
           overflow: hidden;
           position: relative;
        }
        .horizontal-fill {
           height: 100%;
           background: linear-gradient(90deg, #4ea881 0%, #7ce0b2 40%, #a78bfa 100%);
           border-radius: 99px;
           transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* This Week Tracker */
        .this-week-card {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .week-days-timeline {
          display: flex;
          align-items: center;
          gap: 32px;
          position: relative;
          z-index: 2;
        }
        .week-days-timeline::before {
          content: '';
          position: absolute;
          top: 42px; /* Centers the dashed line directly in the middle of circles */
          left: 20px;
          right: 20px;
          height: 2px;
          border-top: 2px dashed rgba(255,255,255,0.15);
          z-index: 1;
        }
        .day-node-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }
        .day-label-text {
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          color: #aeb9cc;
        }
        .day-node-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .day-node-circle.checked {
          background-color: #5b9b7e;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(91, 155, 126, 0.4);
        }
        .day-node-circle.unchecked {
          background-color: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
        }

        /* Post Check-in Result within Dark Card */
        .bedtime-result-panel {
          width: 100%;
          min-height: 180px;
          border-radius: 20px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .bedtime-result-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: #f3edd7;
        }
        .bedtime-result-heading {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: #f3edd7;
          margin-bottom: 8px;
        }
        .bedtime-result-description {
          color: #aeb9cc;
          font-size: 0.9rem;
          line-height: 1.4;
          max-width: 80%;
        }
        .emoji-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .emoji-happy {
          background: rgba(78, 168, 129, 0.3);
          border: 1px solid rgba(78, 168, 129, 0.5);
        }
        .emoji-sleepy {
          background: rgba(167, 139, 250, 0.3);
          border: 1px solid rgba(167, 139, 250, 0.5);
        }

        /* Check-in Modal Update */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }
        .modal-card {
          width: 100%;
          max-width: 420px;
          background: #141a36;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          padding: 40px 32px;
          text-align: center;
          position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.8);
          color: #f3edd7;
        }
      `}</style>

      {/* Floating Transition Controls */}
      {currentView === 'pet' && (
        <button
          type="button"
          className="nav-arrow-btn right-edge"
          onClick={() => setCurrentView('progress')}
          aria-label="Open My Progress"
        >
          <ChevronRight className="nav-arrow-icon" size={28} />
          <span className="arrow-text-label">My Progress</span>
        </button>
      )}
      {currentView === 'progress' && (
        <button
          type="button"
          className="nav-arrow-btn left-edge"
          onClick={() => setCurrentView('pet')}
          aria-label="Return to Sanctuary"
        >
          <ChevronLeft className="nav-arrow-icon" size={28} />
          <span className="arrow-text-label">Koala</span>
        </button>
      )}

      {/* SLIDER STRUCTURE */}
      <div 
        className="dashboard-slider-track" 
        style={{ transform: currentView === 'pet' ? 'translateX(0)' : 'translateX(-50%)' }}
      >
        
        {/* =========================================
            PANEL 1: THE SANCTUARY (PET VIEW)
            ========================================= */}
        <div className="view-panel">
          <div className="pet-sanctuary-container">
            {/* The Isolated Koala Asset */}
            <img 
              src={koalaImage}
              alt={koalaAlt}
              className={`pet-sprite-image${isInBedAnimation ? ' in-bed' : ''}`}
            />

            {/* Dynamic Bedtime Narrative */}
            <div className="pet-narrative-text">
              {showSleepingInBedAnimation
                ? "Koala is sleeping soundly 💤"
                : showAwakeInBedAnimation
                  ? "Koala is tucked in and waiting for you..."
                  : showVeryWeakEatingAnimation
                ? "Koala is exhausted and can barely stay awake..."
                : showWeakEatingAnimation
                ? "Koala is low on energy and eating slowly..."
                : bedtimeState.mode === 'goal' && bedtimeState.remainingMinutes && bedtimeState.remainingMinutes < 120 
                ? "Koala is a little bit sleepy..." 
                : bedtimeState.mode === 'lateWindow' 
                  ? "Koala is waiting up late for you..."
                  : bedtimeState.mode === 'onTime' 
                    ? "Koala is sleeping soundly 💤"
                    : "Koala is enjoying the evening"}
            </div>
            
            <div className="pet-goal-subtext">
              Today's bedtime goal is {formatCutoff12h(summary?.cutoffTime)}
            </div>

            {/* The primary action replacing countdowns on this screen */}
            {summary?.todayCheckedIn ? (
              <div style={{ padding: '16px 24px', background: 'rgba(78, 168, 129, 0.2)', border: '1px solid rgba(78, 168, 129, 0.4)', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4ea881', fontWeight: '600', fontSize: '1.2rem' }}>
                <CheckCircle size={22} />
                <span>Checked In Successfully!</span>
              </div>
            ) : (
              <button
                className="sleep-action-btn-large"
                onClick={handleCheckIn}
                disabled={isLoading}
              >
                <Moon size={24} />
                <span>
                  {isLoading
                    ? 'Checking in...'
                    : bedtimeState.mode === 'lateWindow'
                      ? 'Check in now'
                      : "I'm going to sleep"}
                </span>
              </button>
            )}
            {error && <div style={{ color: '#f87171', marginTop: '12px' }}>{error}</div>}
          </div>
        </div>

        {/* =========================================
            PANEL 2: MY PROGRESS
            ========================================= */}
        <div className="view-panel">
          <div className="progress-container">
            <h2 className="section-big-title">My Progress</h2>
            
            <div className="progress-grid">
              
              {/* Left Col: Bedtime Metrics & Energy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="dark-glass-card">
                  <div className="card-header-small">
                    <span>{bedtimeState.title} Goal</span>
                    <Clock3 size={16} />
                  </div>
                  
                  {showCountdown && !summary?.todayCheckedIn ? (
                    <>
                      <div className="countdown-gauge-container" style={{ margin: '0 auto 10px auto' }}>
                        <svg className="gauge-svg" viewBox="0 0 160 160">
                          <circle className="gauge-bg-circle" cx="80" cy="80" r="68" />
                          <circle
                            className={`gauge-progress-circle ${bedtimeState.mode === 'lateWindow' ? 'late-window' : ''}`}
                            cx="80" cy="80" r="68"
                            style={{ strokeDasharray: gaugeCircumference, strokeDashoffset: gaugeOffset }}
                          />
                        </svg>
                        <Sparkles className={`gauge-star-accent ${bedtimeState.mode === 'lateWindow' ? 'late-window' : ''}`} size={18} />
                        <div className="gauge-center-text">
                          <span className="gauge-time-val">{formatRemainingTime(bedtimeState.remainingMinutes ?? 0)}</span>
                          <span className="gauge-left-label">
                            {bedtimeState.mode === 'goal' ? 'to bedtime' : 'to close'}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', color: '#aeb9cc', fontSize: '0.85rem' }}>
                        Goal is {formatCutoff12h(summary?.cutoffTime)}
                      </div>
                    </>
                  ) : (
                    <div className="bedtime-result-panel">
                      <div className="bedtime-result-icon">
                        {bedtimeState.mode === 'onTime' && <CheckCircle size={28} color="#4ea881" />}
                        {bedtimeState.mode === 'late' && <Clock3 size={28} color="#fbbf24" />}
                        {bedtimeState.mode === 'missing' && <AlertCircle size={28} color="#f87171" />}
                        {bedtimeState.mode === 'upcoming' && <Moon size={28} color="#818cf8"/>}
                      </div>
                      <span className="bedtime-result-heading">
                        {bedtimeResultCopy.heading}
                      </span>
                      <span className="bedtime-result-description">
                        {bedtimeResultCopy.description}
                      </span>
                    </div>
                  )}
                  
                  {/* Energy Meter appended in the same card (or distinct one) */}
                  <div className="energy-horizontal-meter">
                     <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3edd7', whiteSpace: 'nowrap' }}>Koala Energy</span>
                     <div className="horizontal-track">
                        <div className="horizontal-fill" style={{ width: `${energyPercent}%` }} />
                     </div>
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{energyPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Badges & Streaks */}
              <div className="middle-cards-stack">
                {/* Streak Card */}
                <div className="dark-glass-card">
                  <div className="card-header-small">
                    <span>Current streak</span>
                    <Sparkles size={16} color="#fbbf24" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Flame size={32} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.4))'}} />
                    <span className="streak-val-text">{summary ? summary.currentStreak : 7} days</span>
                  </div>
                  <div>
                    <div className="streak-rank-subtext">Weekly rank #12 ⬆ 3</div>
                    <span className="view-leaderboard-link" onClick={() => navigate('/leaderboard')}>View leaderboard →</span>
                  </div>
                </div>

                {/* Badges Card */}
                <div className="dark-glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="card-header-small">
                    <span>Badges earned</span>
                    <Award size={16} color="#f472b6" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {summary && summary.badges.length > 0 ? (
                      summary.badges.slice(0, 3).map((b, i) => (
                        <div key={i} className="badge-shield-icon" title={b.name}><Award size={20} /></div>
                      ))
                    ) : (
                      <>
                        <div className="badge-shield-icon" style={{ opacity: 0.3 }} title="Night Owl (Locked)"><Moon size={20} /></div>
                        <div className="badge-shield-icon" style={{ opacity: 0.3 }} title="Early Koala (Locked)"><Award size={20} /></div>
                        <div className="badge-shield-icon" style={{ opacity: 0.3 }} title="Streak Star (Locked)"><Flame size={20} /></div>
                      </>
                    )}
                  </div>
                  <div className="badge-total-text" style={{ flex: 1 }}>{summary ? summary.badges.length : 0} total</div>
                  
                  {summary && summary.badges.length > 0 && (
                    <div style={{ marginTop: '14px' }}>
                      <span className="view-leaderboard-link" onClick={() => navigate('/badges')}>View badges →</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Row: This Week Tracker */}
              <div className="dark-glass-card this-week-card" style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>This week</span>
                <div className="week-days-timeline">
                  {weekDays.map((day, idx) => (
                    <div className="day-node-column" key={idx}>
                      <span className="day-label-text">{day.label}</span>
                      <div className={`day-node-circle ${day.checked ? 'checked' : 'unchecked'}`}>
                        {day.checked && <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Check-In Confirmation Modal overlay if needed (or we just let slider do the work) */}
      {justCheckedInMsg && (
        <div className="modal-overlay" onClick={closeCheckInModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeCheckInModal}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#8e9bb4', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 className="brand-font" style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#f3edd7' }}>Good Night! 💤</h2>
            <p style={{ color: '#aeb9cc', fontSize: '1rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Your check-in has been stored! Your sleep streak is now{' '}
              <strong style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{justCheckedInMsg.newStreak}</strong>{' '}
              {justCheckedInMsg.newStreak === 1 ? 'day' : 'days'}.
            </p>
            {justCheckedInMsg.unlockedBadges.length > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '1.05rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} /> Achievement Unlocked!
                </h4>
                {justCheckedInMsg.unlockedBadges.map((badgeName, index) => (
                  <div key={index} style={{ padding: '6px 0', fontSize: '0.9rem', color: '#f3edd7' }}>
                    ✨ {badgeName}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeCheckInModal}
              style={{ 
                marginTop: '32px', width: '100%', borderRadius: '16px', padding: '14px',
                background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', 
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer' 
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
