import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, getCurrentSleepDateString } from '../stores/useStore';
import { Sparkles, Calendar, ChevronDown, Moon, CheckCircle, X, Award, Flame } from 'lucide-react';

import heroKoalaScene from '../assets/hero_koala_scene.png';
import eucalyptusBranch from '../assets/eucalyptus_branch.png';
import userAvatar from '../assets/user_avatar.png';

export const Dashboard: React.FC = () => {
  const { summary, loadSummary, performCheckIn, isLoading, error, nickname } = useStore();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [justCheckedInMsg, setJustCheckedInMsg] = useState<{
    status: string;
    newStreak: number;
    unlockedBadges: string[];
  } | null>(null);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Sync state on load
  useEffect(() => {
    const sleepDate = getCurrentSleepDateString();
    loadSummary(sleepDate);
  }, []);

  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      loadSummary(getCurrentSleepDateString());
    }, 30000);
    return () => clearInterval(interval);
  }, [loadSummary]);

  // Formatted date (e.g. "Aug 5, 2026")
  const formattedDateStr = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Display Name
  const displayName = nickname || 'Lisha';

  // Format 24h cutoff time string to 12h format (e.g. "23:30" -> "11:30 PM")
  const formatCutoff12h = (cutoffStr?: string): string => {
    if (!cutoffStr) return '11:30 PM';
    const [h, m] = cutoffStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mStr = String(m).padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  // Calculate time left to bedtime in hours and minutes
  const calculateTimeLeft = (): { hours: number; minutes: number; totalMinutes: number } => {
    const cutoffStr = summary?.cutoffTime || '23:30';
    const [cutoffH, cutoffM] = cutoffStr.split(':').map(Number);
    
    let targetDate = new Date(currentTime);
    targetDate.setHours(cutoffH, cutoffM, 0, 0);

    // If current time is past cutoff but before 4 AM, cutoff was earlier tonight
    if (currentTime > targetDate && currentTime.getHours() >= 4) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const diffMs = targetDate.getTime() - currentTime.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return { hours, minutes, totalMinutes: diffMinutes };
  };

  const timeLeft = calculateTimeLeft();

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
    <div className="dashboard-page">
      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          color: #f3edd7;
          box-sizing: border-box;
        }

        /* Top Header Bar */
        .top-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-greeting {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sparkle-icon-gold {
          color: #fbbf24;
          width: 26px;
          height: 26px;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
        }

        .greeting-title {
          font-family: var(--font-serif);
          font-size: 2.1rem;
          font-weight: 500;
          color: #f3edd7;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .header-actions-right {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
        }

        .date-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(20, 26, 54, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #f3edd7;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .date-icon {
          width: 18px;
          height: 18px;
          color: #818cf8;
        }

        .profile-trigger-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 8px;
          background: rgba(20, 26, 54, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-trigger-btn:hover {
          background: rgba(32, 40, 78, 0.8);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .profile-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-popover-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 160px;
          background: #141a36;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 16px 36px rgba(0,0,0,0.5);
          z-index: 50;
        }

        .popover-link {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          color: #f3edd7;
          font-size: 0.9rem;
          text-decoration: none;
        }

        .popover-link:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* Main Dashboard Grid */
        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .dashboard-grid-layout {
            grid-template-columns: 1.35fr 1fr;
          }
        }

        /* Hero Koala Card */
        .hero-koala-card {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background-color: #0d132b;
        }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        .hero-overlay-shadow {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 12, 29, 0.1) 0%, rgba(8, 12, 29, 0.65) 100%);
          z-index: 2;
        }

        /* Koala Energy Bar (Vertical Glass Meter on Right inside Hero Card) */
        .koala-energy-glass-meter {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 10;
          background: rgba(12, 16, 38, 0.45);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .energy-title {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #f3edd7;
          font-weight: 500;
        }

        .energy-meter-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .energy-tube-track {
          width: 24px;
          height: 190px;
          border-radius: 999px;
          background: rgba(8, 11, 26, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .energy-tube-fill {
          width: 100%;
          border-radius: 999px;
          background: linear-gradient(180deg, #4ea881 0%, #7ce0b2 40%, #a78bfa 100%);
          transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px rgba(78, 168, 129, 0.5);
        }

        .energy-percent-text {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 500;
          color: #f3edd7;
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

        .hero-bottom-quote {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 24px;
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: #f3edd7;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        /* Right Stack Column */
        .right-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Warm Cream Cards Base Style */
        .cream-card {
          background-color: #fcf8f2;
          border: 1px solid #ebd9c7;
          border-radius: 24px;
          padding: 24px;
          color: #192038;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
          position: relative;
          box-sizing: border-box;
        }

        /* Tonight's Bedtime Card */
        .bedtime-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 28px 24px;
          background: linear-gradient(180deg, #fcf8f2 0%, #f7efe4 100%);
        }

        .bedtime-header-title {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: #192038;
          margin-bottom: 4px;
        }

        .bedtime-time-display {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 600;
          color: #192038;
          margin-bottom: 20px;
        }

        /* Circular Arc Countdown Gauge */
        .countdown-gauge-container {
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .gauge-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .gauge-bg-circle {
          stroke: #eae1d5;
          stroke-width: 8;
          fill: none;
        }

        .gauge-progress-circle {
          stroke: #5d5fa8;
          stroke-width: 8;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 440;
          stroke-dashoffset: 120;
          transition: stroke-dashoffset 1s ease;
        }

        .gauge-star-accent {
          position: absolute;
          top: 14px;
          color: #4b4d96;
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
          font-size: 2.1rem;
          font-weight: 700;
          color: #192038;
          line-height: 1.1;
        }

        .gauge-left-label {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          color: #192038;
          margin-top: 2px;
        }

        /* Sleep Action Button (Coral Red Pill) */
        .sleep-action-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 18px;
          background: linear-gradient(135deg, #e06354 0%, #d25344 100%);
          border: none;
          color: #ffffff;
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(224, 99, 84, 0.35);
          transition: all 0.2s ease;
        }

        .sleep-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(224, 99, 84, 0.45);
        }

        .sleep-action-btn:active {
          transform: translateY(0);
        }

        .sleep-action-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Middle Two Cards Row */
        .middle-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Streak Card */
        .streak-card-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .card-header-small {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9rem;
          color: #192038;
          margin-bottom: 12px;
        }

        .streak-main-body {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .eucalyptus-decor-img {
          width: 52px;
          height: auto;
          object-fit: contain;
        }

        .streak-val-text {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: #192038;
        }

        .streak-rank-subtext {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: #5e6678;
          margin-bottom: 4px;
        }

        .view-leaderboard-link {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: #4b4d96;
          text-decoration: none;
          cursor: pointer;
        }

        .view-leaderboard-link:hover {
          text-decoration: underline;
        }

        /* Badges Card */
        .badges-card-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .badges-row-icons {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 12px 0 16px 0;
        }

        .badge-shield-icon {
          width: 42px;
          height: 46px;
          background: linear-gradient(135deg, #4b4d96 0%, #353770 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .badge-total-text {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: #192038;
        }

        /* Bottom Row: "This week" Check-in Tracker Card */
        .this-week-card {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          overflow: hidden;
          background: #fcf8f2;
          box-sizing: border-box;
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
        }

        .this-week-left-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: #192038;
        }

        .week-days-timeline {
          display: flex;
          align-items: center;
          gap: 28px;
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
          border-top: 2px dashed #dcd0c0;
          z-index: 1;
        }

        .day-node-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 2;
        }

        .day-label-text {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: #192038;
        }

        .day-node-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .day-node-circle.checked {
          background-color: #5b9b7e;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(91, 155, 126, 0.4);
        }

        .day-node-circle.unchecked {
          background-color: #eae1d5;
          border: 1px solid #d5c8b7;
        }

        .bottom-eucalyptus-corner {
          position: absolute;
          right: -10px;
          bottom: -30px;
          width: 150px;
          height: auto;
          object-fit: contain;
          opacity: 0.5;
          z-index: 1;
        }

        /* Check-in Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(6px);
        }

        .modal-card {
          width: 100%;
          max-width: 480px;
          background: #0f152d;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          color: #f3edd7;
        }
      `}</style>

      {/* Top Header Bar */}
      <div className="top-header-bar">
        <div className="header-greeting">
          <Sparkles className="sparkle-icon-gold" />
          <h1 className="greeting-title">Good evening, {displayName}</h1>
        </div>

        <div className="header-actions-right">
          {/* Current Date Card */}
          <div className="date-card">
            <Calendar className="date-icon" />
            <span>{formattedDateStr}</span>
          </div>

          {/* User Profile Button */}
          <div
            className="profile-trigger-btn"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            title="User options"
          >
            <img src={userAvatar} alt={displayName} className="profile-avatar-circle" />
            <ChevronDown size={16} color="#8e9bb4" />
          </div>

          {profileDropdownOpen && (
            <div className="profile-popover-menu">
              <a
                href="#settings"
                className="popover-link"
                onClick={(e) => {
                  e.preventDefault();
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
              >
                Settings
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="dashboard-grid-layout">
        {/* Left Column: Hero Koala Card */}
        <div className="hero-koala-card">
          <img src={heroKoalaScene} alt="Sleepy Koala Night Scene" className="hero-bg-img" />
          <div className="hero-overlay-shadow" />

          {/* Koala Energy Glass Indicator Bar */}
          <div className="koala-energy-glass-meter">
            <span className="energy-title">Koala Energy</span>
            
            <div className="emoji-icon-badge emoji-happy">
              <span>😊</span>
            </div>

            <div className="energy-meter-row">
              <div className="energy-tube-track" aria-label={`Koala Energy ${energyPercent}%`}>
                <div className="energy-tube-fill" style={{ height: `${energyPercent}%` }} />
              </div>
              <span className="energy-percent-text">{energyPercent}%</span>
            </div>

            <div className="emoji-icon-badge emoji-sleepy">
              <span>😴</span>
            </div>
          </div>

          {/* Bottom Quote Text */}
          <div className="hero-bottom-quote">
            "A little sleepy — bedtime is getting close"
          </div>
        </div>

        {/* Right Column: Stacked Cards */}
        <div className="right-cards-stack">
          {/* Card 1: Tonight's Bedtime & Sleep Action Card */}
          <div className="cream-card bedtime-card">
            <span className="bedtime-header-title">Tonight's bedtime</span>
            <span className="bedtime-time-display">{formatCutoff12h(summary?.cutoffTime)}</span>

            {/* Circular Arc Gauge Countdown */}
            <div className="countdown-gauge-container">
              <svg className="gauge-svg" viewBox="0 0 160 160">
                <circle className="gauge-bg-circle" cx="80" cy="80" r="68" />
                <circle className="gauge-progress-circle" cx="80" cy="80" r="68" />
              </svg>
              <Sparkles className="gauge-star-accent" size={18} />
              
              <div className="gauge-center-text">
                <span className="gauge-time-val">
                  {timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ''}{timeLeft.minutes}m
                </span>
                <span className="gauge-left-label">left</span>
              </div>
            </div>

            {/* Sleep Action Button */}
            {summary?.todayCheckedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ea881', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <CheckCircle size={24} />
                <span>Checked In! Sleep well 💤</span>
              </div>
            ) : (
              <button
                className="sleep-action-btn"
                onClick={handleCheckIn}
                disabled={isLoading}
              >
                <Moon size={22} />
                <span>{isLoading ? 'Checking in...' : "I'm going to sleep"}</span>
              </button>
            )}

            {error && (
              <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '10px' }}>
                {error}
              </div>
            )}
          </div>

          {/* Middle Row: Streak & Badges Cards */}
          <div className="middle-cards-row">
            {/* Streak Card */}
            <div className="cream-card">
              <div className="streak-card-content">
                <div className="card-header-small">
                  <span>Current streak</span>
                  <Sparkles size={14} color="#fbbf24" />
                </div>

                <div className="streak-main-body">
                  <img src={eucalyptusBranch} alt="Eucalyptus" className="eucalyptus-decor-img" />
                  <span className="streak-val-text">{summary ? summary.currentStreak : 7} days</span>
                </div>

                <div>
                  <div className="streak-rank-subtext">Weekly rank #12 ⬆ 3</div>
                  <span className="view-leaderboard-link" onClick={() => navigate('/leaderboard')}>
                    View leaderboard →
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Card */}
            <div className="cream-card">
              <div className="badges-card-content">
                <div className="card-header-small">
                  <span>Badges earned</span>
                  <Sparkles size={14} color="#fbbf24" />
                </div>

                <div className="badges-row-icons">
                  <div className="badge-shield-icon" title="Night Owl">
                    <Moon size={20} />
                  </div>
                  <div className="badge-shield-icon" title="Early Koala">
                    <Award size={20} />
                  </div>
                  <div className="badge-shield-icon" title="Streak Star">
                    <Flame size={20} />
                  </div>
                </div>

                <div className="badge-total-text">
                  {summary ? summary.badges.length : 5} total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: "This week" Check-in Tracker Card */}
      <div className="cream-card this-week-card">
        <span className="this-week-left-title">This week</span>

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

        <img src={eucalyptusBranch} alt="Eucalyptus Decor" className="bottom-eucalyptus-corner" />
      </div>

      {/* Check-In Confirmation Modal */}
      {justCheckedInMsg && (
        <div className="modal-overlay" onClick={closeCheckInModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeCheckInModal}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#8e9bb4', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 className="brand-font" style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Good Night! 💤</h2>
            <p style={{ color: '#8e9bb4', fontSize: '0.95rem', marginBottom: '20px' }}>
              Your check-in has been stored! Your current sleep streak is now{' '}
              <strong style={{ color: '#f3edd7' }}>{justCheckedInMsg.newStreak}</strong>{' '}
              {justCheckedInMsg.newStreak === 1 ? 'day' : 'days'}.
            </p>

            {justCheckedInMsg.unlockedBadges.length > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '8px' }}>🎉 Achievement Unlocked!</h4>
                {justCheckedInMsg.unlockedBadges.map((badgeName, index) => (
                  <div key={index} style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    {badgeName}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={closeCheckInModal}
              className="btn btn-primary"
              style={{ marginTop: '24px', width: '100%', borderRadius: '14px' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
