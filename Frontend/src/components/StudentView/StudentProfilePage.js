import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { User, Mail, School, Calendar, Star, Target, ChartBar, TrendingUp, Book } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Stats Card Component
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

const ProfilePage = () => {
  const { user, logOut } = useAuth();
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setStudentInfo(userDoc.data());
          } else {
            console.error('No se encontró el documento del usuario.');
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      }
      setLoading(false);
    };

    fetchStudentInfo();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Cargando perfil...</div>;
  }

  if (!studentInfo) {
    return (
        <div className="text-center py-20 text-red-500">
          Error al cargar los datos del perfil. Intenta recargar la página.
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Mi Perfil</h1>
              <p className="text-gray-500 text-lg">Gestiona tu información y revisa tus estadísticas</p>
            </div>
            <button
                onClick={logOut}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{studentInfo.name || 'Estudiante'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    {studentInfo.email || 'Sin correo'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
                icon={Star}
                title="Turings Totales"
                value={studentInfo.turingTotal || 0}
                description="Turings ganados hasta la fecha"
            />
            <StatsCard
                icon={Target}
                title="Disponibles"
                value={studentInfo.turingBalance || 0}
                description="Turings para utilizar"
            />
            <StatsCard
                icon={ChartBar}
                title="Gastados"
                value={studentInfo.turingsGastados || 0}
                description="Turings gastados en total"
            />
          </div>
        </div>
        </div>
    );
};

export default ProfilePage;
