import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, apiResponse?: any) => {
        try {
          if (apiResponse) {
            const { token, ...userData } = apiResponse;
            
            set({ 
              user: userData as User, 
              isAuthenticated: true 
            });
            
            if (token) {
              localStorage.setItem('authToken', token);
            }
            
            return true;
          }
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find((u: User) => u.email === email && u.password === password);
          
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      register: async (userData) => {
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const existingUser = users.find((u: User) => u.email === userData.email);
          
          if (existingUser) {
            return false;
          }

          const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date(),
          };

          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          set({ user: newUser, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },

      logout: () => {
        // Xóa token khi logout
        localStorage.removeItem('authToken');
        set({ user: null, isAuthenticated: false });
      },

      updateUser: async (userData) => {
        try {
          const { user } = get();
          if (!user) return false;

          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: User) => u.id === user.id);
          
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            
            set({ user: { ...user, ...userData } });
            return true;
          }
          return false;
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