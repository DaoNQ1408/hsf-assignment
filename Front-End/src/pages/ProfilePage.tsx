import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetCard from '../components/PetCard';
import PetModal from '../components/PetModal';
import { useAuthStore } from '../stores/authStore';
import { usePetStore } from '../stores/petStore';
import type { Pet } from '../types';

export default function PetManagePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    sex: 'male' as 'male' | 'female',
    images: [''],
    vaccinationSchedule: '',
    description: '',
  });

  const { user, isAuthenticated } = useAuthStore();
  const { getPetsByOwnerId, addPet, updatePet, deletePet } = usePetStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setPets(getPetsByOwnerId(user.id));
    }
  }, [isAuthenticated, user, getPetsByOwnerId, navigate]);

  const handleAddPet = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      sex: 'male',
      images: [''],
      vaccinationSchedule: '',
      description: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      sex: pet.sex,
      images: pet.images,
      vaccinationSchedule: pet.vaccinationSchedule,
      description: pet.description,
    });
    setIsEditModalOpen(true);
  };

  const handleDeletePet = async (petId: string) => {
    if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      await deletePet(petId);
      if (user) {
        setPets(getPetsByOwnerId(user.id));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const petData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: parseInt(formData.age),
      sex: formData.sex,
      images: formData.images.filter(img => img.trim() !== ''),
      vaccinationSchedule: formData.vaccinationSchedule,
      description: formData.description,
      ownerId: user.id,
    };

    let success = false;

    if (isEditModalOpen && selectedPet) {
      success = await updatePet(selectedPet.id, petData);
    } else {
      success = await addPet(petData);
    }

    if (success) {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setPets(getPetsByOwnerId(user.id));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const PetFormModal = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-900">{title}</h2>
          <button onClick={onClose} className="text-amber-600 hover:text-amber-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Species *</label>
              <input
                type="text"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="e.g., Dog, Cat"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Breed</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="e.g., Golden Retriever"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Age (years) *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                min="0"
                max="30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Sex *</label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Images</label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Enter image URL"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
            >
              + Add Another Image
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Vaccination Schedule</label>
            <textarea
              value={formData.vaccinationSchedule}
              onChange={(e) => setFormData({ ...formData, vaccinationSchedule: e.target.value })}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              rows={4}
              placeholder="Describe the pet's vaccination history and schedule..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              rows={4}
              placeholder="Tell potential adopters about this pet's personality, habits, and needs..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition"
            >
              {isEditModalOpen ? 'Update Pet' : 'Add Pet'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">My Pets</h1>
            <p className="text-amber-700 mt-1">Manage your pets and create adoption applications</p>
          </div>
          <button
            onClick={handleAddPet}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Pet
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">No pets added yet</h2>
            <p className="text-amber-700 mb-6">Add your first pet to get started with adoption applications</p>
            <button
              onClick={handleAddPet}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="relative">
                <PetCard pet={pet} onClick={() => setSelectedPet(pet)} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditPet(pet)}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                  >
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <PetModal pet={selectedPet} isOpen={!!selectedPet} onClose={() => setSelectedPet(null)} />
        <PetFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Pet" />
        <PetFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Pet" />
      </div>
    </div>
  );
}
