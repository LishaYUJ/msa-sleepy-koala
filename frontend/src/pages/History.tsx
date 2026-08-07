import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Moon,
  RefreshCw,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useStore, type CheckInHistory } from '../stores/useStore';

type HistoryFilter = 'all' | 'onTime' | 'late';

const formatHistoryDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return dateString;

  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

const getMonthLabel = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return 'Earlier';
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const History: React.FC = () => {
  const { history, loadHistory, deleteHistoryItem, isLoading, error, setError } = useStore();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onTimeCount = history.filter((item) => item.status === 'onTime').length;
  const lateCount = history.length - onTimeCount;
  const onTimeRate = history.length ? Math.round((onTimeCount / history.length) * 100) : 0;

  const groupedHistory = useMemo(() => {
    const visibleItems = filter === 'all'
      ? history
      : history.filter((item) => item.status === filter);

    return visibleItems.reduce<Record<string, CheckInHistory[]>>((groups, item) => {
      const label = getMonthLabel(item.localCheckInDate);
      groups[label] = groups[label] || [];
      groups[label].push(item);
      return groups;
    }, {});
  }, [filter, history]);

  const visibleCount = Object.values(groupedHistory).reduce((total, items) => total + items.length, 0);

  const handleDelete = async (item: CheckInHistory) => {
    try {
      await deleteHistoryItem(item.id, item.localCheckInDate);
      setPendingDeleteId(null);
    } catch {
      // The shared store exposes the backend message in the page alert.
    }
  };

  const handleRetry = () => {
    setError(null);
    loadHistory();
  };

  return (
    <div className="history-page">
      <style>{`
        .history-page {
          width: 100%;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding-bottom: 12px;
        }

        .history-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .history-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .history-title-icon {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f3edd7;
          background: linear-gradient(145deg, #4b4d96, #2e326d);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 24px rgba(75, 77, 150, 0.35);
          flex-shrink: 0;
        }

        .history-page h1 {
          margin: 0 0 5px;
          color: #f3edd7;
          font-size: clamp(1.7rem, 2.6vw, 2.15rem);
          font-weight: 600;
        }

        .history-subtitle {
          color: var(--text-muted);
          line-height: 1.5;
          font-size: 0.96rem;
        }

        .history-refresh-btn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(20, 26, 54, 0.7);
          color: #dce2f5;
          border-radius: 13px;
          padding: 10px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font: 600 0.86rem var(--font-body);
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .history-refresh-btn:hover:not(:disabled) {
          background: rgba(40, 49, 92, 0.9);
          border-color: rgba(129, 140, 248, 0.45);
        }

        .history-refresh-btn:disabled { opacity: 0.55; cursor: wait; }
        .history-refresh-btn.loading svg { animation: history-spin 0.8s linear infinite; }
        @keyframes history-spin { to { transform: rotate(360deg); } }

        .history-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .history-stat-card {
          min-height: 112px;
          padding: 20px 22px;
          border-radius: 21px;
          background: rgba(20, 26, 54, 0.66);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .history-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(129, 140, 248, 0.13);
          color: #a5b4fc;
          flex-shrink: 0;
        }

        .history-stat-card:nth-child(2) .history-stat-icon {
          background: rgba(78, 168, 129, 0.14);
          color: #7ad0aa;
        }

        .history-stat-card:nth-child(3) .history-stat-icon {
          background: rgba(251, 191, 36, 0.12);
          color: #fbbf24;
        }

        .history-stat-copy { display: flex; flex-direction: column; gap: 2px; }
        .history-stat-value { font: 600 1.7rem var(--font-serif); color: #f3edd7; }
        .history-stat-label { color: var(--text-muted); font-size: 0.84rem; }

        .history-log-card {
          background: rgba(24, 30, 56, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
          color: #f3edd7;
          overflow: hidden;
        }

        .history-log-toolbar {
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.15);
        }

        .history-log-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font: 600 1.25rem var(--font-serif);
        }

        .history-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.25);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .history-filter-btn {
          border: 0;
          border-radius: 12px;
          padding: 8px 14px;
          color: #8e9bb4;
          background: transparent;
          cursor: pointer;
          font: 600 0.85rem var(--font-body);
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .history-filter-btn.active {
          background: rgba(129, 140, 248, 0.2);
          color: #a5b4fc;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .history-error {
          margin: 18px 24px 0;
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.9rem;
        }

        .history-error button {
          border: 0;
          background: rgba(239, 68, 68, 0.2);
          padding: 6px 12px;
          border-radius: 8px;
          color: #fecaca;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .history-error button:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .history-log-body { padding: 12px 26px 26px; }
        .history-month-group { padding-top: 16px; }

        .history-month-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px 6px;
          color: #8e9bb4;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .history-records { display: flex; flex-direction: column; gap: 12px; }

        .history-record {
          min-height: 72px;
          background: rgba(30, 36, 66, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-bottom-width: 4px;
          border-radius: 20px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          transition: all 0.15s ease;
        }

        .history-record.on-time {
          border-color: rgba(88, 204, 2, 0.3);
          border-bottom-color: rgba(88, 204, 2, 0.5);
        }

        .history-record.late {
          border-color: rgba(255, 150, 0, 0.3);
          border-bottom-color: rgba(255, 150, 0, 0.5);
        }

        .history-record:hover {
          transform: translateY(2px);
          border-bottom-width: 2px;
          margin-bottom: 2px;
          background: rgba(36, 43, 76, 0.9);
        }

        .history-date-block { display: flex; align-items: center; gap: 14px; }

        .history-weekday {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          color: #f3edd7;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05);
        }

        .history-record.on-time .history-weekday {
          background: rgba(88, 204, 2, 0.15);
          color: #a7f3d0;
        }

        .history-record.late .history-weekday {
          background: rgba(255, 150, 0, 0.15);
          color: #fde68a;
        }

        .history-date-copy { display: flex; flex-direction: column; gap: 4px; }
        .history-date-main { font-weight: 700; color: #f3edd7; font-size: 1.05rem; }
        .history-date-caption { font-size: 0.8rem; color: #8e9bb4; font-weight: 500; }
        .history-record-actions { display: flex; align-items: center; gap: 12px; }

        .history-status {
          min-width: 95px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .history-status.on-time { 
          color: #fff; 
          background: #58cc02; 
          border-bottom: 3px solid #58a700;
        }
        .history-status.late { 
          color: #fff; 
          background: #ff9600; 
          border-bottom: 3px solid #cc7800;
        }

        .history-delete-btn {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: #8e9bb4;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-delete-btn:hover { 
          color: #fca5a5; 
          background: rgba(239, 68, 68, 0.2); 
          transform: scale(1.05);
        }
        .history-delete-btn:disabled { opacity: 0.45; cursor: wait; transform: none; }

        .history-confirm {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fca5a5;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .history-confirm button {
          border: 0;
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
          font: 700 0.8rem var(--font-body);
          transition: transform 0.1s ease;
        }

        .history-confirm button:active {
          transform: scale(0.95);
        }

        .history-confirm-delete { 
          background: #ef4444; 
          color: white; 
          border-bottom: 3px solid #b91c1c;
        }
        .history-confirm-cancel { 
          background: rgba(255, 255, 255, 0.1); 
          color: #f3edd7; 
        }

        .history-empty {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #8e9bb4;
          padding: 40px 20px;
        }

        .history-empty-icon {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          color: #818cf8;
          background: rgba(129, 140, 248, 0.15);
          margin-bottom: 18px;
          box-shadow: inset 0 2px 10px rgba(129, 140, 248, 0.1);
        }

        .history-empty h2 { font-size: 1.25rem; margin-bottom: 8px; color: #f3edd7; }
        .history-empty p { font-size: 0.95rem; max-width: 340px; line-height: 1.6; }

        .history-skeleton-list { padding: 24px 26px; display: grid; gap: 12px; }
        .history-skeleton {
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: history-shimmer 1.5s infinite linear;
        }
        @keyframes history-shimmer { to { background-position: -200% 0; } }

        @media (max-width: 800px) {
          .history-page { padding-top: 56px; gap: 18px; }
          .history-page-header { align-items: flex-start; }
          .history-stats-grid { grid-template-columns: 1fr; gap: 10px; }
          .history-stat-card { min-height: 82px; padding: 14px 16px; }
          .history-log-toolbar { align-items: flex-start; flex-direction: column; }
          .history-filter-group { width: 100%; }
          .history-filter-btn { flex: 1; }
        }

        @media (max-width: 520px) {
          .history-page-header { flex-direction: column; }
          .history-refresh-btn { align-self: stretch; justify-content: center; }
          .history-log-toolbar, .history-log-body { padding-left: 14px; padding-right: 14px; }
          .history-record { align-items: flex-start; }
          .history-record-actions { flex-direction: column; align-items: flex-end; }
          .history-confirm { flex-wrap: wrap; justify-content: flex-end; max-width: 130px; }
          .history-status { min-width: 82px; }
        }
      `}</style>

      <header className="history-page-header">
        <div className="history-title-wrap">
          <div className="history-title-icon"><Clock3 size={22} /></div>
          <div>
            <h1>Check-in History</h1>
            <p className="history-subtitle">A quiet record of the nights you showed up for better sleep.</p>
          </div>
        </div>
        <button
          type="button"
          className={`history-refresh-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleRetry}
          disabled={isLoading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <section className="history-stats-grid" aria-label="Check-in summary">
        <article className="history-stat-card">
          <div className="history-stat-icon"><CalendarDays size={21} /></div>
          <div className="history-stat-copy">
            <span className="history-stat-value">{history.length}</span>
            <span className="history-stat-label">Nights checked in</span>
          </div>
        </article>
        <article className="history-stat-card">
          <div className="history-stat-icon"><CheckCircle2 size={21} /></div>
          <div className="history-stat-copy">
            <span className="history-stat-value">{onTimeCount}</span>
            <span className="history-stat-label">On-time nights</span>
          </div>
        </article>
        <article className="history-stat-card">
          <div className="history-stat-icon"><TrendingUp size={21} /></div>
          <div className="history-stat-copy">
            <span className="history-stat-value">{onTimeRate}%</span>
            <span className="history-stat-label">On-time rate</span>
          </div>
        </article>
      </section>

      <section className="history-log-card">
        <div className="history-log-toolbar">
          <div className="history-log-title">
            <Sparkles size={17} color="#c78d24" />
            <span>Your sleep log</span>
          </div>
          <div className="history-filter-group" aria-label="Filter check-ins">
            {([
              ['all', `All ${history.length}`],
              ['onTime', `On time ${onTimeCount}`],
              ['late', `Late ${lateCount}`],
            ] as const).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`history-filter-btn ${filter === value ? 'active' : ''}`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="history-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={handleRetry}>Try again</button>
          </div>
        )}

        {isLoading && history.length === 0 ? (
          <div className="history-skeleton-list" aria-label="Loading check-in history">
            <div className="history-skeleton" />
            <div className="history-skeleton" />
            <div className="history-skeleton" />
          </div>
        ) : visibleCount === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon"><Moon size={28} /></div>
            <h2>{history.length === 0 ? 'Your sleep log is waiting' : 'No matching check-ins'}</h2>
            <p>
              {history.length === 0
                ? 'Complete your first bedtime check-in and it will appear here.'
                : 'Try another filter to see more of your bedtime history.'}
            </p>
          </div>
        ) : (
          <div className="history-log-body">
            {Object.entries(groupedHistory).map(([month, items]) => (
              <div className="history-month-group" key={month}>
                <div className="history-month-label">
                  <CalendarDays size={13} />
                  {month}
                </div>
                <div className="history-records">
                  {items.map((item) => {
                    const formatted = formatHistoryDate(item.localCheckInDate);
                    const isOnTime = item.status === 'onTime';

                    return (
                      <article className={`history-record ${isOnTime ? 'on-time' : 'late'}`} key={item.id}>
                        <div className="history-date-block">
                          <div className="history-weekday">
                            {typeof formatted === 'string' ? '—' : formatted.weekday}
                          </div>
                          <div className="history-date-copy">
                            <span className="history-date-main">
                              {typeof formatted === 'string' ? formatted : formatted.date}
                            </span>
                            <span className="history-date-caption">Bedtime check-in</span>
                          </div>
                        </div>

                        <div className="history-record-actions">
                          <span className={`history-status ${isOnTime ? 'on-time' : 'late'}`}>
                            {isOnTime ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {isOnTime ? 'On time' : 'Late'}
                          </span>

                          {pendingDeleteId === item.id ? (
                            <div className="history-confirm">
                              <span>Delete?</span>
                              <button
                                type="button"
                                className="history-confirm-delete"
                                onClick={() => handleDelete(item)}
                                disabled={isLoading}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                className="history-confirm-cancel"
                                onClick={() => setPendingDeleteId(null)}
                                disabled={isLoading}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="history-delete-btn"
                              onClick={() => setPendingDeleteId(item.id)}
                              disabled={isLoading}
                              aria-label={`Delete check-in from ${item.localCheckInDate}`}
                              title="Delete check-in"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
