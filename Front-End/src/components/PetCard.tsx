import type { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onClick: () => void;
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
    >
      <div className="aspect-square overflow-hidden bg-amber-100">
        {pet.images.length > 0 ? (
          <img
            src={pet.images[0]}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">{pet.name}</h3>
        <div className="flex items-center gap-4 text-sm text-amber-700">
          <span className="capitalize">{pet.species}</span>
          <span>•</span>
          <span>{pet.age} years old</span>
          <span>•</span>
          <span className="capitalize">{pet.sex}</span>
        </div>
        {pet.breed && (
          <p className="text-sm text-amber-600 mt-1">{pet.breed}</p>
        )}
      </div>
    </div>
  );
}
