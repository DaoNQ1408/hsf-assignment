import type { Pet } from '../types';

interface PetModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PetModal({ pet, isOpen, onClose }: PetModalProps) {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-900">{pet.name}</h2>
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
          {pet.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pet.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-amber-100">
                    <img
                      src={image}
                      alt={`${pet.name} - Image ${index + 1}`}
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
                <p className="text-sm text-amber-600">Breed</p>
                <p className="font-semibold text-amber-900">{pet.breed || 'Mixed'}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Age</p>
                <p className="font-semibold text-amber-900">{pet.age} years</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-amber-600">Sex</p>
                <p className="font-semibold text-amber-900 capitalize">{pet.sex}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">About {pet.name}</h3>
              <p className="text-amber-700 leading-relaxed">{pet.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Vaccination Schedule</h3>
              <p className="text-amber-700 leading-relaxed whitespace-pre-line">{pet.vaccinationSchedule}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
