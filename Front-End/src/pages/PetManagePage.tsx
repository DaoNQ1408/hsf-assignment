import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PetCard from '../components/PetCard';
import PetModal from '../components/PetModal';
import { useAuthStore } from '../stores/authStore';
import { usePetStore } from '../stores/petStore';
import { UploadService } from '../services/cloudinaryService';
import type { Pet } from '../types';

// Mirror backend enums
type PetSpecies = 'CAT' | 'DOG' | 'BIRD' | 'FISH' | 'RABBIT' | 'HAMSTER' | 'TURTLE' | 'REPTILE' | 'OTHER';
type PetSex = 'MALE' | 'FEMALE' | 'OTHER';

// Component PetFormModal cần nhận TẤT CẢ props cần thiết
interface PetFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    formData: {
        petName: string;
        species: PetSpecies | '';
        age: string;
        weight: string;
        height: string;
        sex: PetSex;
        imageUrls: string[];
        vaccination: boolean;
        description: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        petName: string;
        species: PetSpecies | '';
        age: string;
        weight: string;
        height: string;
        sex: PetSex;
        imageUrls: string[];
        vaccination: boolean;
        description: string;
    }>>;
    handleSubmit: (e: React.FormEvent) => void;
    handleImageUpload: (index: number, file: File) => void;
    addImageField: () => void;
    removeImageField: (index: number) => void;
    uploadingImages: boolean[];
    isEditModalOpen: boolean;
}

