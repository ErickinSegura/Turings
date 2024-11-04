import React from 'react';

const PuntajesPage = () => {
  // Datos de ejemplo - esto podría venir de una API o base de datos
  const topUsers = [
    { id: 1, username: "Username", turings: 10 },
    { id: 2, username: "Username", turings: 10 },
    { id: 3, username: "Username", turings: 10 },
    { id: 4, username: "Username", turings: 10 },
    { id: 5, username: "Username", turings: 10 },
  ];

  const totalTurings = 70;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Tarjeta de Top 5 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-black mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Turings</h2>
            <p className="text-gray-600 text-sm">Top 5 de Turing Holders</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {topUsers.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-around py-2"
            >
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 text-blue-500 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-800">{user.username}</span>
              </div>
              <span className="text-gray-600">{user.turings} Turings</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tarjeta de Total Turings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-black">
        <h1 className="text-3xl font-semibold mb-4">Resumen</h1>
        
        <h3 className="text-gray-600 mb-2">Cantidad de Turings en el grupo</h3>
        <p className="text-2xl font-semibold">{totalTurings} Turings</p>

        <h3 className="text-gray-600 mt-4 mb-2">Promedio de Turings en el grupo</h3>
        <p className="text-2xl font-semibold">{totalTurings / topUsers.length} Turings</p>

      </div>
    </div>
  );
};

export default PuntajesPage;