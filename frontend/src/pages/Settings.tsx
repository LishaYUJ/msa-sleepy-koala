import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { GlassCard } from '../components/GlassCard';
import { api } from '../services/api';
import { LogOut, Sun, Moon, Sparkles, Save, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { nickname, logout, token } = useStore();
  const [localNickname, setLocalNickname] = useState(nickname || '');
  const [cutoffTime, setCutoffTime] = useState('22:00');
  const [themePreference, setThemePreference] = useState('system');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [successLocal, setSuccessLocal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Load current settings on mount
  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const response: any = await api.get('/api/settings/me', token);
        if (isMounted && response) {
          setLocalNickname(response.nickname);
          setCutoffTime(response.cutoffTime);
          setThemePreference(response.themePreference || 'system');
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorLocal('Could not load settings: ' + (err.body?.message || err.message));
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);
    setSuccessLocal(false);

    if (!localNickname.trim()) {
      setErrorLocal('Nickname cannot be empty.');
      return;
    }

    // Basic cutoff validation: must be between 20:00 and 23:59
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regex.test(cutoffTime)) {
      setErrorLocal('Bedtime must be in HH:mm 24-hour format.');
      return;
    }

    const [hours, minutes] = cutoffTime.split(':').map(Number);
    if (hours < 20 || hours > 23 || (hours === 23 && minutes > 59)) {
      setErrorLocal('Bedtime (cutoff time) must be between 20:00 and 23:59 for the MVP.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Access Zustand store action to write settings
      await useStore.getState().updateSettings({
        nickname: localNickname,
        cutoffTime: cutoffTime,
        themePreference: themePreference
      });
      setSuccessLocal(true);
      setTimeout(() => setSuccessLocal(false), 3000);
    } catch (err: any) {
      setErrorLocal(err.body?.message || err.message || 'Error occurred while saving configurations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-view">
      <style>{`
        .settings-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: var(--text-main);
          width: 100%;
        }

        .settings-header {
          margin-bottom: 8px;
        }

        .settings-header h1 {
          font-size: 2rem;
          margin-bottom: 6px;
        }

        .settings-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .settings-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .settings-form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .status-msg {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: left;
        }

        .status-msg.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
        }

        .status-msg.success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--success);
        }

        .settings-btn-save {
          align-self: flex-start;
          margin-top: 10px;
        }

        .theme-selections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 4px;
        }

        .theme-select-btn {
          border: 1px solid var(--input-border);
          border-radius: 10px;
          padding: 10px;
          background-color: var(--input-bg);
          color: var(--text-main);
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .theme-select-btn.active {
          border-color: var(--primary);
          background-color: var(--primary-glow);
          color: var(--primary);
        }

        .logout-danger-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .logout-danger-card h3 {
          font-size: 1.1rem;
        }
      `}</style>

      {/* Header Info */}
      <div className="settings-header">
        <h1 className="brand-font">Settings</h1>
        <p>Edit your Profile settings, bedtime intention, and light/dark preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Main Configuration form */}
        <GlassCard>
          <form onSubmit={handleSave} className="settings-form-wrapper">
            <h2 className="brand-font" style={{ fontSize: '1.25rem' }}>Account & Sleep settings</h2>

            {/* Error & Success States */}
            {errorLocal && <div className="status-msg error">{errorLocal}</div>}
            {successLocal && (
              <div className="status-msg success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} />
                Settings saved successfully!
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="settingsNickname">Display Nickname</label>
              <input
                id="settingsNickname"
                type="text"
                className="form-input"
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="settingsBedtime">Target Bedtime (evening: 20:00–23:59)</label>
              <input
                id="settingsBedtime"
                type="text"
                placeholder="22:30"
                className="form-input"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Adjusting target bedtime changes when you must check in to be marked "On Time".
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Theme Preference</label>
              <div className="theme-selections">
                <button
                  type="button"
                  onClick={() => setThemePreference('light')}
                  className={`theme-select-btn ${themePreference === 'light' ? 'active' : ''}`}
                >
                  <Sun size={18} />
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setThemePreference('dark')}
                  className={`theme-select-btn ${themePreference === 'dark' ? 'active' : ''}`}
                >
                  <Moon size={18} />
                  Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => setThemePreference('system')}
                  className={`theme-select-btn ${themePreference === 'system' ? 'active' : ''}`}
                >
                  <Sparkles size={18} />
                  Use System
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary settings-btn-save"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </GlassCard>

        {/* Danger Action panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="logout-danger-card">
            <h3 className="brand-font" style={{ color: 'var(--text-main)' }}>Manage Session</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sign out of Sleepy Koala. We keep your streaks safe on our records.
            </p>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ borderColor: 'var(--error)', color: 'var(--error)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
