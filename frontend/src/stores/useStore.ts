import { create } from 'zustand';
import { api } from '../services/api';

export interface Badge {
  name: string;
  description: string;
  unlockedAt?: string;
}

export interface UserSummary {
  todayCheckedIn: boolean;
  todayStatus: string | null;
  currentStreak: int;
  longestStreak: int;
  koalaMood: string;
  consecutiveBadDays: number;
  fatigueScore: number;
  fatigueState: 'healthy' | 'weak' | 'veryWeak';
  cutoffTime: string;
  badges: Badge[];
}

export interface CheckInHistory {
  id: string;
  localCheckInDate: string;
  status: string;
}

export interface LeaderRank {
  rank: number;
  nickname: string;
  currentStreak: number;
}

export interface BadgesSummary {
  unlocked: Badge[];
  locked: Badge[];
}

export interface UserSettingsDto {
  nickname: string;
  cutoffTime: string;
  themePreference: string;
  avatarDataUrl?: string | null;
}

interface AppState {
  // Session State
  token: string | null;
  userId: string | null;
  email: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;

  // Domain State
  summary: UserSummary | null;
  history: CheckInHistory[];
  leaderboard: LeaderRank[];
  badges: BadgesSummary | null;

  // Actions
  setError: (msg: string | null) => void;
  initSession: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  loadSummary: (localDateString?: string) => Promise<void>;
  performCheckIn: () => Promise<any>;
  deleteHistoryItem: (id: string, localDateString?: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadBadges: () => Promise<void>;
  updateSettings: (dto: UserSettingsDto) => Promise<void>;
  toggleTheme: () => void;
}

// Helper to get local date string yyyy-MM-dd
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get local time string HH:mm
export function getLocalTimeString(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getCurrentSleepDateString(date: Date = new Date()): string {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const windowStartMinutes = 21 * 60;

  if (currentMinutes < windowStartMinutes) {
    const previous = new Date(date);
    previous.setDate(previous.getDate() - 1);
    return getLocalDateString(previous);
  }

  return getLocalDateString(date);
}

export const useStore = create<AppState>((set, get) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  email: localStorage.getItem('email'),
  nickname: localStorage.getItem('nickname'),
  avatarUrl: localStorage.getItem('avatarUrl'),
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 
         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  isLoading: false,
  error: null,
  summary: null,
  history: [],
  leaderboard: [],
  badges: null,

  setError: (msg) => set({ error: msg }),

  initSession: () => {
    const activeTheme = get().theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('email', response.email);
      localStorage.setItem('nickname', response.nickname);
      if (response.avatarDataUrl) {
        localStorage.setItem('avatarUrl', response.avatarDataUrl);
      } else {
        localStorage.removeItem('avatarUrl');
      }
      
      set({
        token: response.token,
        userId: response.userId,
        email: response.email,
        nickname: response.nickname,
        avatarUrl: response.avatarDataUrl || null,
        isLoading: false,
      });

      const sleepDate = getCurrentSleepDateString();
      await get().loadSummary(sleepDate);
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
      throw err;
    }
  },

  register: async (email, password, nickname) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post('/api/auth/register', { email, password, nickname });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('email', response.email);
      localStorage.setItem('nickname', response.nickname);
      if (response.avatarDataUrl) {
        localStorage.setItem('avatarUrl', response.avatarDataUrl);
      } else {
        localStorage.removeItem('avatarUrl');
      }
      
      set({
        token: response.token,
        userId: response.userId,
        email: response.email,
        nickname: response.nickname,
        avatarUrl: response.avatarDataUrl || null,
        isLoading: false,
      });

      const sleepDate = getCurrentSleepDateString();
      await get().loadSummary(sleepDate);
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickname');
    localStorage.removeItem('avatarUrl');
    set({
      token: null,
      userId: null,
      email: null,
      nickname: null,
      avatarUrl: null,
      summary: null,
      history: [],
      leaderboard: [],
      badges: null,
      error: null
    });
  },

  loadSummary: async (localDateString) => {
    const { token } = get();
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const dateParam = localDateString || getCurrentSleepDateString();
      const timeParam = getLocalTimeString();
      const response = await api.get<UserSummary>(`/api/me/summary?localDate=${dateParam}&localTime=${timeParam}`, token);
      set({ summary: response, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
    }
  },

  performCheckIn: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const localDate = getLocalDateString();
      const localTime = getLocalTimeString();
      const response: any = await api.post(
        '/api/checkins',
        { localDate, localTime },
        token
      );
      set({ isLoading: false });
      
      // Reload summary following successful check-in
      await get().loadSummary(response.localCheckInDate || getCurrentSleepDateString());
      return response;
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
      throw err;
    }
  },

  deleteHistoryItem: async (id, localDateString) => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/checkins/${id}`, token);
      set({ isLoading: false });
      
      // Reload relevant info
      const sleepDate = localDateString || getCurrentSleepDateString();
      await get().loadSummary(sleepDate);
      await get().loadHistory();
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
      throw err;
    }
  },

  loadHistory: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<CheckInHistory[]>('/api/checkins/me', token);
      set({ history: response, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
    }
  },

  loadLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      // Leaderboard does not technically require auth on backend but good to pass token if we have it
      const response = await api.get<LeaderRank[]>('/api/leaderboard', get().token || undefined);
      set({ leaderboard: response, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
    }
  },

  loadBadges: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<BadgesSummary>('/api/badges/me', token);
      set({ badges: response, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
    }
  },

  updateSettings: async (dto) => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.put<UserSettingsDto>('/api/settings/me', dto, token);
      
      // Store nickname in localStorage
      localStorage.setItem('nickname', response.nickname);
      localStorage.setItem('theme', response.themePreference);
      if (response.avatarDataUrl) {
        localStorage.setItem('avatarUrl', response.avatarDataUrl);
      } else {
        localStorage.removeItem('avatarUrl');
      }
      
      // Update local state theme and nickname
      set({ 
        nickname: response.nickname,
        avatarUrl: response.avatarDataUrl || null,
        theme: response.themePreference === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : (response.themePreference as 'light' | 'dark'),
        isLoading: false 
      });

      // Apply theme changes to element
      document.documentElement.setAttribute('data-theme', get().theme);
      
      // Reload summary in case cutoff is changed
      await get().loadSummary();
    } catch (err: any) {
      set({ isLoading: false, error: err.body?.message || err.message });
      throw err;
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    set({ theme: nextTheme });
  }
}));
// Helper types
type int = number;
