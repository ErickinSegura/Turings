import React from 'react';
import { useAuth } from '../../context/authContext';
import { 
  User, 
  Mail, 
  Book, 
  Calendar,
  School,
  Award,
  ArrowLeft,
  TrendingUp,
  Star,
  Clock,
  ChartBar,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500">
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-3 bg-gray-50 rounded-xl">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

const SubjectCard = ({ subject, turings, total }) => (
  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <span className="font-medium text-gray-900">{subject}</span>
      <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium group-hover:bg-blue-100 transition-all duration-500">
        {turings} Turings
      </span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div 
        className="bg-blue-600 rounded-full h-2 transition-all duration-500"
        style={{ width: `${(turings / total) * 100}%` }}
      />
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, logOut } = useAuth();

  const studentInfo = {
    name: user?.name || 'Estudiante',
    email: user?.email || 'estudiante@universidad.edu',
    carrera: 'Ingeniería en Computación',
    semestre: '6to Semestre',
    turingsTotal: 245,
    turingsGastados: 180,
    turingsDisponibles: 65,
    materias: [
      { nombre: 'Algoritmos y Estructuras de Datos', turingsGanados: 85 },
      { nombre: 'Máquinas de Turing', turingsGanados: 95 },
      { nombre: 'Bases de Datos', turingsGanados: 65 }
    ],
    historialMensual: [
      { mes: 'Enero', ganados: 45, gastados: 30 },
      { mes: 'Febrero', ganados: 55, gastados: 40 },
      { mes: 'Marzo', ganados: 65, gastados: 50 },
      { mes: 'Abril', ganados: 80, gastados: 60 }
    ],
    tipoActividades: [
      { tipo: 'Participación en clase', cantidad: 25 },
      { tipo: 'Ejercicios resueltos', cantidad: 18 },
      { tipo: 'Proyectos entregados', cantidad: 8 },
      { tipo: 'Tutorías impartidas', cantidad: 4 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Mi Perfil
            </h1>
            <p className="text-gray-500 text-lg">
              Gestiona tu información y revisa tus estadísticas
            </p>
          </div>
          <button
            onClick={logOut}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
          >
      
            Cerrar Sesión
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-black shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <User className="w-16 h-16 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {studentInfo.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  {studentInfo.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <School className="w-5 h-5 mr-3" />
                  {studentInfo.carrera}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  {studentInfo.semestre}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon={Star}
            title="Turings Totales"
            value={studentInfo.turingsTotal}
            description="Turings ganados hasta la fecha"
          />
          <StatsCard
            icon={Target}
            title="Disponibles"
            value={studentInfo.turingsDisponibles}
            description="Turings para utilizar"
          />
          <StatsCard
            icon={ChartBar}
            title="Utilizados"
            value={studentInfo.turingsGastados}
            description="Turings gastados en total"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Monthly History Chart */}
          <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gray-50 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Historial Mensual</h2>
                <p className="text-gray-500 text-sm mt-1">Evolución de tus Turings en el tiempo</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentInfo.historialMensual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="mes" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="ganados" stroke="#2563EB" strokeWidth={2} name="Ganados" />
                  <Line type="monotone" dataKey="gastados" stroke="#9333EA" strokeWidth={2} name="Gastados" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gray-50 rounded-xl mr-4">
                <Book className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Materias</h2>
                <p className="text-gray-500 text-sm mt-1">Distribución de Turings por materia</p>
              </div>
            </div>
            <div className="space-y-4">
              {studentInfo.materias.map((materia, index) => (
                <SubjectCard
                  key={index}
                  subject={materia.nombre}
                  turings={materia.turingsGanados}
                  total={studentInfo.turingsTotal}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gray-50 rounded-xl mr-4">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Actividades</h2>
              <p className="text-gray-500 text-sm mt-1">Desglose de tus actividades realizadas</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentInfo.tipoActividades.map((actividad, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5 border border-gray-100">
                <div className="text-center">
                  <span className="text-3xl font-semibold text-gray-900 block mb-2">
                    {actividad.cantidad}
                  </span>
                  <p className="text-gray-500">{actividad.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;