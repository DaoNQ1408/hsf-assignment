import { useEffect, useState } from 'react';
import userService, { type AdminResponse, type AdminUpdateRequest } from '../../services/userService';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [usernameFilter, setUsernameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'LOCKED'>('ALL');

  // Sort states
  const [sortColumn, setSortColumn] = useState<'userId' | 'userName' | 'email' | 'phone' | 'role' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. You may not have the required permissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id: number, data: AdminUpdateRequest) => {
    try {
      const updatedUser = await userService.updateUser(id, data);
      setUsers(users.map(u => u.userId === id ? { ...u, ...updatedUser } : u));
    } catch (err: unknown) {
      console.error('Failed to update user:', err);
      alert('Failed to update user.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.userId !== id));
      } catch (err: unknown) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  // Handle sorting
  const handleSort = (column: 'userId' | 'userName' | 'email' | 'phone' | 'role' | 'status') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter users based on filter criteria
  const filteredUsers = users.filter(user => {
    const matchUsername = usernameFilter === '' || user.userName.toLowerCase().includes(usernameFilter.toLowerCase());
    const matchEmail = emailFilter === '' || user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchUsername && matchEmail && matchRole && matchStatus;
  });

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <p className="text-center text-amber-800">Loading users...</p>;
  if (error) return <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Manage Users</h2>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-amber-50 rounded-lg">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Username</label>
            <input
              type="text"
              value={usernameFilter}
              onChange={e => setUsernameFilter(e.target.value)}
              placeholder="Search username..."
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Email</label>
            <input
              type="text"
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
              placeholder="Search email..."
              className="w-full border border-amber-300 rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as 'ALL' | 'USER' | 'ADMIN')}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE' | 'LOCKED')}
              className="w-full border border-amber-300 rounded p-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="LOCKED">LOCKED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-amber-200">
          <thead className="bg-amber-100">
            <tr>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('userId')}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortColumn === 'userId' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('userName')}
              >
                <div className="flex items-center gap-1">
                  Username
                  {sortColumn === 'userName' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortColumn === 'email' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('phone')}
              >
                <div className="flex items-center gap-1">
                  Phone
                  {sortColumn === 'phone' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 border-b text-left text-amber-900 cursor-pointer hover:bg-amber-200"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-1">
                  Role
                  {sortColumn === 'role' && (
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
              <th className="py-2 px-4 border-b text-left text-amber-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <UserRow key={user.userId} user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface UserRowProps {
  user: AdminResponse;
  onUpdate: (id: number, data: AdminUpdateRequest) => void;
  onDelete: (id: number) => void;
}

function UserRow({ user, onUpdate, onDelete }: UserRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleSave = () => {
    onUpdate(user.userId, { phone, role, status });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPhone(user.phone);
    setRole(user.role);
    setStatus(user.status);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-amber-50">
      <td className="py-2 px-4 border-b">{user.userId}</td>
      <td className="py-2 px-4 border-b">{user.userName}</td>
      <td className="py-2 px-4 border-b">{user.email}</td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border rounded p-1 w-full"
            placeholder="Phone number"
          />
        ) : (
          user.phone
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select value={role} onChange={e => setRole(e.target.value as 'USER' | 'ADMIN')} className="border rounded p-1">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        ) : (
          user.role
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <select value={status} onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'LOCKED')} className="border rounded p-1">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="LOCKED">LOCKED</option>
          </select>
        ) : (
          user.status
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 hover:underline">Save</button>
            <button onClick={handleCancel} className="text-gray-600 hover:underline ml-2">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Edit</button>
        )}
        <button onClick={() => onDelete(user.userId)} className="text-red-600 hover:underline ml-4">Delete</button>
      </td>
    </tr>
  );
}
