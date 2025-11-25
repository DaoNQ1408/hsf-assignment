import { useEffect, useState } from 'react';
import { applicationService, type ApplicationResponse, type ApplicationStatus } from '../../services/applicationService';

export default function ApplicationManagementPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [authorIdFilter, setAuthorIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Sort states
  const [sortColumn, setSortColumn] = useState<'applicationId' | 'petName' | 'authorId' | 'authorEmail' | 'status' | 'createdAt' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getAllApplications();
        setApplications(data);
        setError(null);
      } catch (err: unknown) {
        setError('Failed to fetch applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: number, status: ApplicationStatus) => {
    try {
      const updatedApp = await applicationService.updateApplicationStatus(id, status);
      setApplications(applications.map(a => a.applicationId === id ? updatedApp : a));
    } catch (err: unknown) {
      console.error('Failed to update application:', err);
      alert('Failed to update application status.');
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(id);
        setApplications(applications.filter(a => a.applicationId !== id));
      } catch (err: unknown) {
        console.error('Failed to delete application:', err);
        alert('Failed to delete application.');
      }
    }
  };

  // Handle sorting
  const handleSort = (column: 'applicationId' | 'petName' | 'authorId' | 'authorEmail' | 'status' | 'createdAt') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter applications based on filter criteria
  const filteredApplications = applications.filter(app => {
    const matchAuthorId = authorIdFilter === '' || app.author.userId.toString().includes(authorIdFilter);
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchDate = dateFilter === '' || new Date(app.createdAt).toLocaleDateString().includes(dateFilter) ||
      app.createdAt.includes(dateFilter);
    return matchAuthorId && matchStatus && matchDate;
  });

  // Sort filtered applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number;
    let bValue: string | number;

    if (sortColumn === 'petName') {
      aValue = a.pet.petName.toLowerCase();
      bValue = b.pet.petName.toLowerCase();
    } else if (sortColumn === 'authorId') {
      aValue = a.author.userId;
      bValue = b.author.userId;
    } else if (sortColumn === 'authorEmail') {
      aValue = a.author.email.toLowerCase();
      bValue = b.author.email.toLowerCase();
    } else if (sortColumn === 'createdAt') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    } else {
      aValue = typeof a[sortColumn] === 'string' ? (a[sortColumn] as string).toLowerCase() : (a[sortColumn] as number);
      bValue = typeof b[sortColumn] === 'string' ? (b[sortColumn] as string).toLowerCase() : (b[sortColumn] as number);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <p className="text-center text-amber-800">Loading applications...</p>;
  if (error) return <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Manage Applications</h2>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-amber-50 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Author ID</label>
            <input
              type="text"
              value={authorIdFilter}
              onChange={e => setAuthorIdFilter(e.target.value)}
              placeholder="Search by author ID..."
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'ALL' | ApplicationStatus)}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ADOPTED">ADOPTED</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Created Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-amber-200">
          <thead className="bg-amber-100">
            <tr>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('applicationId')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortColumn === 'applicationId' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('petName')}
              >
                <div className="flex items-center gap-1">
                  Pet Name
                  {sortColumn === 'petName' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('authorId')}
              >
                <div className="flex items-center gap-1">
                  Author ID
                  {sortColumn === 'authorId' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('authorEmail')}
              >
                <div className="flex items-center gap-1">
                  Author Email
                  {sortColumn === 'authorEmail' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortColumn === 'status' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
                <th
                    className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                    onClick={() => handleSort('status')}
                >
                    <div className="flex items-center gap-1">
                        Receiver
                        {sortColumn === 'status' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                    </div>
                </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  Created At
                  {sortColumn === 'createdAt' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="py-2 px-4 border-b text-left text-amber-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedApplications.map(app => (
              <ApplicationRow
                key={app.applicationId}
                application={app}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteApplication}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ApplicationRowProps {
  application: ApplicationResponse;
  onUpdateStatus: (id: number, status: ApplicationStatus) => void;
  onDelete: (id: number) => void;
}

function ApplicationRow({ application, onUpdateStatus, onDelete }: ApplicationRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus>(application.status);

  const handleSave = () => {
    onUpdateStatus(application.applicationId, status);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStatus(application.status);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-amber-50">
      <td className="py-2 px-4 border-b">{application.applicationId}</td>
      <td className="py-2 px-4 border-b">{application.pet.petName}</td>
      <td className="py-2 px-4 border-b">{application.author.userId}</td>
      <td className="py-2 px-4 border-b">{application.author.email}</td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select
            value={status}
            onChange={e => setStatus(e.target.value as ApplicationStatus)}
            className="border rounded p-1"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="ADOPTED">ADOPTED</option>
            <option value="HIDDEN">HIDDEN</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded text-sm ${
            application.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
            application.status === 'ADOPTED' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {application.status}
          </span>
        )}
      </td>
        <td className="py-2 px-4 border-b">{application.receiver?.email}</td>
      <td className="py-2 px-4 border-b">{new Date(application.createdAt).toLocaleDateString()}</td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 hover:underline">Save</button>
            <button onClick={handleCancel} className="text-gray-600 hover:underline ml-2">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Edit</button>
        )}
        <button onClick={() => onDelete(application.applicationId)} className="text-red-600 hover:underline ml-4">Delete</button>
      </td>
    </tr>
  );
}
