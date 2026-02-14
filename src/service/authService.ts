import { api, type ApiResponse } from './api';
import type { RegisterData, User, LoginCredentials, LoginResponse } from "../types/auth";

// Auth Service - ตรงกับ Backend API
class AuthService {
  // Register
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/api/admin/register', data);
    return response.data;
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/api/admin/login', credentials);
    return response.data;
  }

  // Logout
  async logout(): Promise<void> {
    // api.ts injects token automatically from localStorage
    // If token passed is different, we might want to handle it, but usually it matches
    await api.post('/api/admin/logout', {});
  }
}

export default new AuthService();