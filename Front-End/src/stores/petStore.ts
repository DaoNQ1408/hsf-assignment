import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetState, Pet } from '../types';

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: [],

      addPet: async (petData) => {
        try {
          const newPet: Pet = {
            ...petData,
            id: Date.now().toString(),
            createdAt: new Date(),
          };

          set((state) => ({
            pets: [...state.pets, newPet],
          }));
          return true;
        } catch (error) {
          console.error('Add pet error:', error);
          return false;
        }
      },

      updatePet: async (id, petData) => {
        try {
          set((state) => ({
            pets: state.pets.map((pet) =>
              pet.id === id ? { ...pet, ...petData } : pet
            ),
          }));
          return true;
        } catch (error) {
          console.error('Update pet error:', error);
          return false;
        }
      },

      deletePet: async (id) => {
        try {
          set((state) => ({
            pets: state.pets.filter((pet) => pet.id !== id),
          }));
          return true;
        } catch (error) {
          console.error('Delete pet error:', error);
          return false;
        }
      },

      getPetById: (id) => {
        const { pets } = get();
        return pets.find((pet) => pet.id === id);
      },

      getPetsByOwnerId: (ownerId) => {
        const { pets } = get();
        return pets.filter((pet) => pet.ownerId === ownerId);
      },
    }),
    {
      name: 'pet-storage',
    }
  )
);