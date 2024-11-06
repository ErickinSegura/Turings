import React from 'react';

const PuntajesPage = () => {
  // Datos de ejemplo
  const topUsers = [
    { id: 1, username: "Username", turings: 10 },
    { id: 2, username: "Username", turings: 10 },
    { id: 3, username: "Username", turings: 10 },
    { id: 4, username: "Username", turings: 10 },
    { id: 5, username: "Username", turings: 10 },
  ];
  const totalTurings = 70;

  // Función para obtener el color de medalla según la posición
  const getMedalColor = (position) => {
    switch (position) {
      case 0: return 'from-yellow-300 to-yellow-500';
      case 1: return 'from-gray-300 to-gray-400';
      case 2: return 'from-amber-500 to-amber-700';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tabla de Clasificación
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Los mejores recolectores de Turings
        </p>

        {/* Tarjeta de Top 5 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Top 5 Turing Holders
              </h2>
              <p className="text-gray-600">Los estudiantes con más Turings acumulados</p>
            </div>
          </div>

          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div
                key={user.id}
                className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Posición y Usuario */}
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${getMedalColor(index)} text-white font-bold`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                    </div>
                    <span className="font-medium text-gray-900">{user.username}</span>
                  </div>
                </div>

                {/* Turings */}
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                    {user.turings} Turings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de Estadísticas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg 
                  className="w-6 h-6 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Total de Turings</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{totalTurings}</p>
            <p className="text-gray-600">Turings en circulación</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <svg 
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Promedio</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {(totalTurings / topUsers.length).toFixed(1)}
            </p>
            <p className="text-gray-600">Turings por estudiante</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuntajesPage;