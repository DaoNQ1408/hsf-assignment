import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetState, Pet } from '../types';
import { petService } from '../services/petService';
import type { PetResponse, PetRequest, Species, Sex } from '../services/petService';

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: [],
      loading: false,
      error: null,

      fetchPets: async () => {
        try {
          set({ loading: true, error: null });
          const response = await petService.getAllPets();

          const pets: Pet[] = response.map((pet: PetResponse) => ({
            id: pet.petId.toString(),
            petId: pet.petId,
            name: pet.petName,
            petName: pet.petName,
            species: pet.species,
            age: pet.age,
            weight: pet.weight,
            height: pet.height,
            sex: pet.sex.toLowerCase() as 'male' | 'female',
            images: pet.imageUrls,
            imageUrls: pet.imageUrls,
            vaccination: pet.vaccination,
            description: pet.description,
            ownerId: pet.ownerId,
            createdAt: new Date(),
          }));

          set({ pets, loading: false });
        } catch (error) {
          console.error('Fetch pets error:', error);
          set({ error: 'Failed to fetch pets', loading: false });
        }
      },

      fetchMyPets: async () => {
        try {
          set({ loading: true, error: null });
          const response = await petService.getMyPets();

          const pets: Pet[] = response.map((pet: PetResponse) => ({
            id: pet.petId.toString(),
            petId: pet.petId,
            name: pet.petName,
            petName: pet.petName,
            species: pet.species,
            age: pet.age,
            weight: pet.weight,
            height: pet.height,
            sex: pet.sex.toLowerCase() as 'male' | 'female',
            images: pet.imageUrls,
            imageUrls: pet.imageUrls,
            vaccination: pet.vaccination,
            description: pet.description,
            ownerId: pet.ownerId,
            createdAt: new Date(),
          }));

          set({ pets, loading: false });
        } catch (error) {
          console.error('Fetch my pets error:', error);
          set({ error: 'Failed to fetch my pets', loading: false });
        }
      },

      addPet: async (petData) => {
        try {
          set({ loading: true, error: null });

          const petRequest: PetRequest = {
            petName: petData.name || petData.petName || '',
            age: petData.age,
            weight: petData.weight || 0,
            height: petData.height || 0,
            species: petData.species.toUpperCase() as Species,
            sex: petData.sex.toUpperCase() as Sex,
            description: petData.description,
            vaccination: petData.vaccination || false,
            imageUrls: petData.images || petData.imageUrls || [],
          };

          const response = await petService.createPet(petRequest);

          const newPet: Pet = {
            id: response.petId.toString(),
            petId: response.petId,
            name: response.petName,
            petName: response.petName,
            species: response.species,
            age: response.age,
            weight: response.weight,
            height: response.height,
            sex: response.sex.toLowerCase() as 'male' | 'female',
            images: response.imageUrls,
            imageUrls: response.imageUrls,
            vaccination: response.vaccination,
            description: response.description,
            ownerId: response.ownerId,
            createdAt: new Date(),
          };

          set((state) => ({
            pets: [...state.pets, newPet],
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Add pet error:', error);
          set({ error: 'Failed to add pet', loading: false });
          return false;
        }
      },

      updatePet: async (id, petData) => {
        try {
          set({ loading: true, error: null });

          const petId = typeof id === 'string' ? parseInt(id) : id;

          const petRequest: PetRequest = {
            petName: petData.name || petData.petName || '',
            age: petData.age || 0,
            weight: petData.weight || 0,
            height: petData.height || 0,
            species: (petData.species?.toUpperCase() || 'OTHER') as Species,
            sex: (petData.sex?.toUpperCase() || 'MALE') as Sex,
            description: petData.description || '',
            vaccination: petData.vaccination || false,
            imageUrls: petData.images || petData.imageUrls || [],
          };

          const response = await petService.updatePet(petId, petRequest);

          const updatedPet: Pet = {
            id: response.petId.toString(),
            petId: response.petId,
            name: response.petName,
            petName: response.petName,
            species: response.species,
            age: response.age,
            weight: response.weight,
            height: response.height,
            sex: response.sex.toLowerCase() as 'male' | 'female',
            images: response.imageUrls,
            imageUrls: response.imageUrls,
            vaccination: response.vaccination,
            description: response.description,
            ownerId: response.ownerId,
            createdAt: new Date(),
          };

          set((state) => ({
            pets: state.pets.map((pet) =>
              pet.id === id.toString() || pet.petId === petId ? updatedPet : pet
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Update pet error:', error);
          set({ error: 'Failed to update pet', loading: false });
          return false;
        }
      },

      deletePet: async (id) => {
        try {
          set({ loading: true, error: null });

          const petId = typeof id === 'string' ? parseInt(id) : id;
          await petService.deletePet(petId);

          set((state) => ({
            pets: state.pets.filter((pet) =>
              pet.id !== id.toString() && pet.petId !== petId
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Delete pet error:', error);
          set({ error: 'Failed to delete pet', loading: false });
          return false;
        }
      },

      getPetById: (id) => {
        const { pets } = get();
        return pets.find((pet) => pet.id === id || pet.petId?.toString() === id);
      },

      getPetsByOwnerId: (ownerId) => {
        const { pets } = get();
        return pets.filter((pet) =>
          pet.ownerId.toString() === ownerId
        );
      },
    }),
    {
      name: 'pet-storage',
    }
  )
);