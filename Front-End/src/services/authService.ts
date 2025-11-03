import { apiClient } from './apiConfig';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
}

export const authService = {
  // POST /api/authentication/login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/authentication/login', data);
    return response.data;
  },

  // POST /api/authentication/register
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/api/authentication/register', data);
    return response.data;
  },
};

