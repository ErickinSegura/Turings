import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Coins } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleStoreNavigation = () => {
    if (user?.role === 'student' && user?.groupId) {
      navigate(`/grupos/${user.groupId}/tienda`);
    } else {
      navigate('/tienda');
    }
  };

  const handleProfileNavigation = () => {
    if (user?.role === 'student') {
      navigate('/perfil-estudiante');
    } else if (user?.role === 'teacher') {
      navigate('/perfil');
    }
  };

  // Función para determinar enlaces según el rol del usuario
  const getNavLinks = () => {
    if (user?.role === 'student') {
      return [
        { label: 'Inicio', to: '/', onClick: () => navigate('/') },
        { label: 'Tienda', onClick: handleStoreNavigation },
        { label: 'Puntajes', onClick: () => {
            if (user.groupId) {
              navigate(`/grupos/${user.groupId}/leaderboard`);
            } else {
              navigate('/puntajes');
            }
          }},
      ];
    }
    if (user?.role === 'teacher') {
      return [
        { label: 'Inicio', to: '/', onClick: () => navigate('/') },
        { label: 'Grupos', to: '/grupos', onClick: () => navigate('/grupos') },
        { label: 'Alumnos', to: '/estudiantes', onClick: () => navigate('/estudiantes') },
      ];
    }
    return [];
  };

  const NavLink = ({ to, children, onClick }) => (
      <div
          onClick={onClick}
          className="relative text-gray-700 hover:text-gray-50 transition-colors duration-200 px-3 py-2 rounded-lg group cursor-pointer"
      >
        <span className="absolute inset-0 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <span className="relative">{children}</span>
      </div>
  );

  return (
      <nav className="w-full bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="relative">
                <div className="absolute -inset-1" />
                <img src="/images/logo.png" alt="Logo" className="h-12 w-auto relative" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2">
              {getNavLinks().map((link, index) => (
                  <NavLink key={index} to={link.to} onClick={link.onClick}>
                    {link.label}
                  </NavLink>
              ))}
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Turing Balance */}
              <div className="flex items-center bg-gray-800 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-gray-50 mr-2" />
                <span className="text-gray-50 font-semibold">{user?.turingBalance || 0} τ</span>
              </div>

              {/* User Icon */}
              <button
                  onClick={handleProfileNavigation}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-800 hover:text-gray-50 transition-colors duration-200"
              >
                <div className="relative">
                  <div className="absolute -inset-1" />
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 relative"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
              >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
              className={`md:hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {getNavLinks().map((link, index) => (
                  <div
                      key={index}
                      className="block px-3 py-2 rounded-lg text-gray-700"
                      onClick={() => {
                        link.onClick();
                        toggleMenu();
                      }}
                  >
                    {link.label}
                  </div>
              ))}
              {/* Profile Navigation for Mobile */}
              <div
                  className="block px-3 py-2 rounded-lg text-gray-700"
                  onClick={() => {
                    handleProfileNavigation();
                    toggleMenu();
                  }}
              >
                Perfil
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default NavBar;