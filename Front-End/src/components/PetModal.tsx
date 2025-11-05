import type { Pet } from '../types';

interface PetModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PetModal({ pet, isOpen, onClose }: PetModalProps) {
  if (!isOpen || !pet) return null;

  // Handle both backend (petName, imageUrls) and frontend (name, images) field names
  const displayName = pet.petName || pet.name || 'Unknown';
  const displayImages = pet.imageUrls || pet.images || [];
  const displaySex = pet.sex ? pet.sex.toUpperCase() : 'UNKNOWN';
  const weight = pet.weight;
  const height = pet.height;
  const vaccination = pet.vaccination;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-900">{displayName}</h2>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {displayImages.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayImages.map((image: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-amber-100">
                    <img
                      src={image}
                      alt={`${displayName} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Species</p>
                <p className="font-semibold text-amber-900 capitalize">{pet.species}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Age</p>
                <p className="font-semibold text-amber-900">{pet.age} years</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Sex</p>
                <p className="font-semibold text-amber-900 capitalize">{displaySex}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Vaccination</p>
                <p className="font-semibold text-amber-900">
                  {vaccination ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes
                    </span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </p>
              </div>
            </div>

            {(weight || height) && (
              <div className="grid grid-cols-2 gap-4">
                {weight && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-600">Weight</p>
                    <p className="font-semibold text-amber-900">{weight} kg</p>
                  </div>
                )}
                {height && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-600">Height</p>
                    <p className="font-semibold text-amber-900">{height} cm</p>
                  </div>
                )}
              </div>
            )}

            {pet.description && (
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">About {displayName}</h3>
                <div className="bg-amber-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-amber-700 leading-relaxed whitespace-pre-wrap">{pet.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
