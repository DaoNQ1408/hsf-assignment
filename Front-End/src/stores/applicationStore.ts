import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplicationState, AdoptionApplication, Pet, User } from '../types';
import { applicationService } from '../services/applicationService';
import type { ApplicationResponse } from '../services/applicationService';

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],
      loading: false,
      error: null,

      fetchApplications: async () => {
        try {
          set({ loading: true, error: null });
          const response = await applicationService.getAllApplications();

          const applications: AdoptionApplication[] = response.map((app: ApplicationResponse) => {
            const pet: Pet = {
              id: app.pet.petId.toString(),
              petId: app.pet.petId,
              name: app.pet.petName,
              petName: app.pet.petName,
              species: app.pet.species,
              age: app.pet.age,
              weight: app.pet.weight,
              height: app.pet.height,
              sex: app.pet.sex.toLowerCase() as 'male' | 'female',
              images: app.pet.imageUrls,
              imageUrls: app.pet.imageUrls,
              vaccination: app.pet.vaccination,
              description: app.pet.description,
              ownerId: app.pet.ownerId,
              createdAt: new Date(),
            };

            const author: User = {
              id: app.author.userId.toString(),
              userId: app.author.userId,
              username: '',
              email: app.author.email,
              phone: app.author.phone,
              createdAt: new Date(),
            };

            return {
              id: app.applicationId.toString(),
              applicationId: app.applicationId,
              petId: app.pet.petId,
              pet,
              ownerId: app.author.userId.toString(),
              owner: author,
              applicationContent: app.applicationContent,
              status: app.status,
              author: app.author,
              receiver: app.receiver,
              createdAt: new Date(app.createdAt),
              updatedAt: new Date(app.createdAt),
            };
          });

          set({ applications, loading: false });
        } catch (error) {
          console.error('Fetch applications error:', error);
          set({ error: 'Failed to fetch applications', loading: false });
        }
      },

      fetchMyApplications: async () => {
        try {
          set({ loading: true, error: null });
          const response = await applicationService.getApplicationsByAuthor();

          const applications: AdoptionApplication[] = response.map((app: ApplicationResponse) => {
            const pet: Pet = {
              id: app.pet.petId.toString(),
              petId: app.pet.petId,
              name: app.pet.petName,
              petName: app.pet.petName,
              species: app.pet.species,
              age: app.pet.age,
              weight: app.pet.weight,
              height: app.pet.height,
              sex: app.pet.sex.toLowerCase() as 'male' | 'female',
              images: app.pet.imageUrls,
              imageUrls: app.pet.imageUrls,
              vaccination: app.pet.vaccination,
              description: app.pet.description,
              ownerId: app.pet.ownerId,
              createdAt: new Date(),
            };

            const author: User = {
              id: app.author.userId.toString(),
              userId: app.author.userId,
              username: '',
              email: app.author.email,
              phone: app.author.phone,
              createdAt: new Date(),
            };

            return {
              id: app.applicationId.toString(),
              applicationId: app.applicationId,
              petId: app.pet.petId,
              pet,
              ownerId: app.author.userId.toString(),
              owner: author,
              applicationContent: app.applicationContent,
              status: app.status,
              author: app.author,
              receiver: app.receiver,
              createdAt: new Date(app.createdAt),
              updatedAt: new Date(app.createdAt),
            };
          });

          set({ applications, loading: false });
        } catch (error) {
          console.error('Fetch my applications error:', error);
          set({ error: 'Failed to fetch my applications', loading: false });
        }
      },

      fetchReceivedApplications: async () => {
        try {
          set({ loading: true, error: null });
          const response = await applicationService.getApplicationsByReceiver();

          const applications: AdoptionApplication[] = response.map((app: ApplicationResponse) => {
            const pet: Pet = {
              id: app.pet.petId.toString(),
              petId: app.pet.petId,
              name: app.pet.petName,
              petName: app.pet.petName,
              species: app.pet.species,
              age: app.pet.age,
              weight: app.pet.weight,
              height: app.pet.height,
              sex: app.pet.sex.toLowerCase() as 'male' | 'female',
              images: app.pet.imageUrls,
              imageUrls: app.pet.imageUrls,
              vaccination: app.pet.vaccination,
              description: app.pet.description,
              ownerId: app.pet.ownerId,
              createdAt: new Date(),
            };

            const author: User = {
              id: app.author.userId.toString(),
              userId: app.author.userId,
              username: '',
              email: app.author.email,
              phone: app.author.phone,
              createdAt: new Date(),
            };

            return {
              id: app.applicationId.toString(),
              applicationId: app.applicationId,
              petId: app.pet.petId,
              pet,
              ownerId: app.author.userId.toString(),
              owner: author,
              applicationContent: app.applicationContent,
              status: app.status,
              author: app.author,
              receiver: app.receiver,
              createdAt: new Date(app.createdAt),
              updatedAt: new Date(app.createdAt),
            };
          });

          set({ applications, loading: false });
        } catch (error) {
          console.error('Fetch received applications error:', error);
          set({ error: 'Failed to fetch received applications', loading: false });
        }
      },

      addApplication: async (applicationData) => {
        try {
          set({ loading: true, error: null });

          const response = await applicationService.createApplication(applicationData);

          const pet: Pet = {
            id: response.pet.petId.toString(),
            petId: response.pet.petId,
            name: response.pet.petName,
            petName: response.pet.petName,
            species: response.pet.species,
            age: response.pet.age,
            weight: response.pet.weight,
            height: response.pet.height,
            sex: response.pet.sex.toLowerCase() as 'male' | 'female',
            images: response.pet.imageUrls,
            imageUrls: response.pet.imageUrls,
            vaccination: response.pet.vaccination,
            description: response.pet.description,
            ownerId: response.pet.ownerId,
            createdAt: new Date(),
          };

          const author: User = {
            id: response.author.userId.toString(),
            userId: response.author.userId,
            username: '',
            email: response.author.email,
            phone: response.author.phone,
            createdAt: new Date(),
          };

          const newApplication: AdoptionApplication = {
            id: response.applicationId.toString(),
            applicationId: response.applicationId,
            petId: response.pet.petId,
            pet,
            ownerId: response.author.userId.toString(),
            owner: author,
            applicationContent: response.applicationContent,
            status: response.status,
            author: response.author,
            receiver: response.receiver,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.createdAt),
          };

          set((state) => ({
            applications: [...state.applications, newApplication],
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Add application error:', error);
          set({ error: 'Failed to add application', loading: false });
          return false;
        }
      },

      updateApplication: async (id, applicationData) => {
        try {
          set({ loading: true, error: null });

          const applicationId = typeof id === 'string' ? parseInt(id) : id;

          // Validate petId
          const petId = typeof applicationData.petId === 'string'
            ? parseInt(applicationData.petId)
            : applicationData.petId;

          if (!petId || petId === 0 || isNaN(petId)) {
            console.error('Invalid petId for update:', applicationData.petId);
            set({ error: 'Invalid pet ID', loading: false });
            return false;
          }

          const updateRequest = {
            petId: petId,
            applicationContent: applicationData.applicationContent || '',
          };

          console.log('Updating application:', applicationId, 'with data:', updateRequest);

          const response = await applicationService.updateUserApplication(applicationId, updateRequest);

          const pet: Pet = {
            id: response.pet.petId.toString(),
            petId: response.pet.petId,
            name: response.pet.petName,
            petName: response.pet.petName,
            species: response.pet.species,
            age: response.pet.age,
            weight: response.pet.weight,
            height: response.pet.height,
            sex: response.pet.sex.toLowerCase() as 'male' | 'female',
            images: response.pet.imageUrls,
            imageUrls: response.pet.imageUrls,
            vaccination: response.pet.vaccination,
            description: response.pet.description,
            ownerId: response.pet.ownerId,
            createdAt: new Date(),
          };

          const author: User = {
            id: response.author.userId.toString(),
            userId: response.author.userId,
            username: '',
            email: response.author.email,
            phone: response.author.phone,
            createdAt: new Date(),
          };

          const updatedApplication: AdoptionApplication = {
            id: response.applicationId.toString(),
            applicationId: response.applicationId,
            petId: response.pet.petId,
            pet,
            ownerId: response.author.userId.toString(),
            owner: author,
            applicationContent: response.applicationContent,
            status: response.status,
            author: response.author,
            receiver: response.receiver,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.createdAt),
          };

          set((state) => ({
            applications: state.applications.map((app) =>
              app.id === id.toString() || app.applicationId === applicationId
                ? updatedApplication
                : app
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Update application error:', error);
          set({ error: 'Failed to update application', loading: false });
          return false;
        }
      },

      deleteApplication: async (id) => {
        try {
          set({ loading: true, error: null });

          const applicationId = typeof id === 'string' ? parseInt(id) : id;
          await applicationService.deleteApplication(applicationId);

          set((state) => ({
            applications: state.applications.filter((app) =>
              app.id !== id.toString() && app.applicationId !== applicationId
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Delete application error:', error);
          set({ error: 'Failed to delete application', loading: false });
          return false;
        }
      },

      hideApplication: async (id) => {
        try {
          set({ loading: true, error: null });
          await applicationService.hideApplication(id);

          set((state) => ({
            applications: state.applications.map((app) =>
              app.applicationId === id
                ? { ...app, status: 'HIDDEN' as const }
                : app
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Hide application error:', error);
          set({ error: 'Failed to hide application', loading: false });
          return false;
        }
      },

      adoptApplication: async (applicationId, receiverId) => {
        try {
          set({ loading: true, error: null });
          const response = await applicationService.adoptApplication(applicationId, receiverId);

          const pet: Pet = {
            id: response.pet.petId.toString(),
            petId: response.pet.petId,
            name: response.pet.petName,
            petName: response.pet.petName,
            species: response.pet.species,
            age: response.pet.age,
            weight: response.pet.weight,
            height: response.pet.height,
            sex: response.pet.sex.toLowerCase() as 'male' | 'female',
            images: response.pet.imageUrls,
            imageUrls: response.pet.imageUrls,
            vaccination: response.pet.vaccination,
            description: response.pet.description,
            ownerId: response.pet.ownerId,
            createdAt: new Date(),
          };

          const author: User = {
            id: response.author.userId.toString(),
            userId: response.author.userId,
            username: '',
            email: response.author.email,
            phone: response.author.phone,
            createdAt: new Date(),
          };

          const adoptedApplication: AdoptionApplication = {
            id: response.applicationId.toString(),
            applicationId: response.applicationId,
            petId: response.pet.petId,
            pet,
            ownerId: response.author.userId.toString(),
            owner: author,
            applicationContent: response.applicationContent,
            status: response.status,
            author: response.author,
            receiver: response.receiver,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.createdAt),
          };

          set((state) => ({
            applications: state.applications.map((app) =>
              app.applicationId === applicationId
                ? adoptedApplication
                : app
            ),
            loading: false,
          }));

          return true;
        } catch (error) {
          console.error('Adopt application error:', error);
          set({ error: 'Failed to adopt application', loading: false });
          return false;
        }
      },

      getApplicationsByOwnerId: (ownerId) => {
        const { applications } = get();
        return applications.filter((app) => app.ownerId === ownerId);
      },

      getActiveApplications: () => {
        const { applications } = get();
        return applications.filter((app) =>
           app.status === 'AVAILABLE'
        );
      },
    }),
    {
      name: 'application-storage',
    }
  )
);
