import { useState, useEffect, useCallback } from 'react';
import { authService, type LoginCredentials, type RegisterData, type AuthResponse } from '../services';
import { User, UserRole } from '../lib/types';
import { useAsyncOperation, useFormSubmission } from './useApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        authService.initializeAuth();
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getCurrentUserSync();
        
        setState({
          user,
          isAuthenticated,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication initialization failed',
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const { execute: login, loading: loginLoading, error: loginError } = useAsyncOperation(
    (credentials: LoginCredentials) => authService.login(credentials)
  );

  const handleLogin = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        const response = await login(credentials);
        if (response) {
          setState(prev => ({
            ...prev,
            user: response.user,
            isAuthenticated: true,
            error: null,
          }));
          return true;
        }
        return false;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Login failed',
        }));
        return false;
      }
    },
    [login]
  );

  // Google login function
  const { execute: googleLogin, loading: googleLoginLoading } = useAsyncOperation(
    (googleResponse: { credential: string }) => authService.loginWithGoogle(googleResponse)
  );

  const handleGoogleLogin = useCallback(
    async (googleResponse: { credential: string }): Promise<boolean> => {
      try {
        const response = await googleLogin(googleResponse);
        if (response) {
          setState(prev => ({
            ...prev,
            user: response.user,
            isAuthenticated: true,
            error: null,
          }));
          return true;
        }
        return false;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Google login failed',
        }));
        return false;
      }
    },
    [googleLogin]
  );

  // Register function
  const { execute: register, loading: registerLoading } = useAsyncOperation(
    (data: RegisterData) => authService.register(data)
  );

  const handleRegister = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      try {
        const response = await register(data);
        if (response) {
          setState(prev => ({
            ...prev,
            user: response.user,
            isAuthenticated: true,
            error: null,
          }));
          return true;
        }
        return false;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }));
        return false;
      }
    },
    [register]
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Update profile function
  const { submit: updateProfile, loading: updateProfileLoading } = useFormSubmission(
    (data: Partial<User>) => authService.updateProfile(data),
    (updatedUser) => {
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  );

  // Change password function
  const { submit: changePassword, loading: changePasswordLoading } = useFormSubmission(
    ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword)
  );

  // Forgot password function
  const { execute: forgotPassword, loading: forgotPasswordLoading } = useAsyncOperation(
    (email: string) => authService.forgotPassword(email)
  );

  // Reset password function
  const { execute: resetPassword, loading: resetPasswordLoading } = useAsyncOperation(
    ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password)
  );

  // Utility functions
  const getUserRole = useCallback((): UserRole | null => {
    return state.user?.role || null;
  }, [state.user]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const isAdmin = useCallback((): boolean => {
    return state.user?.role === UserRole.SUPER_ADMIN;
  }, [state.user]);

  const isClinicAdmin = useCallback((): boolean => {
    return state.user?.role === UserRole.CLINIC_ADMIN;
  }, [state.user]);

  return {
    // State
    ...state,
    
    // Actions
    login: handleLogin,
    googleLogin: handleGoogleLogin,
    register: handleRegister,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    
    // Loading states
    loginLoading,
    googleLoginLoading,
    registerLoading,
    updateProfileLoading,
    changePasswordLoading,
    forgotPasswordLoading,
    resetPasswordLoading,
    
    // Errors
    loginError,
    
    // Utilities
    getUserRole,
    hasRole,
    isAdmin,
    isClinicAdmin,
  };
}