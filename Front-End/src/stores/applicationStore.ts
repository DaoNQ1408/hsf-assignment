import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplicationState, AdoptionApplication } from '../types';
import { usePetStore } from './petStore';
import { useAuthStore } from './authStore';

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: async (applicationData) => {
        try {
          const petStore = usePetStore.getState();
          const authStore = useAuthStore.getState();

          const pet = petStore.getPetById(applicationData.petId);
          const owner = authStore.user;

          if (!pet || !owner) return false;

          const newApplication: AdoptionApplication = {
            ...applicationData,
            pet,
            owner,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            applications: [...state.applications, newApplication],
          }));
          return true;
        } catch (error) {
          console.error('Add application error:', error);
          return false;
        }
      },

      updateApplication: async (id, applicationData) => {
        try {
          set((state) => ({
            applications: state.applications.map((app) =>
              app.id === id
                ? { ...app, ...applicationData, updatedAt: new Date() }
                : app
            ),
          }));
          return true;
        } catch (error) {
          console.error('Update application error:', error);
          return false;
        }
      },

      deleteApplication: async (id) => {
        try {
          set((state) => ({
            applications: state.applications.filter((app) => app.id !== id),
          }));
          return true;
        } catch (error) {
          console.error('Delete application error:', error);
          return false;
        }
      },

      getApplicationsByOwnerId: (ownerId) => {
        const { applications } = get();
        return applications.filter((app) => app.ownerId === ownerId);
      },

      getActiveApplications: () => {
        const { applications } = get();
        return applications.filter((app) => app.status === 'active');
      },
    }),
    {
      name: 'application-storage',
    }
  )
);
