// Backend API Types
export type Species = 'CAT' | 'DOG' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'TURTLE' | 'REPTILE' | 'OTHER';
export type Sex = 'MALE' | 'FEMALE';
export type ApplicationStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'HIDDEN';
export type UserRole = 'USER' | 'ADMIN';

export interface UserResponse {
  userId: number;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  userId?: number; // Backend ID
  username: string;
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
  createdAt: Date;
}

export interface Pet {
  id: string;
  petId?: number; // Backend ID
  name: string;
  petName?: string; // Backend uses petName
  species: string;
  breed?: string;
  age: number;
  weight?: number;
  height?: number;
  sex: 'male' | 'female' | 'MALE' | 'FEMALE';
  images: string[];
  imageUrls?: string[]; // Backend uses imageUrls
  vaccinationSchedule?: string;
  vaccination?: boolean; // Backend uses vaccination boolean
  description: string;
  ownerId: string | number;
  createdAt: Date;
}

export interface AdoptionApplication {
  id: string;
  applicationId?: number; // Backend ID
  petId: string | number;
  pet: Pet;
  ownerId: string;
  owner: User;
  applicationContent?: string; // Backend field
  status: 'active' | 'adopted' | 'withdrawn' | ApplicationStatus;
  author?: UserResponse; // Backend author user
  receiver?: UserResponse | null; // Backend receiver user
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; password: string; email: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

export interface PetState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  fetchMyPets: () => Promise<void>;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePet: (id: string | number, pet: Partial<Pet>) => Promise<boolean>;
  deletePet: (id: string | number) => Promise<boolean>;
  getPetById: (id: string) => Pet | undefined;
  getPetsByOwnerId: (ownerId: string) => Pet[];
}

export interface ApplicationState {
  applications: AdoptionApplication[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
  fetchMyApplications: () => Promise<void>;
  fetchReceivedApplications: () => Promise<void>;
  addApplication: (application: { petId: number; applicationContent: string }) => Promise<boolean>;
  updateApplication: (id: string | number, application: Partial<AdoptionApplication>) => Promise<boolean>;
  deleteApplication: (id: string | number) => Promise<boolean>;
  hideApplication: (id: number) => Promise<boolean>;
  adoptApplication: (applicationId: number, receiverId: number) => Promise<boolean>;
  getApplicationsByOwnerId: (ownerId: string) => AdoptionApplication[];
  getActiveApplications: () => AdoptionApplication[];
}
