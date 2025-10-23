import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-amber-900">PetAdopt</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition ${
                isActive('/') ? 'text-amber-600' : 'text-amber-700 hover:text-amber-600'
              }`}
            >
              Homepage
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/pets"
                  className={`text-sm font-medium transition ${
                    isActive('/pets') ? 'text-amber-600' : 'text-amber-700 hover:text-amber-600'
                  }`}
                >
                  My Pets
                </Link>
                <Link
                  to="/applications"
                  className={`text-sm font-medium transition ${
                    isActive('/applications') ? 'text-amber-600' : 'text-amber-700 hover:text-amber-600'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition ${
                    isActive('/profile') ? 'text-amber-600' : 'text-amber-700 hover:text-amber-600'
                  }`}
                >
                  My Profile
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-amber-700">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-amber-700 hover:text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
