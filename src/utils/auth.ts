import type { User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const TOKEN_CREATED_KEY = 'token_created_at';

// Token expiry must match backend: 24 hours (admin_service.go line 115)
const TOKEN_EXPIRY_HOURS = 24;

// Token Management
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  // Store creation timestamp for expiry tracking
  localStorage.setItem(TOKEN_CREATED_KEY, Date.now().toString());
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_CREATED_KEY);
};

// Check if token is expired based on stored creation timestamp
// Backend uses random base64 tokens (NOT JWT), so we track expiry client-side
export const isTokenExpired = (_token: string): boolean => {
  const createdAt = localStorage.getItem(TOKEN_CREATED_KEY);
  if (!createdAt) return false; // No timestamp = legacy token, let server decide

  const elapsed = Date.now() - parseInt(createdAt, 10);
  const expiryMs = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
  return elapsed >= expiryMs;
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
