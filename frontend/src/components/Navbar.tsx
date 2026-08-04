import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, Trophy, Star, Settings, LogOut, ChevronUp, ChevronDown, X, Trash2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../stores/useStore';

import sidebarLogo from '../assets/sidebar_logo.png';
import userAvatar from '../assets/user_avatar.png';

export const Navbar: React.FC = () => {
  const { nickname, logout, history, loadHistory, deleteHistoryItem } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openHistory = () => {
    loadHistory();
    setHistoryModalOpen(true);
  };

  const closeHistory = () => {
    setHistoryModalOpen(false);
  };

  // Close menus when location changes
  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const displayName = nickname || 'Lisha';

  return (
    <>
      <nav className="sidebar-container">
        <style>{`
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 260px;
            height: 100vh;
            background-color: #0c1024;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 32px 20px 24px 20px;
            z-index: 100;
            box-sizing: border-box;
          }

          /* Top Brand Section */
          .brand-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 32px;
          }

          .brand-logo-img {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 12px;
            filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
          }

          .brand-title {
            font-family: var(--font-serif);
            font-size: 1.35rem;
            font-weight: 500;
            color: #f3edd7;
            letter-spacing: -0.01em;
          }

          /* Nav Items List */
          .nav-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            flex: 1;
          }

          .sidebar-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 13px 18px;
            border-radius: 14px;
            color: #8e9bb4;
            font-family: var(--font-body);
            font-size: 0.95rem;
            font-weight: 500;
            text-decoration: none;
            background: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            width: 100%;
            text-align: left;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
          }

          .sidebar-item:hover {
            color: #f3edd7;
            background: rgba(255, 255, 255, 0.04);
          }

          .sidebar-item.active {
            background: #1c2347;
            border: 1px solid rgba(135, 149, 219, 0.22);
            color: #f3edd7;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }

          .sidebar-item.active .sidebar-icon {
            color: #f3edd7;
          }

          .sidebar-icon {
            width: 20px;
            height: 20px;
            color: #8e9bb4;
            transition: color 0.2s ease;
            flex-shrink: 0;
          }

          .sidebar-item:hover .sidebar-icon {
            color: #f3edd7;
          }

          /* Account Footer Area */
          .account-footer-wrapper {
            position: relative;
            width: 100%;
            margin-top: auto;
          }

          .account-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 16px;
            background: rgba(20, 26, 54, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
          }

          .account-card:hover {
            background: rgba(30, 38, 76, 0.8);
            border-color: rgba(255, 255, 255, 0.15);
          }

          .user-avatar-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid rgba(255, 255, 255, 0.15);
          }

          .user-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }

          .user-name-text {
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 0.95rem;
            color: #f3edd7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-subtitle {
            font-family: var(--font-body);
            font-size: 0.78rem;
            color: #8e9bb4;
          }

          .chevron-icon {
            color: #8e9bb4;
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }

          /* Account Menu Popover (Upward) */
          .account-popover {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 0;
            right: 0;
            background: #141a36;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            padding: 8px;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 4px;
            animation: popover-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 120;
          }

          @keyframes popover-fade-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .popover-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 10px;
            color: #f3edd7;
            font-size: 0.9rem;
            font-weight: 500;
            background: transparent;
            border: none;
            cursor: pointer;
            width: 100%;
            text-align: left;
            transition: background 0.15s ease;
          }

          .popover-item:hover {
            background: rgba(255, 255, 255, 0.08);
          }

          .popover-item.logout-item {
            color: #f87171;
          }

          .popover-item.logout-item:hover {
            background: rgba(248, 113, 113, 0.12);
          }

          /* Mobile Top Bar fallback */
          @media (max-width: 767px) {
            .sidebar-container {
              width: 100%;
              height: 64px;
              flex-direction: row;
              align-items: center;
              padding: 0 16px;
              border-right: none;
              border-bottom: 1px solid rgba(255, 255, 255, 0.08);
              bottom: auto;
            }
            .brand-header {
              flex-direction: row;
              margin-bottom: 0;
              gap: 10px;
            }
            .brand-logo-img {
              width: 36px;
              height: 36px;
              margin-bottom: 0;
            }
            .brand-title {
              font-size: 1.1rem;
            }
            .nav-list {
              flex-direction: row;
              justify-content: flex-end;
              gap: 6px;
            }
            .sidebar-item span {
              display: none;
            }
            .sidebar-item {
              padding: 8px;
              border-radius: 10px;
            }
            .account-footer-wrapper {
              display: none;
            }
          }

          /* Check-in History Modal */
          .history-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(4, 6, 16, 0.75);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .history-modal-content {
            background: #0f152d;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 24px;
            width: 100%;
            max-width: 540px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
            overflow: hidden;
          }

          .history-modal-header {
            padding: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .history-modal-title {
            font-family: var(--font-serif);
            font-size: 1.3rem;
            color: #f3edd7;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .history-modal-body {
            padding: 20px 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .history-row-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 14px;
            padding: 14px 18px;
          }

          .history-date-info {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #f3edd7;
            font-weight: 500;
            font-size: 0.95rem;
          }

          .history-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 8px;
            text-transform: uppercase;
          }

          .history-status-badge.onTime {
            background: rgba(78, 168, 129, 0.15);
            color: #4ea881;
          }

          .history-status-badge.late {
            background: rgba(251, 191, 36, 0.15);
            color: #fbbf24;
          }
        `}</style>

        {/* Top Brand Header */}
        <div className="brand-header">
          <img src={sidebarLogo} alt="Sleepy Koala Logo" className="brand-logo-img" />
          <h1 className="brand-title">Sleepy Koala</h1>
        </div>

        {/* Vertical Nav List */}
        <div className="nav-list">
          <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Home className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>

          <button onClick={openHistory} className="sidebar-item">
            <Clock className="sidebar-icon" />
            <span>Check-in History</span>
          </button>

          <NavLink to="/leaderboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Trophy className="sidebar-icon" />
            <span>Leaderboard</span>
          </NavLink>

          <NavLink to="/badges" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Star className="sidebar-icon" />
            <span>Rewards</span>
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Settings className="sidebar-icon" />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Bottom Account Card */}
        <div className="account-footer-wrapper">
          {accountMenuOpen && (
            <div className="account-popover">
              <button
                className="popover-item"
                onClick={() => {
                  setAccountMenuOpen(false);
                  navigate('/settings');
                }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="popover-item logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}

          <div
            className="account-card"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            title="User menu"
          >
            <img src={userAvatar} alt={displayName} className="user-avatar-img" />
            <div className="user-info">
              <span className="user-name-text">{displayName}</span>
              <span className="user-subtitle">Dreamer</span>
            </div>
            {accountMenuOpen ? <ChevronDown className="chevron-icon" /> : <ChevronUp className="chevron-icon" />}
          </div>
        </div>
      </nav>

      {/* Check-in History Modal */}
      {historyModalOpen && (
        <div className="history-modal-overlay" onClick={closeHistory}>
          <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-header">
              <div className="history-modal-title">
                <Clock size={22} color="#818cf8" />
                <span>Check-in History</span>
              </div>
              <button
                onClick={closeHistory}
                style={{ background: 'none', border: 'none', color: '#8e9bb4', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="history-modal-body">
              {history && history.length > 0 ? (
                history.map((item) => (
                  <div className="history-row-card" key={item.id}>
                    <div className="history-date-info">
                      <Calendar size={18} color="#818cf8" />
                      <span>{item.localCheckInDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`history-status-badge ${item.status === 'onTime' ? 'onTime' : 'late'}`}>
                        {item.status === 'onTime' ? (
                          <>
                            <CheckCircle2 size={14} /> On Time
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} /> Late
                          </>
                        )}
                      </span>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        style={{ background: 'none', border: 'none', color: '#8e9bb4', cursor: 'pointer', padding: '4px' }}
                        title="Delete check-in"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#8e9bb4' }}>
                  No check-in history records found yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
