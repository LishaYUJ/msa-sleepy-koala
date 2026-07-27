import React, { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { GlassCard } from '../components/GlassCard';
import { Trophy, Flame } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard, loadLeaderboard, isLoading } = useStore();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Split podium from the rest
  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  // Helper to render podium ranking card
  const renderPodium = (item: any, place: number) => {
    if (!item) return <div className={`podium-space place-${place}`} key={place} />;
    
    let placeClass = 'first';
    let iconColor = 'var(--podium-1)';
    let size = 1.05;

    if (place === 2) {
      placeClass = 'second';
      iconColor = 'var(--podium-2)';
      size = 0.95;
    } else if (place === 3) {
      placeClass = 'third';
      iconColor = 'var(--podium-3)';
      size = 0.9;
    }

    return (
      <div className={`podium-spot place-${placeClass}`} key={place}>
        <style>{`
          .podium-spot {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;
            transform: scale(${size});
            z-index: ${4 - place};
          }

          .podium-spot.place-first {
            order: 2; /* center */
          }
          .podium-spot.place-second {
            order: 1; /* left */
          }
          .podium-spot.place-third {
            order: 3; /* right */
          }

          .podium-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: var(--card-bg);
            border: 4px solid ${iconColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-family: var(--font-title);
            font-weight: bold;
            box-shadow: 0 10px 20px -5px rgba(0,0,0,0.15);
            position: relative;
            margin-bottom: 12px;
          }

          .crown-icon-podium {
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%) rotate(-10deg);
          }

          .podium-pedestal {
            background: linear-gradient(180deg, var(--card-bg) 0%, rgba(92, 95, 200, 0.08) 100%);
            border: 1px solid var(--card-border);
            border-bottom: none;
            border-radius: 12px 12px 0 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 12px;
            box-shadow: var(--card-shadow);
          }

          .podium-name {
            font-weight: 700;
            font-size: 0.9rem;
            color: var(--text-main);
            margin-bottom: 6px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 90px;
          }

          .podium-streak {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: bold;
            font-family: var(--font-title);
            color: var(--secondary);
            font-size: 1.15rem;
          }

          .podium-number-badge {
            position: absolute;
            bottom: -10px;
            background-color: ${iconColor};
            color: var(--text-inverse);
            font-size: 0.8rem;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-family: var(--font-title);
          }
        `}</style>

        {place === 1 && <Trophy className="crown-icon-podium" size={24} fill="#FBBF24" color="#D97706" />}
        
        <div className="podium-avatar">
          {item.nickname[0].toUpperCase()}
          <div className="podium-number-badge">{place}</div>
        </div>

        <div className="podium-pedestal" style={{ height: place === 1 ? '110px' : place === 2 ? '90px' : '75px' }}>
          <span className="podium-name">{item.nickname}</span>
          <div className="podium-streak">
            <Flame size={16} fill="currentColor" />
            <span>{item.currentStreak}</span>
          </div>
        </div>
      </div>
    );
  };

  // Re-arrange top 3 for left-to-right sorting on screen: 2nd, 1st, 3rd
  const sortedTop3 = [];
  if (top3[1]) sortedTop3.push({ item: top3[1], place: 2 });
  if (top3[0]) sortedTop3.push({ item: top3[0], place: 1 });
  if (top3[2]) sortedTop3.push({ item: top3[2], place: 3 });

  return (
    <div className="leaderboard-view">
      <style>{`
        .leaderboard-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: var(--text-main);
          width: 100%;
        }

        .leaderboard-header {
          margin-bottom: 8px;
        }

        .leaderboard-header h1 {
          font-size: 2rem;
          margin-bottom: 6px;
        }

        .leaderboard-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .podium-container {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 16px;
          margin: 20px 0 10px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--card-border);
          min-height: 200px;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .leaderboard-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-radius: 16px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: transform var(--transition-fast);
        }

        .leaderboard-row:hover {
          transform: translateX(4px);
        }

        .rank-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .rank-number {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-muted);
          width: 30px;
          text-align: center;
        }

        .rank-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-glow);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-family: var(--font-title);
        }

        .rank-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-main);
        }

        .streak-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--secondary);
          font-weight: 700;
          font-family: var(--font-title);
          font-size: 1.1rem;
        }
      `}</style>

      {/* Header Info */}
      <div className="leaderboard-header">
        <h1 className="brand-font">Leaderboard</h1>
        <p>Friendly competition! Top sleepers ranked by current early sleep streak.</p>
      </div>

      {isLoading && leaderboard.length === 0 ? (
        <span>Loading leaderboard standings...</span>
      ) : leaderboard.length === 0 ? (
        <GlassCard style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No users found in ranking. Register or check in to start the leader boards!
        </GlassCard>
      ) : (
        <>
          {/* Top 3 Podium layout */}
          {top3.length > 0 && (
            <div className="podium-container">
              {sortedTop3.map((pod) => renderPodium(pod.item, pod.place))}
            </div>
          )}

          {/* Regular rankings table */}
          {others.length > 0 && (
            <div className="leaderboard-list">
              {others.map((user) => (
                <div className="leaderboard-row" key={user.rank}>
                  <div className="rank-info">
                    <span className="rank-number">#{user.rank}</span>
                    <div className="rank-avatar">
                      {user.nickname[0].toUpperCase()}
                    </div>
                    <span className="rank-name">{user.nickname}</span>
                  </div>
                  <div className="streak-info">
                    <Flame size={18} fill="currentColor" />
                    <span>{user.currentStreak} days</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
