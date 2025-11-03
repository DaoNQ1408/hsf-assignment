import { apiClient } from './apiConfig';

export type Species = 'CAT' | 'DOG' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'TURTLE' | 'REPTILE' | 'OTHER';
export type Sex = 'MALE' | 'FEMALE';

export interface PetRequest {
  petName: string;
  age: number;
  weight: number;
  height: number;
  species: Species;
  sex: Sex;
  description: string;
  vaccination: boolean;
  imageUrls: string[];
  userId?: number;
}

export interface PetResponse {
  petId: number;
  petName: string;
  age: number;
  weight: number;
  height: number;
  species: Species;
  sex: string;
  description: string;
  vaccination: boolean;
  imageUrls: string[];
  ownerId: number;
}

export const petService = {
  // GET /api/pets - Get all pets
  getAllPets: async (): Promise<PetResponse[]> => {
    const response = await apiClient.get<PetResponse[]>('/api/pets');
    return response.data;
  },

  // GET /api/pets/{id} - Get pet by id
  getPetById: async (id: number): Promise<PetResponse> => {
    const response = await apiClient.get<PetResponse>(`/api/pets/${id}`);
    return response.data;
  },

  // GET /api/pets/my-pets - Get current user's pets
  getMyPets: async (): Promise<PetResponse[]> => {
    const response = await apiClient.get<PetResponse[]>('/api/pets/my-pets');
    return response.data;
  },

  // POST /api/pets - Create new pet
  createPet: async (data: PetRequest): Promise<PetResponse> => {
    const response = await apiClient.post<PetResponse>('/api/pets', data);
    return response.data;
  },

  // PUT /api/pets/{id} - Update pet
  updatePet: async (id: number, data: PetRequest): Promise<PetResponse> => {
    const response = await apiClient.put<PetResponse>(`/api/pets/${id}`, data);
    return response.data;
  },

  // DELETE /api/pets/{id} - Delete pet
  deletePet: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/api/pets/${id}`);
    return response.data;
  },
};

