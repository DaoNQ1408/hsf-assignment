import { useState, useEffect } from 'react';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import { useApplicationStore } from '../stores/applicationStore';
import { useAuthStore } from '../stores/authStore';
import type { AdoptionApplication } from '../types';

export default function HomePage() {
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getActiveApplications, fetchApplications } = useApplicationStore();
  const { user } = useAuthStore();

  // Filter out the current user's own applications
  const applications = getActiveApplications(user?.userId);

  // Fetch applications from backend when component mounts
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleViewDetails = (application: AdoptionApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Browse through adorable pets looking for their forever homes.
            Connect directly with pet owners to arrange adoptions.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">
              No pets available for adoption right now
            </h2>
            <p className="text-amber-700 mb-6">
              Check back later or sign up to be the first to know when new pets are available!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-amber-900">
                Available Pets ({applications.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={() => handleViewDetails(application)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              How Pet Adoption Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">1</span>
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">Browse Available Pets</h3>
                <p className="text-amber-700 text-sm">
                  Explore our collection of pets looking for loving homes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">2</span>
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">Contact the Owner</h3>
                <p className="text-amber-700 text-sm">
                  Reach out directly to pet owners using their contact information
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-amber-600">3</span>
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">Arrange Adoption</h3>
                <p className="text-amber-700 text-sm">
                  Meet the pet and finalize the adoption arrangements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
