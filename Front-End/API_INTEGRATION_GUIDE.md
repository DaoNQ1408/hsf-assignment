# API Integration Guide

## Overview
This document describes how the backend APIs from BE.json have been integrated into the Front-End project.

## Configuration

### Base URL
The API base URL is configured in `src/services/apiConfig.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### Authentication
The API uses JWT Bearer token authentication. The token is automatically:
- Stored in localStorage after login
- Added to all API requests via axios interceptor
- Removed on logout or 401 errors

## Services

### 1. Authentication Service (`src/services/authService.ts`)

#### Login
```typescript
import { authService } from '@/services/authService';

const response = await authService.login({
  username: 'user123',
  password: 'password123'
});
// Returns: { userId, username, email, phone, role, token }
```

#### Register
```typescript
const response = await authService.register({
  username: 'newuser',
  password: 'password123',
  email: 'user@example.com',
  phone: '0123456789' // optional
});
// Returns: { userId, username, email, phone, createdAt }
```

### 2. Pet Service (`src/services/petService.ts`)

#### Get All Pets
```typescript
import { petService } from '@/services/petService';

const pets = await petService.getAllPets();
```

#### Get Pet by ID
```typescript
const pet = await petService.getPetById(1);
```

#### Get My Pets (requires authentication)
```typescript
const myPets = await petService.getMyPets();
```

#### Create Pet (requires ADMIN role)
```typescript
const newPet = await petService.createPet({
  petName: 'Fluffy',
  age: 2,
  weight: 5,
  height: 30,
  species: 'CAT',
  sex: 'FEMALE',
  description: 'A friendly cat',
  vaccination: true,
  imageUrls: ['https://example.com/image.jpg']
});
```

#### Update Pet (requires authentication)
```typescript
const updatedPet = await petService.updatePet(1, {
  petName: 'Fluffy Updated',
  age: 3,
  // ... other fields
});
```

#### Delete Pet (requires authentication)
```typescript
await petService.deletePet(1);
```

**Species Options:** `'CAT' | 'DOG' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'TURTLE' | 'REPTILE' | 'OTHER'`

**Sex Options:** `'MALE' | 'FEMALE'`

### 3. Application Service (`src/services/applicationService.ts`)

#### Get All Applications
```typescript
import { applicationService } from '@/services/applicationService';

const applications = await applicationService.getAllApplications();
```

#### Get Application by ID (requires authentication)
```typescript
const application = await applicationService.getApplicationById(1);
```

#### Get My Applications (as author - requires USER role)
```typescript
const myApplications = await applicationService.getApplicationsByAuthor();
```

#### Get Received Applications (as receiver - requires USER role)
```typescript
const receivedApps = await applicationService.getApplicationsByReceiver();
```

#### Create Application (requires USER role)
```typescript
const newApplication = await applicationService.createApplication({
  petId: 1,
  applicationContent: 'I would like to adopt this pet because...'
});
```

#### Update Application (requires USER role)
```typescript
const updated = await applicationService.updateUserApplication(1, {
  petId: 1,
  applicationContent: 'Updated content'
});
```

#### Hide Application (requires USER or ADMIN role)
```typescript
await applicationService.hideApplication(1);
```

#### Adopt Application (requires USER role)
```typescript
await applicationService.adoptApplication(applicationId, receiverId);
```

#### Delete Application (requires authentication)
```typescript
await applicationService.deleteApplication(1);
```

**Application Status:** `'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'HIDDEN'`

## Zustand Stores

### Auth Store (`src/stores/authStore.ts`)

```typescript
import { useAuthStore } from '@/stores/authStore';

function LoginComponent() {
  const { login, logout, user, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    const success = await login('username', 'password');
    if (success) {
      console.log('Logged in:', user);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

**Available Methods:**
- `login(username, password)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `updateUser(userData)` - Update user info

### Pet Store (`src/stores/petStore.ts`)

```typescript
import { usePetStore } from '@/stores/petStore';

function PetListComponent() {
  const { pets, loading, error, fetchPets, addPet, updatePet, deletePet } = usePetStore();

  useEffect(() => {
    fetchPets(); // Fetch all pets from API
  }, []);

  const handleAddPet = async () => {
    const success = await addPet({
      name: 'Buddy',
      species: 'DOG',
      age: 3,
      sex: 'male',
      images: [],
      description: 'Friendly dog',
      ownerId: currentUserId
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
    </div>
  );
}
```

**Available Methods:**
- `fetchPets()` - Fetch all pets from API
- `fetchMyPets()` - Fetch current user's pets
- `addPet(petData)` - Create new pet
- `updatePet(id, petData)` - Update pet
- `deletePet(id)` - Delete pet
- `getPetById(id)` - Get pet from local state
- `getPetsByOwnerId(ownerId)` - Get pets by owner

### Application Store (`src/stores/applicationStore.ts`)

