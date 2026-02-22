import type { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Token Management
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if JWT token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; // No expiry claim — treat as not expired
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Malformed token — treat as expired
  }
};

// User Data Management
export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    // Basic validation: must have id and username
    if (!parsed || !parsed.id || !parsed.username) return null;
    return parsed as User;
  } catch {
    // Corrupted data — clear it
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};

// Check if user is authenticated (includes token expiry check)
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};