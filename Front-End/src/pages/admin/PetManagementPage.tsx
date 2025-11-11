import { useEffect, useState } from 'react';
import { petService, type PetResponse, type PetRequest, type Species, type Sex } from '../../services/petService';

export default function PetManagementPage() {
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'ALL' | Species>('ALL');
  const [ageFilter, setAgeFilter] = useState('');
  const [sexFilter, setSexFilter] = useState<'ALL' | Sex>('ALL');
  const [vaccinationFilter, setVaccinationFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  // Sort states
  const [sortColumn, setSortColumn] = useState<'petId' | 'petName' | 'species' | 'age' | 'sex' | 'vaccination' | 'ownerId' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await petService.getAllPets();
        setPets(data);
        setError(null);
      } catch (err: unknown) {
        setError('Failed to fetch pets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleUpdatePet = async (id: number, data: PetRequest) => {
    try {
      const updatedPet = await petService.updatePet(id, data);
      setPets(pets.map(p => p.petId === id ? updatedPet : p));
    } catch (err: unknown) {
      console.error('Failed to update pet:', err);
      alert('Failed to update pet.');
    }
  };

  const handleDeletePet = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petService.deletePet(id);
        setPets(pets.filter(p => p.petId !== id));
      } catch (err: unknown) {
        console.error('Failed to delete pet:', err);
        alert('Failed to delete pet.');
      }
    }
  };

  // Handle sorting
  const handleSort = (column: 'petId' | 'petName' | 'species' | 'age' | 'sex' | 'vaccination' | 'ownerId') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter pets based on filter criteria
  const filteredPets = pets.filter(pet => {
    const matchName = nameFilter === '' || pet.petName.toLowerCase().includes(nameFilter.toLowerCase());
    const matchSpecies = speciesFilter === 'ALL' || pet.species === speciesFilter;
    const matchAge = ageFilter === '' || pet.age.toString() === ageFilter;
    const matchSex = sexFilter === 'ALL' || pet.sex === sexFilter;
    const matchVaccination = vaccinationFilter === 'ALL' ||
      (vaccinationFilter === 'YES' && pet.vaccination) ||
      (vaccinationFilter === 'NO' && !pet.vaccination);
    return matchName && matchSpecies && matchAge && matchSex && matchVaccination;
  });

  // Sort filtered pets
  const sortedPets = [...filteredPets].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number | boolean = a[sortColumn];
    let bValue: string | number | boolean = b[sortColumn];

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <p className="text-center text-amber-800">Loading pets...</p>;
  if (error) return <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Manage Pets</h2>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-amber-50 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Name</label>
            <input
              type="text"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              placeholder="Search name..."
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Species</label>
            <select
              value={speciesFilter}
              onChange={e => setSpeciesFilter(e.target.value as 'ALL' | Species)}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All Species</option>
              <option value="CAT">CAT</option>
              <option value="DOG">DOG</option>
              <option value="BIRD">BIRD</option>
              <option value="FISH">FISH</option>
              <option value="RABBIT">RABBIT</option>
              <option value="HAMSTER">HAMSTER</option>
              <option value="TURTLE">TURTLE</option>
              <option value="REPTILE">REPTILE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Age</label>
            <input
              type="number"
              value={ageFilter}
              onChange={e => setAgeFilter(e.target.value)}
              placeholder="Filter by age..."
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Sex</label>
            <select
              value={sexFilter}
              onChange={e => setSexFilter(e.target.value as 'ALL' | Sex)}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All Sex</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Vaccination</label>
            <select
              value={vaccinationFilter}
              onChange={e => setVaccinationFilter(e.target.value as 'ALL' | 'YES' | 'NO')}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="YES">Vaccinated</option>
              <option value="NO">Not Vaccinated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-amber-200">
          <thead className="bg-amber-100">
            <tr>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('petId')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortColumn === 'petId' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('petName')}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortColumn === 'petName' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('species')}
              >
                <div className="flex items-center gap-1">
                  Species
                  {sortColumn === 'species' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('age')}
              >
                <div className="flex items-center gap-1">
                  Age
                  {sortColumn === 'age' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('sex')}
              >
                <div className="flex items-center gap-1">
                  Sex
                  {sortColumn === 'sex' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('vaccination')}
              >
                <div className="flex items-center gap-1">
                  Vaccination
                  {sortColumn === 'vaccination' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('ownerId')}
              >
                <div className="flex items-center gap-1">
                  Owner ID
                  {sortColumn === 'ownerId' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="py-2 px-4 border-b text-left text-amber-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPets.map(pet => (
              <PetRow key={pet.petId} pet={pet} onUpdate={handleUpdatePet} onDelete={handleDeletePet} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PetRowProps {
  pet: PetResponse;
  onUpdate: (id: number, data: PetRequest) => void;
  onDelete: (id: number) => void;
}

function PetRow({ pet, onUpdate, onDelete }: PetRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [petName, setPetName] = useState(pet.petName);
  const [species, setSpecies] = useState<Species>(pet.species);
  const [age, setAge] = useState(pet.age);
  const [sex, setSex] = useState<Sex>(pet.sex as Sex);
  const [vaccination, setVaccination] = useState(pet.vaccination);

  const handleSave = () => {
    onUpdate(pet.petId, {
      petName,
      species,
      age,
      sex,
      vaccination,
      weight: pet.weight,
      height: pet.height,
      description: pet.description,
      imageUrls: pet.imageUrls,
      userId: pet.ownerId
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPetName(pet.petName);
    setSpecies(pet.species);
    setAge(pet.age);
    setSex(pet.sex as Sex);
    setVaccination(pet.vaccination);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-amber-50">
      <td className="py-2 px-4 border-b">{pet.petId}</td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <input
            type="text"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            className="border rounded p-1 w-full"
          />
        ) : (
          pet.petName
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select value={species} onChange={e => setSpecies(e.target.value as Species)} className="border rounded p-1">
            <option value="CAT">CAT</option>
            <option value="DOG">DOG</option>
            <option value="BIRD">BIRD</option>
            <option value="FISH">FISH</option>
            <option value="RABBIT">RABBIT</option>
            <option value="HAMSTER">HAMSTER</option>
            <option value="TURTLE">TURTLE</option>
            <option value="REPTILE">REPTILE</option>
            <option value="OTHER">OTHER</option>
          </select>
        ) : (
          pet.species
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <input
            type="number"
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
        ) : (
          pet.age
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select value={sex} onChange={e => setSex(e.target.value as Sex)} className="border rounded p-1">
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
        ) : (
          pet.sex
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select value={vaccination ? 'Yes' : 'No'} onChange={e => setVaccination(e.target.value === 'Yes')} className="border rounded p-1">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ) : (
          pet.vaccination ? 'Yes' : 'No'
        )}
      </td>
      <td className="py-2 px-4 border-b">{pet.ownerId}</td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 hover:underline">Save</button>
            <button onClick={handleCancel} className="text-gray-600 hover:underline ml-2">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Edit</button>
        )}
        <button onClick={() => onDelete(pet.petId)} className="text-red-600 hover:underline ml-4">Delete</button>
      </td>
    </tr>
  );
}
