import { apiClient } from './apiConfig';
import type { PetResponse } from './petService';

export type ApplicationStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'HIDDEN';

export interface UserResponse {
  userId: number;
  phone: string;
  email: string;
}

export interface ApplicationRequest {
  petId: number;
  applicationContent: string;
}

export interface ApplicationResponse {
  applicationId: number;
  pet: PetResponse;
  applicationContent: string;
  status: ApplicationStatus;
  createdAt: string;
  author: UserResponse;
  receiver: UserResponse | null;
}

export const applicationService = {
  // GET /api/applications - Get all applications
  getAllApplications: async (): Promise<ApplicationResponse[]> => {
    const response = await apiClient.get<ApplicationResponse[]>('/api/applications');
    return response.data;
  },

  // GET /api/applications/{id} - Get application by id
  getApplicationById: async (id: number): Promise<ApplicationResponse> => {
    const response = await apiClient.get<ApplicationResponse>(`/api/applications/${id}`);
    return response.data;
  },

  // GET /api/applications/by-author - Get applications created by current user
  getApplicationsByAuthor: async (): Promise<ApplicationResponse[]> => {
    const response = await apiClient.get<ApplicationResponse[]>('/api/applications/by-author');
    return response.data;
  },

  // GET /api/applications/by-receiver - Get applications where current user is receiver
  getApplicationsByReceiver: async (): Promise<ApplicationResponse[]> => {
    const response = await apiClient.get<ApplicationResponse[]>('/api/applications/by-receiver');
    return response.data;
  },

  // POST /api/applications/create - Create new application
  createApplication: async (data: ApplicationRequest): Promise<ApplicationResponse> => {
    const response = await apiClient.post<ApplicationResponse>('/api/applications/create', data);
    return response.data;
  },

  // PUT /api/applications/by-author/{id} - Update user's own application
  updateUserApplication: async (id: number, data: ApplicationRequest): Promise<ApplicationResponse> => {
    const response = await apiClient.put<ApplicationResponse>(`/api/applications/by-author/${id}`, data);
    return response.data;
  },

  // PUT /api/application/by-author/{id} - Update application status directly
  updateApplicationStatus: async (id: number, status: ApplicationStatus): Promise<ApplicationResponse> => {
    const response = await apiClient.put<ApplicationResponse>(`/api/applications/status/by-author/${id}`, status, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // PUT /api/applications/hidden/{id} - Hide application
  hideApplication: async (id: number): Promise<ApplicationResponse> => {
    const response = await apiClient.put<ApplicationResponse>(`/api/applications/hidden/${id}`);
    return response.data;
  },

  // PUT /api/applications/adopted/{applicationId}/receiver/{receiverId} - Mark as adopted
  adoptApplication: async (applicationId: number, receiverId: number): Promise<ApplicationResponse> => {
    const response = await apiClient.put<ApplicationResponse>(
      `/api/applications/adopted/${applicationId}/receiver/${receiverId}`
    );
    return response.data;
  },

  // DELETE /api/applications/{id} - Delete application
  deleteApplication: async (id: number): Promise<ApplicationResponse> => {
    const response = await apiClient.delete<ApplicationResponse>(`/api/applications/${id}`);
    return response.data;
  },
};
