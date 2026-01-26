export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  last_login_at: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface LoginResponse {
  token: string;
  admin: User;
}

export interface UpdateProfileData {
  full_name: string;
  email: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  error?: string;
}