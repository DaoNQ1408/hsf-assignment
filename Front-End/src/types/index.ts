export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: 'male' | 'female';
  images: string[];
  vaccinationSchedule: string;
  description: string;
  ownerId: string;
  createdAt: Date;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  pet: Pet;
  ownerId: string;
  owner: User;
  status: 'active' | 'adopted' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, apiResponse?: any) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

export interface PetState {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePet: (id: string, pet: Partial<Pet>) => Promise<boolean>;
  deletePet: (id: string) => Promise<boolean>;
  getPetById: (id: string) => Pet | undefined;
  getPetsByOwnerId: (ownerId: string) => Pet[];
}

export interface ApplicationState {
  applications: AdoptionApplication[];
  addApplication: (application: Omit<AdoptionApplication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateApplication: (id: string, application: Partial<AdoptionApplication>) => Promise<boolean>;
  deleteApplication: (id: string) => Promise<boolean>;
  getApplicationsByOwnerId: (ownerId: string) => AdoptionApplication[];
  getActiveApplications: () => AdoptionApplication[];
}
