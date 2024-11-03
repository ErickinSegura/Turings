import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <img src="/images/logo.png" alt="Logo"/>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Inicio
            </Link>
            <Link to="/tienda" className="text-gray-700 hover:text-gray-900">
              Tienda
            </Link>
            <Link to="/puntajes" className="text-gray-700 hover:text-gray-900">
              Puntajes
            </Link>
          </div>

          {/* User Icon */}
          <div className="flex items-center">
            <Link to="/perfil" className="text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;