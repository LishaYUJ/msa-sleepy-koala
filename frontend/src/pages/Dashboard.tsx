import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getCurrentSleepDateString } from '../stores/useStore';
import { Sparkles, Moon, CheckCircle, X, Award, Flame, AlertCircle, Clock3, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatRemainingTime, resolveBedtimeCardState } from '../utils/bedtimeCard';

import isolatedKoalaPet from '../assets/isolated_koala_pet.png';


export const Dashboard: React.FC = () => {
  const { summary, loadSummary, performCheckIn, isLoading, error } = useStore();
  const navigate = useNavigate();

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
  }, [loadSummary]);

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

  // Mock days of current week for bottom tracker
  const weekDays = [
    { label: 'Mon', checked: true },
    { label: 'Tue', checked: true },
    { label: 'Wed', checked: true },
    { label: 'Thu', checked: true },
    { label: 'Fri', checked: summary?.todayCheckedIn ?? true },
    { label: 'Sat', checked: false },
    { label: 'Sun', checked: false }
  ];

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
          transition: all 0.2s ease;
        }

        .nav-arrow-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-50%) scale(1.05);
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
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .right-edge:hover .arrow-text-label {
          opacity: 1;
          transform: translateX(-60px);
        }
        .left-edge:hover .arrow-text-label {
          opacity: 1;
          transform: translateX(60px);
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
          top: 38px;
          left: 15px;
          right: 15px;
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
        <div className="nav-arrow-btn right-edge" onClick={() => setCurrentView('progress')}>
          <ChevronRight size={28} />
          <span className="arrow-text-label">My Progress</span>
        </div>
      )}
      {currentView === 'progress' && (
        <div className="nav-arrow-btn left-edge" onClick={() => setCurrentView('pet')}>
          <ChevronLeft size={28} />
          <span className="arrow-text-label">Koala</span>
        </div>
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
              src={isolatedKoalaPet} 
              alt="Your Virtual Pet Koala" 
              className="pet-sprite-image" 
            />

            {/* Dynamic Bedtime Narrative */}
            <div className="pet-narrative-text">
              {bedtimeState.mode === 'goal' && bedtimeState.remainingMinutes && bedtimeState.remainingMinutes < 120 
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
                <div className="dark-glass-card" style={{ flex: 1 }}>
                  <div className="card-header-small">
                    <span>Badges earned</span>
                    <Award size={16} color="#f472b6" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="badge-shield-icon" title="Night Owl"><Moon size={20} /></div>
                    <div className="badge-shield-icon" title="Early Koala"><Award size={20} /></div>
                    <div className="badge-shield-icon" title="Streak Star"><Flame size={20} /></div>
                  </div>
                  <div className="badge-total-text">{summary ? summary.badges.length : 5} total</div>
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
