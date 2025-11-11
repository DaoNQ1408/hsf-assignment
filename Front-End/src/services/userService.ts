import { apiClient } from './apiConfig';

export interface AdminResponse {
  userId: number;
  userName: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  createdAt: string;
}

export interface AdminUpdateRequest {
  phone?: string;
  role?: 'USER' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
}

export interface UserResponse {
    imageUrl?: string;
    phone?: string;
    email?: string;
}

export interface UserProfileUpdateRequest{
    imageUrl?: string;
    phone?: string;
    email?: string;
}

export interface UserProfileResponse {
    userId: number;
    userName: string;
    email: string;
    phone: string;
    imageUrl?: string;
    createdAt: string;
}

const userService = {
  // Get all users (Admin only)
  getAllUsers: async (): Promise<AdminResponse[]> => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (id: number): Promise<AdminResponse> => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (id: number, data: AdminUpdateRequest): Promise<AdminResponse> => {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id: number): Promise<AdminResponse> => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },

    getUserProfile : async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get('/api/users/user-profile');
        return response.data;
    },

    updateUserProfile : async (data: UserProfileUpdateRequest): Promise<UserResponse> => {
        const response = await apiClient.put('/api/users/user-profile', data);
        return response.data;
    }
};

export default userService;

