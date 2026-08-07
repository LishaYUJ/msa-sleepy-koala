import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './stores/useStore';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { Badges } from './pages/Badges';
import { Settings } from './pages/Settings';
import { History } from './pages/History';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';

const StarrySky: React.FC = () => {
  return (
    <div className="stars-container" aria-hidden="true">
      <div className="star" style={{ top: '15%', left: '10%', width: '4px', height: '4px', animationDelay: '0s' }}></div>
      <div className="star" style={{ top: '25%', left: '40%', width: '3px', height: '3px', animationDelay: '1s' }}></div>
      <div className="star" style={{ top: '10%', left: '75%', width: '5px', height: '5px', animationDelay: '2.5s' }}></div>
      <div className="star" style={{ top: '45%', left: '20%', width: '3px', height: '3px', animationDelay: '0.8s' }}></div>
      <div className="star" style={{ top: '65%', left: '85%', width: '4px', height: '4px', animationDelay: '1.8s' }}></div>
      <div className="star" style={{ top: '80%', left: '45%', width: '3px', height: '3px', animationDelay: '3.2s' }}></div>
      <div className="star" style={{ top: '55%', left: '60%', width: '6px', height: '6px', animationDelay: '2.1s' }}></div>
      <div className="star" style={{ top: '90%', left: '15%', width: '4px', height: '4px', animationDelay: '0.4s' }}></div>
      <div className="star" style={{ top: '35%', left: '90%', width: '3px', height: '3px', animationDelay: '1.5s' }}></div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, onboardingCompleted, loadSettings } = useStore();

  useEffect(() => {
    if (token && onboardingCompleted === null) loadSettings();
  }, [token, onboardingCompleted, loadSettings]);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingCompleted === null) {
    return <div className="app-shell" aria-busy="true" />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-wrapper">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
};

const HomeRoute: React.FC = () => {
  const { token } = useStore();
  return token ? <Navigate to="/dashboard" replace /> : <Landing />;
};

const OnboardingRoute: React.FC = () => {
  const { token, onboardingCompleted, loadSettings } = useStore();

  useEffect(() => {
    if (token && onboardingCompleted === null) loadSettings();
  }, [token, onboardingCompleted, loadSettings]);

  if (!token) return <Navigate to="/login" replace />;
  if (onboardingCompleted === null) return <div className="app-shell" aria-busy="true" />;
  if (onboardingCompleted) return <Navigate to="/dashboard" replace />;
  return <Onboarding />;
};

const App: React.FC = () => {
  const { initSession } = useStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <BrowserRouter>
      {/* Dynamic Starry Sky Background Layer */}
      <StarrySky />
      
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Auth />} />
        
        <Route path="/" element={<HomeRoute />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Protected Leaderboard Route */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        
        {/* Protected Badges Route */}
        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <Badges />
            </ProtectedRoute>
          }
        />
        
        {/* Protected Settings Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback Catch-all -> Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
