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
  const [applicationContent, setApplicationContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'AVAILABLE' | 'ADOPTED' | 'HIDDEN'>('all');
  const [viewingApplication, setViewingApplication] = useState<AdoptionApplication | null>(null);

  const { user, isAuthenticated } = useAuthStore();
  const { fetchMyApplications, getApplicationsByOwnerId, addApplication, updateApplication, deleteApplication, hideApplication, adoptApplication } = useApplicationStore();
  const { getPetsByOwnerId, fetchMyPets } = usePetStore();
  const navigate = useNavigate();

  const userPets = user ? getPetsByOwnerId(user.id) : [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch applications created by this user from backend
    fetchMyApplications();
    // Fetch user's pets from backend
    fetchMyPets();
  }, [isAuthenticated, navigate, fetchMyApplications, fetchMyPets]);

  // Update local state when store changes
  useEffect(() => {
    if (user) {
      const userApplications = getApplicationsByOwnerId(user.id);
      setApplications(userApplications);
    }
  }, [user, getApplicationsByOwnerId]);

  const handleCreateApplication = async () => {
    if (!user || !selectedPetId || !applicationContent.trim()) return;

    // Backend ApplicationRequest only expects petId and applicationContent
    const success = await addApplication({
      petId: parseInt(selectedPetId),
      applicationContent: applicationContent.trim(),
    });

    if (success) {
      setIsCreateModalOpen(false);
      setSelectedPetId('');
      setApplicationContent('');
      setApplications(getApplicationsByOwnerId(user.id));
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'AVAILABLE' | 'ADOPTED' | 'HIDDEN') => {
    let success = false;

    if (newStatus === 'HIDDEN') {
      // Use hideApplication API for HIDDEN status
      success = await hideApplication(parseInt(applicationId));
    } else if (newStatus === 'ADOPTED') {
      // For ADOPTED status, we might need receiverId - using current user for now
      if (user) {
        success = await adoptApplication(parseInt(applicationId), user.userId || parseInt(user.id));
      }
    } else if (newStatus === 'AVAILABLE') {
      // For AVAILABLE status, need to provide full ApplicationRequest
      // Find the application to get petId and content
      const application = applications.find(app =>
        app.id === applicationId ||
        app.applicationId?.toString() === applicationId ||
        app.id === applicationId.toString() ||
        app.applicationId === parseInt(applicationId)
      );

      if (application) {
        // Get petId with multiple fallbacks
        const petId = application.pet?.petId ||
                     application.petId ||
                     (application.pet?.id ? parseInt(application.pet.id) : null);
        const content = application.applicationContent || '';

        if (petId) {
          success = await updateApplication(applicationId, {
            petId: petId,
            applicationContent: content
          });
        } else {
          console.error('Cannot find petId for application:', application);
          alert('Error: Cannot update application - missing pet information');
        }
      } else {
        console.error('Application not found:', applicationId, 'in', applications);
        alert('Error: Application not found');
      }
    }

    if (success && user) {
      await fetchMyApplications(); // Refresh from backend
      setApplications(getApplicationsByOwnerId(user.id));
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      const success = await deleteApplication(applicationId);
      
      if (success && user) {
        await fetchMyApplications(); // Refresh from backend
        setApplications(getApplicationsByOwnerId(user.id));
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status?.toUpperCase() === filter;
  });

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'ADOPTED':
        return 'bg-blue-100 text-blue-800';
      case 'HIDDEN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
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
    !applications.some(app => {
      const petId = app.pet?.petId || app.pet?.id || app.petId;
      const status = typeof app.status === 'string' ? app.status.toUpperCase() : app.status;
      return petId === pet.id && status === 'AVAILABLE';
    })
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
              onClick={() => setFilter('AVAILABLE')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'AVAILABLE' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Available ({applications.filter(app => app.status?.toUpperCase() === 'AVAILABLE').length})
            </button>
            <button
              onClick={() => setFilter('ADOPTED')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'ADOPTED' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Adopted ({applications.filter(app => app.status?.toUpperCase() === 'ADOPTED').length})
            </button>
            <button
              onClick={() => setFilter('HIDDEN')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'HIDDEN' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Hidden ({applications.filter(app => app.status?.toUpperCase() === 'HIDDEN').length})
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
                    {application.pet.images && application.pet.images.length > 0 ? (
                      <img
                        src={application.pet.images[0]}
                        alt={application.pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : application.pet.imageUrls && application.pet.imageUrls.length > 0 ? (
                      <img
                        src={application.pet.imageUrls[0]}
                        alt={application.pet.petName || application.pet.name}
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
                        <h3 className="text-xl font-semibold text-amber-900">{application.pet.petName || application.pet.name}</h3>
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

                    {application.applicationContent && (
                      <div className="mb-4">
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-amber-900">Application Content:</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-amber-600">{application.applicationContent.length} characters</span>
                              <button
                                onClick={() => setViewingApplication(application)}
                                className="text-xs text-amber-700 hover:text-amber-900 font-medium underline"
                              >
                                View Full Content
                              </button>
                            </div>
                          </div>
                          <div className="max-h-32 overflow-y-auto">
                            <p className="text-sm text-amber-700 whitespace-pre-wrap leading-relaxed">
                              {application.applicationContent}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-amber-600">
                        Posted on {formatDate(application.createdAt)}
                        {application.updatedAt !== application.createdAt && (
                          <span> • Updated {formatDate(application.updatedAt)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {application.status?.toUpperCase() === 'AVAILABLE' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'ADOPTED')}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                            >
                              Mark as Adopted
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'HIDDEN')}
                              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                            >
                              Hide
                            </button>
                          </>
                        )}
                        
                        {application.status?.toUpperCase() === 'ADOPTED' && (
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'AVAILABLE')}
                            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition"
                          >
                            Make Available Again
                          </button>
                        )}

                        {application.status?.toUpperCase() === 'HIDDEN' && (
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'AVAILABLE')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                          >
                            Make Available
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
                  <div className="mb-4">
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
                          {pet.petName || pet.name} ({pet.species}, {pet.age} years old)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Application Content *
                    </label>
                    <textarea
                      value={applicationContent}
                      onChange={(e) => setApplicationContent(e.target.value)}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-y"
                      rows={8}
                      placeholder="Tell us why you want to adopt this pet, your experience with pets, living situation, and how you plan to care for them...

Please include:
- Your motivation for adoption
- Experience with pets
- Living environment
- Daily schedule and availability
- Financial readiness
- Long-term commitment plans"
                      required
                    />
                    <p className="text-xs text-amber-600 mt-1">
                      {applicationContent.length} characters • Please provide detailed information to help us find the best home for the pet.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={!selectedPetId || !applicationContent.trim()}
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

        {/* View Application Content Modal */}
        {viewingApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">Application Details</h2>
                  <p className="text-sm text-amber-700 mt-1">
                    {viewingApplication.pet.petName || viewingApplication.pet.name} • {viewingApplication.pet.species}
                  </p>
                </div>
                <button
                  onClick={() => setViewingApplication(null)}
                  className="text-amber-600 hover:text-amber-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {/* Pet Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Pet Information</h3>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-amber-600">Name</p>
                        <p className="font-semibold text-amber-900">{viewingApplication.pet.petName || viewingApplication.pet.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600">Species</p>
                        <p className="font-semibold text-amber-900 capitalize">{viewingApplication.pet.species}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600">Age</p>
                        <p className="font-semibold text-amber-900">{viewingApplication.pet.age} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-600">Sex</p>
                        <p className="font-semibold text-amber-900 uppercase">{viewingApplication.pet.sex}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Application Status</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingApplication.status)}`}>
                      {viewingApplication.status.charAt(0).toUpperCase() + viewingApplication.status.slice(1)}
                    </span>
                    <span className="text-sm text-amber-600">
                      Posted on {formatDate(viewingApplication.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Application Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-amber-900">Application Content</h3>
                    <span className="text-sm text-amber-600">{viewingApplication.applicationContent?.length || 0} characters</span>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-200 max-h-96 overflow-y-auto">
                    <p className="text-amber-700 whitespace-pre-wrap leading-relaxed">
                      {viewingApplication.applicationContent || 'No content provided.'}
                    </p>
                  </div>
                </div>

                {/* Pet Description */}
                {viewingApplication.pet.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-3">Pet Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {viewingApplication.pet.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-amber-200 p-6">
                <div className="flex gap-4">
                  {viewingApplication.status?.toUpperCase() === 'AVAILABLE' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(viewingApplication.id, 'ADOPTED');
                          setViewingApplication(null);
                        }}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Mark as Adopted
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(viewingApplication.id, 'HIDDEN');
                          setViewingApplication(null);
                        }}
                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition"
                      >
                        Hide
                      </button>
                    </>
                  )}

                  {(viewingApplication.status?.toUpperCase() === 'ADOPTED' || viewingApplication.status?.toUpperCase() === 'HIDDEN') && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(viewingApplication.id, 'AVAILABLE');
                        setViewingApplication(null);
                      }}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Make Available
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleDeleteApplication(viewingApplication.id);
                      setViewingApplication(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete Application
                  </button>

                  <button
                    onClick={() => setViewingApplication(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}