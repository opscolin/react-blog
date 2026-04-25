import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        set({ token: res.data.token, user: res.data.user });
      },
      logout: () => {
        set({ token: null, user: null });
      }
    }),
    {
      name: 'auth',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
