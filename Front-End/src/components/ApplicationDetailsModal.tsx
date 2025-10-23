import type { AdoptionApplication } from '../types';

interface ApplicationDetailsModalProps {
  application: AdoptionApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailsModal({ application, isOpen, onClose }: ApplicationDetailsModalProps) {
  if (!isOpen || !application) return null;

  const { pet, owner, createdAt, updatedAt } = application;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-900">Adoption Application Details</h2>
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
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Pet Information</h3>

              {pet.images.length > 0 && (
                <div className="mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-amber-100">
                    <img
                      src={pet.images[0]}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-amber-100">
                  <span className="text-amber-600">Name</span>
                  <span className="font-medium text-amber-900">{pet.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-amber-100">
                  <span className="text-amber-600">Species</span>
                  <span className="font-medium text-amber-900 capitalize">{pet.species}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-amber-100">
                  <span className="text-amber-600">Breed</span>
                  <span className="font-medium text-amber-900">{pet.breed || 'Mixed'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-amber-100">
                  <span className="text-amber-600">Age</span>
                  <span className="font-medium text-amber-900">{pet.age} years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-amber-100">
                  <span className="text-amber-600">Sex</span>
                  <span className="font-medium text-amber-900 capitalize">{pet.sex}</span>
                </div>
              </div>

              {pet.description && (
                <div className="mt-4">
                  <h4 className="font-medium text-amber-900 mb-2">About {pet.name}</h4>
                  <p className="text-amber-700 text-sm leading-relaxed">{pet.description}</p>
                </div>
              )}

              {pet.vaccinationSchedule && (
                <div className="mt-4">
                  <h4 className="font-medium text-amber-900 mb-2">Vaccination Schedule</h4>
                  <p className="text-amber-700 text-sm leading-relaxed whitespace-pre-line">{pet.vaccinationSchedule}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Owner Contact Information</h3>

              <div className="bg-amber-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">{owner.username}</p>
                    <p className="text-sm text-amber-600">Pet Owner</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-600">Email</p>
                    <p className="font-medium text-amber-900">{owner.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-600">Phone</p>
                    <p className="font-medium text-amber-900">{owner.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Adopt</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Contact the owner directly using the information provided above.
                  Please be respectful and patient when reaching out about adopting {pet.name}.
                  All adoption arrangements are made between you and the pet owner.
                </p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-amber-600">
                <p><strong>Application Status:</strong> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  application.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'adopted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span></p>
                <p><strong>Posted:</strong> {formatDate(createdAt)}</p>
                {updatedAt !== createdAt && (
                  <p><strong>Last Updated:</strong> {formatDate(updatedAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
