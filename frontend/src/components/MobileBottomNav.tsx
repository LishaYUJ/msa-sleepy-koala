import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, Trophy, Award, User } from 'lucide-react';
import { useStore } from '../stores/useStore';

export const MobileBottomNav: React.FC = () => {
  const { avatarUrl } = useStore();

  return (
    <nav className="mobile-bottom-nav">
      <style>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 68px;
            background: rgba(12, 16, 36, 0.94);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            z-index: 1000;
            justify-content: space-around;
            align-items: center;
            padding: 4px 10px calc(4px + env(safe-area-inset-bottom, 0px)) 10px;
            box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.4);
          }

          .mobile-nav-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            flex: 1;
            height: 100%;
            color: #8e9bb4;
            text-decoration: none;
            font-size: 0.72rem;
            font-weight: 600;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            border-radius: 12px;
          }

          .mobile-nav-tab.active {
            color: #818cf8;
            transform: translateY(-2px);
          }

          .mobile-nav-tab .tab-icon-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: all 0.2s ease;
          }

          .mobile-nav-tab.active .tab-icon-wrapper {
            background: rgba(129, 140, 248, 0.18);
            box-shadow: 0 0 12px rgba(129, 140, 248, 0.35);
          }

          .mobile-nav-tab.active .nav-icon {
            color: #818cf8;
            stroke-width: 2.5px;
          }

          .mobile-avatar-icon {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid #8e9bb4;
            transition: border-color 0.2s ease;
          }

          .mobile-nav-tab.active .mobile-avatar-icon {
            border-color: #818cf8;
            box-shadow: 0 0 8px rgba(129, 140, 248, 0.4);
          }

          .active-indicator-dot {
            position: absolute;
            top: 2px;
            right: 18%;
            width: 6px;
            height: 6px;
            background-color: #818cf8;
            border-radius: 50%;
            box-shadow: 0 0 6px #818cf8;
          }
        }
      `}</style>

      {/* Home Tab */}
      <NavLink to="/" className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <div className="tab-icon-wrapper">
              <Home className="nav-icon" size={20} />
              {isActive && <div className="active-indicator-dot" />}
            </div>
            <span>Home</span>
          </>
        )}
      </NavLink>

      {/* History Tab */}
      <NavLink to="/history" className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <div className="tab-icon-wrapper">
              <Clock className="nav-icon" size={20} />
              {isActive && <div className="active-indicator-dot" />}
            </div>
            <span>History</span>
          </>
        )}
      </NavLink>

      {/* Leaderboard Tab */}
      <NavLink to="/leaderboard" className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <div className="tab-icon-wrapper">
              <Trophy className="nav-icon" size={20} />
              {isActive && <div className="active-indicator-dot" />}
            </div>
            <span>Leaderboard</span>
          </>
        )}
      </NavLink>

      {/* Badges Tab */}
      <NavLink to="/badges" className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <div className="tab-icon-wrapper">
              <Award className="nav-icon" size={20} />
              {isActive && <div className="active-indicator-dot" />}
            </div>
            <span>Badges</span>
          </>
        )}
      </NavLink>

      {/* Profile/Settings Tab */}
      <NavLink to="/settings" className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}>
        {({ isActive }) => (
          <>
            <div className="tab-icon-wrapper">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="mobile-avatar-icon" />
              ) : (
                <User className="nav-icon" size={20} />
              )}
              {isActive && <div className="active-indicator-dot" />}
            </div>
            <span>Settings</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
