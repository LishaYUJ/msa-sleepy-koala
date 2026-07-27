import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Trophy, Award, Settings, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { useStore } from '../stores/useStore';

export const Navbar: React.FC = () => {
  const { theme, nickname, logout, toggleTheme } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      <style>{`
        .nav-container {
          position: fixed;
          background: var(--nav-bg);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--card-border);
          z-index: 100;
          
          /* Mobile style: bottom bar */
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .nav-brand {
          display: none;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          height: 100%;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 0.7rem;
          text-decoration: none;
          height: 100%;
          flex: 1;
          gap: 4px;
          transition: color var(--transition-fast);
        }

        .nav-item.active {
          color: var(--primary);
        }

        .nav-item:hover {
          color: var(--primary-hover);
        }

        .nav-icon {
          width: 22px;
          height: 22px;
        }

        .nav-sidebar-footer {
          display: none;
        }

        /* Desktop style: side panel */
        @media (min-width: 768px) {
          .nav-container {
            top: 0;
            bottom: 0;
            left: 0;
            right: auto;
            width: 240px;
            height: 100vh;
            border-top: none;
            border-right: 1px solid var(--card-border);
            flex-direction: column;
            justify-content: space-between;
            padding: 30px 20px;
          }

          .nav-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-main);
            margin-bottom: 40px;
            font-size: 1.25rem;
            align-self: flex-start;
            padding-left: 10px;
          }

          .nav-menu {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 15px;
            width: 100%;
            height: auto;
          }

          .nav-item {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: 1rem;
            padding: 12px 16px;
            border-radius: 12px;
            width: 100%;
            gap: 14px;
            height: auto;
            transition: all var(--transition-fast);
          }

          .nav-item.active {
            background-color: var(--primary-glow);
            color: var(--primary);
          }

          .nav-item:hover:not(.active) {
            background-color: var(--card-bg);
          }

          .nav-sidebar-footer {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 20px;
            border-top: 1px solid var(--card-border);
            padding-top: 20px;
          }

          .user-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 10px;
          }

          .user-name {
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--text-main);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .footer-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .footer-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
          }

          .footer-btn:hover {
            background-color: var(--card-bg);
            color: var(--text-main);
          }
          .mobile-theme-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Brand Logo for Desktop */}
      <div className="nav-brand">
        <Sparkles size={24} color="var(--primary)" />
        <span className="brand-font">Sleepy Koala</span>
      </div>

      {/* Nav Menu */}
      <div className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy className="nav-icon" />
          <span>Leaderboard</span>
        </NavLink>
        
        <NavLink to="/badges" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Award className="nav-icon" />
          <span>Badges</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-icon" />
          <span>Settings</span>
        </NavLink>
        
        {/* Mobile quick actions that sit inside the bottom panel */}
        <button onClick={toggleTheme} className="nav-item mobile-theme-btn" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Toggle Theme">
          {theme === 'light' ? <Moon className="nav-icon" /> : <Sun className="nav-icon" />}
          <span style={{ display: 'none' }}>Theme</span>
        </button>
      </div>

      {/* Footer user profile details for Desktop */}
      <div className="nav-sidebar-footer">
        <div className="user-badge">
          <div style={{ backgroundColor: 'var(--primary-glow)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
            {nickname ? nickname[0].toUpperCase() : 'U'}
          </div>
          <span className="user-name">{nickname || 'Cozy Sleeper'}</span>
        </div>
        <div className="footer-actions">
          <button onClick={toggleTheme} className="footer-btn" title="Toggle theme mode">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={handleLogout} className="footer-btn" title="Log out session" style={{ color: 'var(--error)' }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
