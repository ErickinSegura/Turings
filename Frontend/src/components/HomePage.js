import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Activity, Award, Clock, Book, Terminal } from 'lucide-react';

const HomePage = () => {
  const stats = {
    turingBalance: 25,
    recentTransactions: [
      { type: 'earned', amount: 5, description: 'Participación en clase - Máquinas de Turing' },
      { type: 'spent', amount: 2, description: 'Extensión de entrega - Algoritmos' }
    ],
    availableBenefits: [
      { name: "Extensión de entrega (24h)", cost: 2 },
      { name: "Punto extra en tarea", cost: 5 },
      { name: "Revisión anticipada", cost: 3 }
    ]
  };

  const { user, logOut } = useAuth();


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
      <button onClick={logOut} className="bg-red-500 text-white px-4 py-2 rounded-lg">Cerrar Sesión</button>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hola, {user?.name || 'Estudiante'}
              </h1>
              <p className="text-gray-600">Gestiona tus Turings y beneficios académicos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tu balance actual</p>
              <p className="text-3xl font-bold text-blue-600">{stats.turingBalance} τ</p>
            </div>
          </div>
        </div>

        {/* Grid de acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/earn" className="group">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-200 hover:border-emerald-400 transition-all">
              <Activity className="w-8 h-8 text-emerald-500 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Ganar Turings</h2>
              <p className="text-gray-600 text-sm">Participa en clase y resuelve ejercicios</p>
            </div>
          </Link>

          <Link to="/spend" className="group">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200 hover:border-purple-400 transition-all">
              <Award className="w-8 h-8 text-purple-500 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Canjear Beneficios</h2>
              <p className="text-gray-600 text-sm">Usa tus Turings para obtener ventajas</p>
            </div>
          </Link>

          <Link to="/history" className="group">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200 hover:border-blue-400 transition-all">
              <Clock className="w-8 h-8 text-blue-500 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Historial</h2>
              <p className="text-gray-600 text-sm">Revisa tus transacciones pasadas</p>
            </div>
          </Link>
        </div>

        {/* Sección de actividad reciente y beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Terminal className="w-6 h-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-bold">Actividad Reciente</h2>
            </div>
            <div className="space-y-4">
              {stats.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-700">{transaction.description}</span>
                  <span className={`font-semibold ${
                    transaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} τ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Beneficios Disponibles */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Book className="w-6 h-6 text-gray-700 mr-2" />
              <h2 className="text-xl font-bold">Beneficios Disponibles</h2>
            </div>
            <div className="space-y-4">
              {stats.availableBenefits.map((benefit, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-700">{benefit.name}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                    {benefit.cost} τ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;{}