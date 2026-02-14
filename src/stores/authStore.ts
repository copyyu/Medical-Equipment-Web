import { create } from 'zustand';
import authService from '../service/authService';
import type { AuthState, LoginCredentials } from '../types/auth';
import { clearAuthData, getToken, getUser, setToken, setUser } from '../utils/auth';

interface AuthStore extends AuthState {
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);

      // Save to localStorage
      setToken(response.token);
      setUser(response.admin);

      // Update store
      set({
        user: response.admin,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    const currentToken = get().token || getToken();

    try {
      if (currentToken) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      clearAuthData();

      // Reset store
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Check if user is authenticated (on app init)
  checkAuth: () => {
    set({ isLoading: true });

    try {
      const token = getToken();
      const user = getUser();

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
