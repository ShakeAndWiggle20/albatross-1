import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <MapPin className="mr-2" />
          Albatross
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/upload" className="hover:text-blue-200">Upload Map</Link>
          {user ? (
            <>
              <Link to={`/profile/${user.username}`} className="hover:text-blue-200 flex items-center">
                <User className="mr-1" size={18} />
                {user.username}
              </Link>
              <button onClick={logout} className="hover:text-blue-200 flex items-center">
                <LogOut className="mr-1" size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Search maps..."
              className="bg-blue-500 text-white placeholder-blue-200 rounded-full py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;