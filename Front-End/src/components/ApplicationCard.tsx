import type { AdoptionApplication } from '../types';

interface ApplicationCardProps {
  application: AdoptionApplication;
  onViewDetails: () => void;
}

export default function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
  const { pet, owner, createdAt } = application;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
            {pet.images.length > 0 ? (
              <img
                src={pet.images[0]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-1">{pet.name}</h3>
                <p className="text-amber-700 capitalize">
                  {pet.species} • {pet.age} years old • {pet.sex}
                </p>
                {pet.breed && (
                  <p className="text-sm text-amber-600">{pet.breed}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  application.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'adopted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Posted by {owner.username}</span>
              <span>•</span>
              <span>{formatDate(createdAt)}</span>
            </div>

            {pet.description && (
              <p className="text-amber-700 line-clamp-2 mb-4">{pet.description}</p>
            )}

            <button
              onClick={onViewDetails}
              className="w-full md:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
