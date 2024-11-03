import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const stats = {
    totalTurings: 70,
    topProducts: [
      { name: "Espada Maestra", price: 100 },
      { name: "Corazón", price: 20 },
      { name: "Escudo Hyliano", price: 15 }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a Tuning</h1>
        <p className="text-gray-600 text-lg mb-8">
          Tu plataforma de recompensas y beneficios académicos
        </p>
        <Link 
          to="/tienda" 
          className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Explorar Tienda
          <svg 
            className="ml-2 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-blue-500 mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Gana Turings</h2>
          <p className="text-gray-600">
            Acumula Turings por tu participación y buen desempeño académico.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-blue-500 mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Compra Beneficios</h2>
          <p className="text-gray-600">
            Usa tus Turings para obtener extensiones de tiempo y beneficios especiales.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-blue-500 mb-4">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Sigue tu Progreso</h2>
          <p className="text-gray-600">
            Monitorea tu posición en el ranking y tus Turings acumulados.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Turings en Circulación</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">{stats.totalTurings}</span>
            <span className="text-gray-600 mb-1">Turings</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Productos Destacados</h3>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{product.name}</span>
                <span className="font-medium">{product.price} Turings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;