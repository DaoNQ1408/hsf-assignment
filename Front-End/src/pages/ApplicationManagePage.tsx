import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useApplicationStore } from '../stores/applicationStore';
import { usePetStore } from '../stores/petStore';
import type { AdoptionApplication } from '../types';

export default function ApplicationManagePage() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'adopted' | 'withdrawn'>('all');
  
  const { user, isAuthenticated } = useAuthStore();
  const { getApplicationsByOwnerId, addApplication, updateApplication, deleteApplication } = useApplicationStore();
  const { getPetsByOwnerId } = usePetStore();
  const navigate = useNavigate();

  const userPets = user ? getPetsByOwnerId(user.id) : [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      const userApplications = getApplicationsByOwnerId(user.id);
      setApplications(userApplications);
    }
  }, [isAuthenticated, user, getApplicationsByOwnerId, navigate]);

  const handleCreateApplication = async () => {
    if (!user || !selectedPetId) return;

    const success = await addApplication({
      petId: selectedPetId,
      ownerId: user.id,
      status: 'active',
    });

    if (success) {
      setIsCreateModalOpen(false);
      setSelectedPetId('');
      setApplications(getApplicationsByOwnerId(user.id));
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'active' | 'adopted' | 'withdrawn') => {
    const success = await updateApplication(applicationId, { status: newStatus });
    
    if (success && user) {
      setApplications(getApplicationsByOwnerId(user.id));
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      const success = await deleteApplication(applicationId);
      
      if (success && user) {
        setApplications(getApplicationsByOwnerId(user.id));
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'adopted':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const availablePetsForApplication = userPets.filter(pet => 
    !applications.some(app => app.petId === pet.id && app.status === 'active')
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">My Applications</h1>
            <p className="text-amber-700 mt-1">Manage your pet adoption applications</p>
          </div>
          {availablePetsForApplication.length > 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Application
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'active' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Active ({applications.filter(app => app.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('adopted')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'adopted' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Adopted ({applications.filter(app => app.status === 'adopted').length})
            </button>
            <button
              onClick={() => setFilter('withdrawn')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'withdrawn' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Withdrawn ({applications.filter(app => app.status === 'withdrawn').length})
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">No applications yet</h2>
            <p className="text-amber-700 mb-6">
              {userPets.length === 0 
                ? 'Add some pets first to create adoption applications'
                : 'Create your first adoption application to find a loving home for your pet'
              }
            </p>
            {userPets.length === 0 ? (
              <button
                onClick={() => navigate('/pets')}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Add Your First Pet
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Create Application
              </button>
            )}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">No {filter} applications</h2>
            <p className="text-amber-700">Try selecting a different filter to see more applications</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                    {application.pet.images.length > 0 ? (
                      <img
                        src={application.pet.images[0]}
                        alt={application.pet.name}
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
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-amber-900">{application.pet.name}</h3>
                        <p className="text-amber-700 capitalize">
                          {application.pet.species} • {application.pet.age} years old • {application.pet.sex}
                        </p>
                        {application.pet.breed && (
                          <p className="text-sm text-amber-600">{application.pet.breed}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>

                    {application.pet.description && (
                      <p className="text-amber-700 line-clamp-2 mb-4">{application.pet.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-amber-600">
                        Posted on {formatDate(application.createdAt)}
                        {application.updatedAt !== application.createdAt && (
                          <span> • Updated {formatDate(application.updatedAt)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {application.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'adopted')}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                            >
                              Mark as Adopted
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'withdrawn')}
                              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                            >
                              Withdraw
                            </button>
                          </>
                        )}
                        
                        {application.status === 'adopted' && (
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'active')}
                            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition"
                          >
                            Reactivate
                          </button>
                        )}

                        {application.status === 'withdrawn' && (
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'active')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                          >
                            Reactivate
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteApplication(application.id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Application Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Create Adoption Application</h2>
              
              {availablePetsForApplication.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-amber-700 mb-4">
                    You don't have any pets available for new applications. 
                    All your pets already have active applications.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleCreateApplication(); }}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Select Pet *
                    </label>
                    <select
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Choose a pet...</option>
                      {availablePetsForApplication.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species}, {pet.age} years old)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={!selectedPetId}
                      className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}