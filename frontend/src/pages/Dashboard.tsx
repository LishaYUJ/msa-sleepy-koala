import React, { useEffect, useState } from 'react';
import { useStore, getCurrentSleepDateString } from '../stores/useStore';
import { GlassCard } from '../components/GlassCard';
import { KoalaMascot } from '../components/KoalaMascot';
import { Moon, Star, Flame, Trophy, Clock, CheckCircle, AlertTriangle, X, Award } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { summary, loadSummary, performCheckIn, isLoading, error } = useStore();
  const [justCheckedInMsg, setJustCheckedInMsg] = useState<{
    status: string;
    newStreak: number;
    unlockedBadges: string[];
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sync state on load
  useEffect(() => {
    const sleepDate = getCurrentSleepDateString();
    loadSummary(sleepDate);
  }, []);

  // Update current time periodically for real-time mood/cutoff transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const resolveKoalaMood = (): string => {
    if (!summary) return 'default';

    // 1. Today already checked in
    if (summary.todayCheckedIn) {
      return summary.todayStatus === 'late' ? 'LATE_SLEEPING' : 'SLEEPING';
    }

    // 2. Recent consecutive bad days >= 4
    if (summary.consecutiveBadDays >= 4) {
      return 'VERY_WEAK';
    }

    // 3. Recent consecutive bad days >= 2
    if (summary.consecutiveBadDays >= 2) {
      return 'WEAK';
    }

    // Parse cutoffTime (format HH:mm)
    const cutoffTime = summary.cutoffTime || '22:00';
    const [cutoffHour, cutoffMin] = cutoffTime.split(':').map(Number);
    const cutoffMinutes = cutoffHour * 60 + cutoffMin;

    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const currentMinutes = currentHour * 60 + currentMin;

    // 4. Past cutoff
    if (currentMinutes >= cutoffMinutes) {
      return 'MISSED';
    }

    // 5. Within 30 minutes before cutoff
    if (currentMinutes >= cutoffMinutes - 30) {
      return 'WINDING_DOWN';
    }

    // 6. Default
    return 'DEFAULT';
  };

  const resolvedMood = resolveKoalaMood();

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

  return (
    <div className="dashboard-view">
      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: var(--text-main);
          width: 100%;
        }

        .dashboard-header {
          margin-bottom: 8px;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .dashboard-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 5fr 4fr;
          }
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Sleep action card */
        .checkin-card {
          text-align: center;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .sleep-btn {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: none;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          color: white;
          font-size: 1.15rem;
          font-family: var(--font-title);
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 30px var(--primary-glow);
          position: relative;
          z-index: 2;
          transition: all var(--transition-normal);
        }

        .sleep-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 40px var(--primary-glow);
        }

        .sleep-btn:active {
          transform: scale(0.98);
        }

        .sleep-btn-pulse {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 4px solid var(--primary);
          opacity: 0.4;
          z-index: 1;
          animation: pulse-out 2s infinite ease-out;
        }

        @keyframes pulse-out {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .checkin-success-ui {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          animation: fade-in-up 0.5s ease-out;
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .check-icon-large {
          color: var(--success);
          width: 64px;
          height: 64px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1rem;
          text-transform: uppercase;
        }

        .status-badge.on-time {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.late {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (min-width: 576px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
          gap: 8px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          font-family: var(--font-title);
          color: var(--text-main);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        /* Recent Badges shelf */
        .badges-shelf {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .badges-shelf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .badges-shelf-header h2 {
          font-size: 1.2rem;
        }

        .badge-icons-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .badge-item-mini {
          background-color: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 100px;
          flex-shrink: 0;
          gap: 6px;
        }

        .badge-title-mini {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 90px;
        }

        /* Modal popup */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-card {
          width: 100%;
          max-width: 480px;
          background: var(--bg-app);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes zoom-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .congrats-title {
          font-size: 1.6rem;
          color: var(--text-main);
          margin-bottom: 24px;
        }

        .badge-unlocked-card {
          background-color: var(--card-bg);
          border: 2px solid var(--primary-glow);
          border-radius: 16px;
          padding: 16px;
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }
      `}</style>

      {/* Header Info */}
      <div className="dashboard-header">
        <h1 className="brand-font">Bedtime Dashboard</h1>
        <p>Adopt a healthy sleep habit and keep your sleepy koala healthy.</p>
      </div>

      {/* Main Grid content */}
      <div className="dashboard-grid">
        {/* Left Column: Mascot display, Streaks, Cutoff details */}
        <div className="left-column">
          <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '4px', alignSelf: 'flex-start' }} className="brand-font">Your Koala Companion</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', alignSelf: 'flex-start' }}>Your sleep patterns shape the koala's mood.</p>
            
            {summary ? (
              <KoalaMascot mood={resolvedMood} />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-muted">Loading mascot...</span>
              </div>
            )}
          </GlassCard>

          {/* Stats blocks */}
          <div className="stats-grid">
            <GlassCard className="stat-card">
              <Flame size={28} color={summary && summary.currentStreak > 0 ? 'var(--secondary)' : 'var(--text-muted)'} fill={summary && summary.currentStreak > 0 ? 'var(--secondary)' : 'none'} />
              <span className="stat-value">{summary ? summary.currentStreak : 0}</span>
              <span className="stat-label">Current Streak</span>
            </GlassCard>
            
            <GlassCard className="stat-card">
              <Trophy size={28} color="var(--warning)" fill="none" />
              <span className="stat-value">{summary ? summary.longestStreak : 0}</span>
              <span className="stat-label">Longest Streak</span>
            </GlassCard>

            <GlassCard className="stat-card" style={{ gridColumn: 'span 2' }}>
              <Clock size={28} color="var(--primary)" />
              <span className="stat-value">{summary ? summary.cutoffTime : '--:--'}</span>
              <span className="stat-label">Cutoff Bedtime</span>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Sleep Action, Recent Badges */}
        <div className="right-column">
          <GlassCard className="checkin-card">
            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '10px 14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {summary ? (
              summary.todayCheckedIn ? (
                /* Checked In Display */
                <div className="checkin-success-ui">
                  <CheckCircle className="check-icon-large" />
                  <h2 className="brand-font" style={{ fontSize: '1.4rem' }}>All Checked In!</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                    You recorded checking in today. Sleep well!
                  </p>
                  
                  <div className={`status-badge ${summary.todayStatus === 'onTime' ? 'on-time' : 'late'}`}>
                    {summary.todayStatus === 'onTime' ? (
                      <>
                        <Star size={16} fill="currentColor" />
                        On Time
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} />
                        Late Check-in
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Sleep Check-In button */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <h2 className="brand-font" style={{ fontSize: '1.3rem' }}>Ready for Bed?</h2>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '280px', marginBottom: '10px', fontSize: '0.9rem' }}>
                    Press the button when you intention to sleep to record tonight's check-in.
                  </p>
                  <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                    <div className="sleep-btn-pulse"></div>
                    <button
                      onClick={handleCheckIn}
                      className="sleep-btn"
                      disabled={isLoading}
                    >
                      <Moon size={32} />
                      <span>{isLoading ? 'Checking in...' : "I'm going to sleep"}</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div style={{ padding: '40px 0' }}>
                <span>Loading your status...</span>
              </div>
            )}
          </GlassCard>

          {/* Unlocked badges list layout */}
          <GlassCard className="badges-shelf">
            <div className="badges-shelf-header">
              <h2 className="brand-font">Unlocked Badges</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {summary ? summary.badges.length : 0} Unlocked
              </span>
            </div>

            {summary && summary.badges.length > 0 ? (
              <div className="badge-icons-row">
                {summary.badges.map((b, i) => (
                  <div className="badge-item-mini" key={i} title={b.description}>
                    <Award size={24} color="var(--primary)" />
                    <span className="badge-title-mini">{b.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', border: '1px dashed var(--input-border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No achievements unlocked yet. Check in on time to start!
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Confirmation Modal */}
      {justCheckedInMsg && (
        <div className="modal-overlay" onClick={closeCheckInModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCheckInModal}>
              <X size={20} />
            </button>
            
            <h2 className="brand-font congrats-title">Good Night! 💤</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div className={`status-badge ${justCheckedInMsg.status === 'onTime' ? 'on-time' : 'late'}`} style={{ fontSize: '1.1rem', padding: '10px 20px' }}>
                {justCheckedInMsg.status === 'onTime' ? 'Checked in On Time!' : 'Checked in Late'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '340px' }}>
                Your check-in has been stored! Your current early sleep streak is now{' '}
                <strong style={{ color: 'var(--text-main)' }}>{justCheckedInMsg.newStreak}</strong>{' '}
                {justCheckedInMsg.newStreak === 1 ? 'day' : 'days'}.
              </p>
            </div>

            {/* If any badges unlocked */}
            {justCheckedInMsg.unlockedBadges.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 className="brand-font" style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>
                  🎉 Achievement Unlocked!
                </h3>
                {justCheckedInMsg.unlockedBadges.map((badgeName, index) => (
                  <div className="badge-unlocked-card" key={index}>
                    <Award size={36} color="var(--secondary)" />
                    <div>
                      <h4 className="brand-font" style={{ fontSize: '0.95rem' }}>{badgeName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        You unlocked a new badge milestone!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={closeCheckInModal}
              className="btn btn-primary"
              style={{ marginTop: '24px', width: '100%' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
