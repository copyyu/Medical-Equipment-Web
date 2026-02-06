import type { RegisterData, User, ApiResponse, LoginCredentials, LoginResponse } from "../types/auth";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Auth Service - ตรงกับ Backend API
class AuthService {
  // Register
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result: ApiResponse<User> = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result: ApiResponse<LoginResponse> = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Logout
  async logout(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  //   // Get Profile
  //   async getProfile(token: string): Promise<User> {
  //     try {
  //       const response = await fetch(`${API_URL}/api/admin/profile`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         const error = await response.json();
  //         throw new Error(error.message || 'Failed to get profile');
  //       }

  //       const result: ApiResponse<User> = await response.json();
  //       return result.data;
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw error;
  //       }
  //       throw new Error('Failed to get profile');
  //     }
  //   }

  //   // Update Profile
  //   async updateProfile(token: string, data: UpdateProfileData): Promise<void> {
  //     try {
  //       const response = await fetch(`${API_URL}/api/admin/profile`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) {
  //         const error = await response.json();
  //         throw new Error(error.message || 'Failed to update profile');
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw error;
  //       }
  //       throw new Error('Failed to update profile');
  //     }
  //   }

  //   // Change Password
  //   async changePassword(token: string, data: ChangePasswordData): Promise<void> {
  //     try {
  //       const response = await fetch(`${API_URL}/api/admin/change-password`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) {
  //         const error = await response.json();
  //         throw new Error(error.message || 'Failed to change password');
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw error;
  //       }
  //       throw new Error('Failed to change password');
  //     }
  //   }
}

export default new AuthService();