const PetFormModal = ({
                          isOpen,
                          onClose,
                          title,
                          formData,
                          setFormData,
                          handleSubmit,
                          handleImageUpload,
                          addImageField,
                          removeImageField,
                          uploadingImages,
                          isEditModalOpen
                      }: PetFormModalProps) => {
    const hasValidImages = formData.imageUrls.some(img => img.trim() !== '');

    return (
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
                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">Pet Name *</label>
                        <input
                            type="text"
                            value={formData.petName}
                            onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Species *</label>
                            <select
                                value={formData.species}
                                onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value as PetSpecies }))}
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                required
                            >
                                <option value="">Select species</option>
                                <option value="CAT">Cat</option>
                                <option value="DOG">Dog</option>
                                <option value="BIRD">Bird</option>
                                <option value="FISH">Fish</option>
                                <option value="RABBIT">Rabbit</option>
                                <option value="HAMSTER">Hamster</option>
                                <option value="TURTLE">Turtle</option>
                                <option value="REPTILE">Reptile</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Age (years) *</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Sex *</label>
                            <select
                                value={formData.sex}
                                onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as PetSex }))}
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                required
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Weight (kg) *</label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-2">Height (cm) *</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                min="0"
                                required
                            />
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.vaccination}
                                    onChange={(e) => setFormData(prev => ({ ...prev, vaccination: e.target.checked }))}
                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                                />
                                <span className="text-sm font-medium text-amber-900">Vaccinated</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">Images *</label>
                        <p className="text-sm text-amber-600 mb-3">Upload at least one image for your pet</p>
                        {formData.imageUrls.map((image, index) => (
                            <div key={index} className="mb-4 p-4 border border-amber-200 rounded-lg bg-amber-50">
                                <div className="flex items-center gap-3">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-500 transition">
                                            {uploadingImages[index] ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="text-sm text-amber-600">Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm text-amber-700">{image ? 'Change Image' : 'Upload Image'}</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(index, file);
                                            }}
                                            className="hidden"
                                            disabled={uploadingImages[index]}
                                        />
                                    </label>
                                    {formData.imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remove image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {image && (
                                    <div className="mt-3 relative">
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-amber-200"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="mt-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Another Image
                        </button>
                        {!hasValidImages && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-sm text-red-700">Please upload at least one image for your pet.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-y"
                            rows={8}
                            placeholder="Tell potential adopters about this pet's personality, habits, medical history, special needs, favorite activities, temperament with children/other pets, dietary requirements, training level, and any other important information..."
                        />
                        <p className="text-xs text-amber-600 mt-1">
                            {formData.description.length} characters
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={uploadingImages.some(uploading => uploading) || !hasValidImages}
                        >
                            {uploadingImages.some(uploading => uploading) ? 'Uploading Images...' : (isEditModalOpen ? 'Update Pet' : 'Add Pet')}
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
};

export default function PetManagePage() {
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<boolean[]>([false]);
    const [formData, setFormData] = useState({
        petName: '',
        species: '' as PetSpecies | '',
        age: '',
        weight: '',
        height: '',
        sex: 'MALE' as PetSex,
        imageUrls: [''],
        vaccination: false,
        description: '',
    });

    const { user, isAuthenticated } = useAuthStore();
    const { getPetsByOwnerId, addPet, updatePet, deletePet, fetchMyPets } = usePetStore();
    const navigate = useNavigate();

    const userPets = user ? getPetsByOwnerId(user.id) : [];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchMyPets();
    }, [isAuthenticated, navigate, fetchMyPets]);

    const handleAddPet = useCallback(() => {
        setFormData({
            petName: '',
            species: '',
            age: '',
            weight: '',
            height: '',
            sex: 'MALE',
            imageUrls: [''],
            vaccination: false,
            description: '',
        });
        setUploadingImages([false]);
        setIsAddModalOpen(true);
    }, []);

    const handleEditPet = useCallback((pet: Pet) => {
        setSelectedPet(pet);
        // Handle both backend (petName) and frontend (name) field names
        const name = pet.petName || pet.name || '';
        const images = pet.imageUrls || pet.images || [''];
        const species = (pet.species || '') as PetSpecies | '';
        const sex = ((pet.sex || 'MALE').toUpperCase() as PetSex);

        setFormData({
            petName: name,
            species: species,
            age: pet.age?.toString() || '',
            weight: (pet.weight || '').toString(),
            height: (pet.height || '').toString(),
            sex: sex,
            imageUrls: images.length > 0 ? images : [''],
            vaccination: !!pet.vaccination,
            description: pet.description || '',
        });
        setUploadingImages(new Array(images.length || 1).fill(false));
        setIsEditModalOpen(true);
    }, []);

    const handleDeletePet = useCallback(async (petId: string) => {
        if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
            await deletePet(petId);
        }
    }, [deletePet]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const petData: any = {
            petName: formData.petName,
            name: formData.petName, // Include both for compatibility
            species: formData.species || undefined,
            age: parseInt(formData.age, 10),
            weight: parseInt(formData.weight, 10),
            height: parseInt(formData.height, 10),
            sex: formData.sex,
            imageUrls: formData.imageUrls.filter(img => img.trim() !== ''),
            images: formData.imageUrls.filter(img => img.trim() !== ''), // Include both for compatibility
            vaccination: formData.vaccination,
            description: formData.description,
            userId: user.id,
            ownerId: user.id, // Include both for compatibility
        };

        const success = isEditModalOpen && selectedPet
            ? await updatePet(selectedPet.petId || selectedPet.id, petData)
            : await addPet(petData);

        if (success) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
        }
    }, [user, formData, isEditModalOpen, selectedPet, updatePet, addPet]);

    const handleImageUpload = useCallback(async (index: number, file: File) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingImages(prev => {
            const newUploadingImages = [...prev];
            newUploadingImages[index] = true;
            return newUploadingImages;
        });

        try {
            const imageUrl = await UploadService(file);

            if (imageUrl) {
                setFormData(prev => {
                    const newImages = [...prev.imageUrls];
                    newImages[index] = imageUrl;
                    return { ...prev, imageUrls: newImages };
                });
            } else {
                alert('Failed to upload image. Please try again.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImages(prev => {
                const newUploadingImages = [...prev];
                newUploadingImages[index] = false;
                return newUploadingImages;
            });
        }
    }, []);

    const addImageField = useCallback(() => {
        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
        setUploadingImages(prev => [...prev, false]);
    }, []);

    const removeImageField = useCallback((index: number) => {
        setFormData(prev => {
            const newImages = prev.imageUrls.filter((_, i) => i !== index);
            return { ...prev, imageUrls: newImages.length > 0 ? newImages : [''] };
        });
        setUploadingImages(prev => {
            const newUploadingImages = prev.filter((_, i) => i !== index);
            return newUploadingImages.length > 0 ? newUploadingImages : [false];
        });
    }, []);

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

                {userPets.length === 0 ? (
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
                        {userPets.map((pet) => (
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

                {/* Truyền TẤT CẢ props cần thiết vào PetFormModal */}
                <PetFormModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title="Add New Pet"
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    handleImageUpload={handleImageUpload}
                    addImageField={addImageField}
                    removeImageField={removeImageField}
                    uploadingImages={uploadingImages}
                    isEditModalOpen={isEditModalOpen}
                />

                <PetFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Pet"
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    handleImageUpload={handleImageUpload}
                    addImageField={addImageField}
                    removeImageField={removeImageField}
                    uploadingImages={uploadingImages}
                    isEditModalOpen={isEditModalOpen}
                />
            </div>
        </div>
    );
}