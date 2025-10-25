import { apiClient, ApiResponse } from '../lib/api';
import { User, UserRole } from '../lib/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GoogleAuthResponse {
  credential: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  clinicName?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithGoogle(googleResponse: GoogleAuthResponse): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', {
        credential: googleResponse.credential
      });
      
      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ token: string; user: User }>('/auth/refresh', {
        refreshToken
      });
      
      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return await apiClient.put<User>('/auth/profile', data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>('/auth/reset-password', {
        token,
        password
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Token Management
  private setAuthToken(token: string): void {
    apiClient.setAuthToken(token);
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
    }
  }

  private getAuthToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('authToken');
  }

  private setRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('refreshToken', token);
    }
  }

  private getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('refreshToken');
  }

  private setUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private getUser(): User | null {
    if (!this.isBrowser()) return null;
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  private clearAuth(): void {
    apiClient.removeAuthToken();
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Public methods for checking authentication state
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getCurrentUserSync(): User | null {
    return this.getUser();
  }

  getUserRole(): UserRole | null {
    const user = this.getUser();
    return user?.role || null;
  }

  // Initialize auth from localStorage on app start
  initializeAuth(): void {
    if (!this.isBrowser()) return;
    
    try {
      const token = this.getAuthToken();
      if (token) {
        apiClient.setAuthToken(token);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.clearAuth();
    }
  }
}

export const authService = new AuthService();