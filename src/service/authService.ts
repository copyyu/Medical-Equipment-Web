import { api, type ApiResponse } from './api';
import type { RegisterData, User, LoginCredentials, LoginResponse } from "../types/auth";

// Auth Service — function-based (consistent with other services)

export async function register(data: RegisterData): Promise<User> {
  const response = await api.post<ApiResponse<User>>('/api/admin/register', data);
  return response.data;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>('/api/admin/login', credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/api/admin/logout', {});
}
