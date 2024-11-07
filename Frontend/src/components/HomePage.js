import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Clock, Terminal, PlusCircle, ChevronRight } from 'lucide-react';

const ActionCard = ({ icon: Icon, title, description }) => (
  <div className="group bg-white rounded-3xl overflow-hidden border border-black hover:border-black shadow-sm hover:shadow-xl transition-all duration-500 p-8">
    <div className="flex items-start">
      <div className="flex-shrink-0 p-3 bg-gray-800 rounded-2xl group-hover:bg-gray-100 transition-all duration-500">
        <Icon className="w-8 h-8 text-gray-50 group-hover:text-gray-900 transition-all duration-500" />
      </div>
      <div className="ml-6 flex-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
          {title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform translate-x-0 group-hover:translate-x-1 transition-all duration-500" />
    </div>
  </div>
);

const ActivityItem = ({ description, type, timestamp, amount }) => (
  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${
            type === 'spent' ? 'bg-red-400' : 'bg-green-400'
          }`} />
          <p className="text-gray-800 font-medium">
            {description}
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-1 ml-5">
          {timestamp}
        </p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ${
        type === 'spent' 
          ? 'bg-red-50 text-red-600 group-hover:bg-red-100' 
          : 'bg-green-50 text-green-600 group-hover:bg-green-100'
      }`}>
        {type === 'spent' ? '- '+ amount + ' τ'  : '+ '+ amount + ' τ'}
      </span>
    </div>
  </div>
);

const StatsCard = ({ title, value }) => (
  <div className="bg-white rounded-3xl border border-black p-6">
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>

  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const recentActivities = [
    { 
      type: 'earned', 
      description: 'Participación en clase - Máquinas de Turing',
      timestamp: 'Hace 2 horas',
      amount: 10
    },
    { 
      type: 'spent', 
      description: 'Extensión de entrega - Algoritmos',
      timestamp: 'Hace 1 día',
      amount: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Bienvenido, {user?.name || 'Estudiante'}
            </h1>
            <p className="text-gray-500 text-lg">
              Tu lugar seguro, disruptivo y de alto impacto.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatsCard title="Actividades Completadas" value="24" trend={12} />
          <StatsCard title="Turings Disponibles" value="145" trend={-5} />
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link to="/register-activity" className="block">
            <ActionCard
              icon={PlusCircle}
              title="Registrar Nueva Actividad"
              description="Documenta tus participaciones para ganar Turings"
            />
          </Link>
          <Link to="/history" className="block">
            <ActionCard
              icon={Clock}
              title="Consultar Historial"
              description="Revisa el registro completo de tus transacciones anteriores"
            />
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                <Terminal className="w-6 h-6 text-gray-50" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
                <p className="text-gray-500 text-sm mt-1">Últimas actualizaciones en tus transacciones</p>
              </div>
            </div>
          </div>  
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                description={activity.description}
                type={activity.type}
                timestamp={activity.timestamp}
                amount={activity.amount}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;