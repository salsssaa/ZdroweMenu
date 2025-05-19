import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../auth/AuthService';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sprawdzenie, czy dana ścieżka jest aktywna
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo i nazwa aplikacji */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">ZdroweMenu</span>
            </Link>
          </div>

          {/* Linki nawigacyjne - widoczne na większych ekranach */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/produkty" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/produkty') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Produkty
            </Link>
            <Link 
              to="/jadlospis" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/jadlospis') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Jadłospis
            </Link>
            <Link 
              to="/profil" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profil') 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Mój profil
            </Link>
          </div>

          {/* Przycisk wylogowania i menu mobilne */}
          <div className="flex items-center">
            {user && (
              <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-600 mr-4">
                  Witaj, {user.imie || 'Użytkowniku'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                >
                  Wyloguj
                </button>
              </div>
            )}

            {/* Przycisk menu mobilnego */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobilne */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/produkty"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/produkty')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={toggleMenu}
            >
              Produkty
            </Link>
            <Link
              to="/jadlospis"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/jadlospis')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={toggleMenu}
            >
              Jadłospis
            </Link>
            <Link
              to="/profil"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/profil')
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={toggleMenu}
            >
              Mój profil
            </Link>
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
              >
                Wyloguj
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
