# API Quick Reference

## 🔐 Authentication

### Login
```typescript
const { login } = useAuthStore();
await login('username', 'password');
```

### Register
```typescript
const { register } = useAuthStore();
await register({
  username: 'newuser',
  password: 'pass123',
  email: 'user@email.com',
  phone: '0123456789'
});
```

### Logout
```typescript
const { logout } = useAuthStore();
logout();
```

## 🐾 Pets

### Fetch All Pets
```typescript
const { fetchPets } = usePetStore();
await fetchPets();
```

### Fetch My Pets
```typescript
const { fetchMyPets } = usePetStore();
await fetchMyPets();
```

### Add Pet
```typescript
const { addPet } = usePetStore();
await addPet({
  name: 'Buddy',
  species: 'DOG',
  age: 3,
  weight: 10,
  height: 50,
  sex: 'male',
  images: ['url'],
  vaccination: true,
  description: 'Friendly dog',
  ownerId: userId
});
```

### Update Pet
```typescript
const { updatePet } = usePetStore();
await updatePet(petId, { name: 'New Name', age: 4 });
```

### Delete Pet
```typescript
const { deletePet } = usePetStore();
await deletePet(petId);
```

## 📋 Applications

### Fetch All Applications
```typescript
const { fetchApplications } = useApplicationStore();
await fetchApplications();
```

### Fetch My Applications
```typescript
const { fetchMyApplications } = useApplicationStore();
await fetchMyApplications();
```

### Fetch Received Applications
```typescript
const { fetchReceivedApplications } = useApplicationStore();
await fetchReceivedApplications();
```

### Create Application
```typescript
const { addApplication } = useApplicationStore();
await addApplication({
  petId: 1,
  applicationContent: 'I want to adopt this pet because...'
});
```

### Update Application
```typescript
const { updateApplication } = useApplicationStore();
await updateApplication(appId, {
  petId: 1,
  applicationContent: 'Updated content'
});
```

### Hide Application
```typescript
const { hideApplication } = useApplicationStore();
await hideApplication(appId);
```

### Adopt Application
```typescript
const { adoptApplication } = useApplicationStore();
await adoptApplication(applicationId, receiverId);
```

### Delete Application
```typescript
const { deleteApplication } = useApplicationStore();
await deleteApplication(appId);
```

## 📊 State Access

### Get Current User
```typescript
const { user, isAuthenticated } = useAuthStore();
```

### Get Pets List
```typescript
const { pets, loading, error } = usePetStore();
```

### Get Applications List
```typescript
const { applications, loading, error } = useApplicationStore();
```

## 🔑 Enums

### Species
`'CAT' | 'DOG' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'TURTLE' | 'REPTILE' | 'OTHER'`

### Sex
`'MALE' | 'FEMALE'` (API) or `'male' | 'female'` (Frontend)

### Application Status
`'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'HIDDEN'`

### User Role
`'USER' | 'ADMIN'`

## ⚙️ Configuration

### Change API Base URL
Edit `src/services/apiConfig.ts`:
```typescript
export const API_BASE_URL = 'http://your-backend-url:8080';
```

## 🔄 Data Flow

1. Component calls store method (e.g., `fetchPets()`)
2. Store calls service (e.g., `petService.getAllPets()`)
3. Service makes HTTP request via axios
4. Response is transformed and stored in Zustand state
5. Component re-renders with new data

## ⚠️ Common Issues

### Token Not Sent
- Ensure user is logged in
- Check localStorage has 'authToken'

### 401 Unauthorized
- Token expired - user needs to login again
- Token invalid - check backend

### CORS Error
- Backend must allow origin `http://localhost:5173`
- Check backend CORS configuration

### Type Mismatch
- Use `petId` (number) for API calls
- Use `id` (string) for component keys

