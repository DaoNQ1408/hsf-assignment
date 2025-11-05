import type { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onClick: () => void;
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  // Handle both backend (petName, imageUrls) and frontend (name, images) field names
  const displayName = pet.petName || pet.name || 'Unknown';
  const displayImages = pet.imageUrls || pet.images || [];
  const displaySex = pet.sex ? pet.sex.toUpperCase() : 'UNKNOWN';
  const weight = pet.weight;
  const vaccination = pet.vaccination;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
    >
      <div className="aspect-square overflow-hidden bg-amber-100 relative">
        {displayImages.length > 0 ? (
          <img
            src={displayImages[0]}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {vaccination && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Vaccinated
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">{displayName}</h3>
        <div className="flex items-center gap-2 text-sm text-amber-700 mb-2">
          <span className="capitalize">{pet.species}</span>
          <span>•</span>
          <span>{pet.age} years old</span>
          <span>•</span>
          <span className="capitalize">{displaySex}</span>
        </div>
        {weight && (
          <p className="text-sm text-amber-600">Weight: {weight} kg</p>
        )}
      </div>
    </div>
  );
}
