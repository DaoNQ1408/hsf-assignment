import { Outlet, NavLink } from 'react-router-dom';

const adminNavLinks = [
  { name: 'Users', path: '/admin/users' },
  { name: 'Pets', path: '/admin/pets' },
  { name: 'Applications', path: '/admin/applications' },
];

export default function AdminLayout() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
      isActive
        ? 'bg-amber-600 text-white'
        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    }`;

  return (
    <div className="min-h-screen bg-amber-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Admin Dashboard</h1>

        <div className="flex border-b border-amber-300 mb-6">
          {adminNavLinks.map(link => (
            <NavLink key={link.path} to={link.path} className={getLinkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

