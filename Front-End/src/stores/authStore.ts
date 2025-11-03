import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';
import { authService } from '../services/authService';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (username: string, password: string) => {
        try {
          const response = await authService.login({ username, password });

          const user: User = {
            id: response.userId.toString(),
            userId: response.userId,
            username: response.username,
            email: response.email,
            phone: response.phone,
            role: response.role,
            createdAt: new Date(),
          };

          localStorage.setItem('authToken', response.token);

          set({
            user,
            isAuthenticated: true,
            token: response.token
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      register: async (userData) => {
        try {
          const response = await authService.register(userData);

          const user: User = {
            id: response.userId.toString(),
            userId: response.userId,
            username: response.username,
            email: response.email,
            phone: response.phone,
            createdAt: new Date(response.createdAt),
          };

          set({ user, isAuthenticated: false, token: null });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, isAuthenticated: false, token: null });
      },

      updateUser: async (userData) => {
        try {
          const { user } = get();
          if (!user) return false;

          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          return true;
        } catch (error) {
          console.error('Update user error:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);