import React, { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { GlassCard } from '../components/GlassCard';
import { Award, Lock, Sparkles } from 'lucide-react';
import { BadgeGraphic } from '../components/BadgeIcons';

export const Badges: React.FC = () => {
  const { badges, loadBadges, isLoading } = useStore();

  useEffect(() => {
    loadBadges();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="badges-view">
      <style>{`
        .badges-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: var(--text-main);
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 20px 24px 88px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .badges-view {
            padding: 62px 16px 92px;
          }
        }

        .badges-header {
          margin-bottom: 8px;
        }

        .badges-header h1 {
          font-size: 2rem;
          margin-bottom: 6px;
        }

        .badges-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .badge-museum-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 576px) {
          .badge-museum-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 992px) {
          .badge-museum-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .museum-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 28px 24px;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .museum-card.locked {
          opacity: 0.55;
          background-color: rgba(0,0,0,0.03);
        }

        .badge-illustration {
          width: 80px;
          height: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-normal);
        }

        .museum-card:hover:not(.locked) .badge-illustration {
          transform: scale(1.1) rotate(5deg);
        }

        .lock-overlay {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background-color: var(--surface-2);
          border: 3px solid var(--card-bg);
          color: var(--text-muted);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-title {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .badge-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.4;
          flex: 1;
        }

        .badge-date {
          font-size: 0.75rem;
          color: var(--secondary);
          font-weight: 600;
          margin-top: 6px;
          background-color: var(--card-bg);
          padding: 4px 8px;
          border-radius: 8px;
        }
      `}</style>

      {/* Header Info */}
      <div className="badges-header">
        <h1 className="brand-font">Achievements Museum</h1>
        <p>Your bedtime milestones! Build streaks to earn rare koala caregiver badges.</p>
      </div>

      {isLoading && !badges ? (
        <span>Loading your museum shelf...</span>
      ) : !badges ? (
        <span>No badges loaded. Check back later!</span>
      ) : (
        <div className="badge-museum-grid">
          {/* Render Unlocked Badges */}
          {badges.unlocked.map((badge, index) => (
            <GlassCard className="museum-card" key={`unlocked-${index}`}>
              <div className="badge-illustration">
                <BadgeGraphic name={badge.name} isLocked={false} />
                <Sparkles size={20} color="var(--primary)" className="crown-icon" style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, alignItems: 'center' }}>
                <span className="badge-title">{badge.name}</span>
                <span className="badge-desc">{badge.description}</span>
                <span className="badge-date">Unlocked {formatDate(badge.unlockedAt)}</span>
              </div>
            </GlassCard>
          ))}

          {/* Render Locked Badges */}
          {badges.locked.map((badge, index) => (
            <GlassCard className="museum-card locked" key={`locked-${index}`}>
              <div className="badge-illustration">
                <BadgeGraphic name={badge.name} isLocked={true} />
                <div className="lock-overlay">
                  <Lock size={14} strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, alignItems: 'center' }}>
                <span className="badge-title" style={{ color: 'var(--text-muted)' }}>{badge.name}</span>
                <span className="badge-desc">{badge.description}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
