import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-lg group"
    >
      {/* Efecto de hover */}
      <span className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="relative">{children}</span>
    </Link>
  );

  return (
    <nav className="w-full bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop & Mobile Header */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-200" />
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-12 w-auto relative"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/tienda">Tienda</NavLink>
            <NavLink to="/puntajes">Puntajes</NavLink>
          </div>

          {/* Desktop User Icon */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/perfil" 
              className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-200" />
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
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Tienda
            </Link>
            <Link
              to="/puntajes"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Puntajes
            </Link>
            <Link
              to="/perfil"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;