```typescript
import { useApplicationStore } from '@/stores/applicationStore';

function ApplicationListComponent() {
  const { 
    applications, 
    loading, 
    fetchApplications, 
    addApplication,
    adoptApplication,
    hideApplication 
  } = useApplicationStore();

  useEffect(() => {
    fetchApplications(); // Fetch all applications
  }, []);

  const handleCreateApplication = async () => {
    const success = await addApplication({
      petId: 1,
      applicationContent: 'I want to adopt this pet'
    });
  };

  const handleAdopt = async (appId: number, receiverId: number) => {
    await adoptApplication(appId, receiverId);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {applications.map(app => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
```

**Available Methods:**
- `fetchApplications()` - Fetch all applications
- `fetchMyApplications()` - Fetch applications created by current user
- `fetchReceivedApplications()` - Fetch applications received by current user
- `addApplication(data)` - Create new application
- `updateApplication(id, data)` - Update application
- `deleteApplication(id)` - Delete application
- `hideApplication(id)` - Hide application
- `adoptApplication(applicationId, receiverId)` - Mark as adopted
- `getApplicationsByOwnerId(ownerId)` - Get by owner from local state
- `getActiveApplications()` - Get active applications from local state

## Error Handling

All API calls include error handling. Errors are:
1. Logged to console
2. Set in the store's `error` state
3. Return `false` for boolean returns

```typescript
const { error, loading } = usePetStore();

if (error) {
  console.log('Error occurred:', error);
}
```

## Authentication Flow

1. User logs in via `authStore.login()`
2. Token is stored in localStorage
3. Token is automatically added to all subsequent API requests
4. On 401 error, user is redirected to login page
5. On logout, token is removed

## Data Transformation

The stores automatically transform backend data to match frontend types:
- Backend `petName` → Frontend `name`
- Backend `imageUrls` → Frontend `images`
- Backend `petId` → Frontend `id` (as string)
- Backend `MALE/FEMALE` → Frontend `male/female`

## Example Usage in Pages

### Login Page
```typescript
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      window.location.href = '/';
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Pet Management Page
```typescript
import { usePetStore } from '@/stores/petStore';
import { useEffect } from 'react';

export default function PetManagePage() {
  const { pets, loading, fetchMyPets, deletePet } = usePetStore();

  useEffect(() => {
    fetchMyPets(); // Fetch only my pets
  }, []);

  const handleDelete = async (petId: number) => {
    if (confirm('Delete this pet?')) {
      await deletePet(petId);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {pets.map(pet => (
        <div key={pet.id}>
          <h3>{pet.name}</h3>
          <button onClick={() => handleDelete(pet.petId!)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Application Management Page
```typescript
import { useApplicationStore } from '@/stores/applicationStore';
import { useEffect } from 'react';

export default function ApplicationManagePage() {
  const { applications, fetchMyApplications, hideApplication } = useApplicationStore();

  useEffect(() => {
    fetchMyApplications(); // Fetch my applications
  }, []);

  const handleHide = async (appId: number) => {
    await hideApplication(appId);
  };

  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>
          <h3>{app.pet.name}</h3>
          <p>{app.applicationContent}</p>
          <p>Status: {app.status}</p>
          <button onClick={() => handleHide(app.applicationId!)}>Hide</button>
        </div>
      ))}
    </div>
  );
}
```

## API Endpoints Summary

### Authentication
- `POST /api/authentication/login` - Login
- `POST /api/authentication/register` - Register

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/{id}` - Get pet by ID
- `GET /api/pets/my-pets` - Get my pets (authenticated)
- `POST /api/pets` - Create pet (ADMIN only)
- `PUT /api/pets/{id}` - Update pet (authenticated)
- `DELETE /api/pets/{id}` - Delete pet (authenticated)

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application by ID
- `GET /api/applications/by-author` - Get my applications as author
- `GET /api/applications/by-receiver` - Get applications I received
- `POST /api/applications/create` - Create application (USER)
- `PUT /api/applications/by-author/{id}` - Update my application (USER)
- `PUT /api/applications/hidden/{id}` - Hide application (USER/ADMIN)
- `PUT /api/applications/adopted/{applicationId}/receiver/{receiverId}` - Adopt (USER)
- `DELETE /api/applications/{id}` - Delete application

## Notes

1. **Authorization**: Some endpoints require specific roles (USER, ADMIN)
2. **Token Management**: JWT token is automatically handled by axios interceptor
3. **State Persistence**: Zustand stores persist data to localStorage
4. **Loading States**: All async operations have loading/error states
5. **Type Safety**: Full TypeScript support with proper types for all API calls

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend allows:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### 401 Unauthorized
- Check if token is present in localStorage
- Verify token hasn't expired
- Ensure you're logged in

### Type Errors
- Make sure to use correct field names (petName vs name)
- Check species/sex values match allowed enums
- Verify number vs string for IDs

## Next Steps

1. Update your components to use the new stores
2. Replace mock data with real API calls
3. Test all CRUD operations
4. Handle loading and error states in UI
5. Add proper error messages for users

