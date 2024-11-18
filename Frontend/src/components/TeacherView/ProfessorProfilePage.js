import {
  GraduationCap,
  Mail,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';

const TeacherProfilePage = () => {
  const { user, logOut } = useAuth();
  const [loading] = useState(true);


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
              Gestiona tus grupos y materias
            </p>
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
            <div className="p-4 bg-gray-800 rounded-2xl">
              <GraduationCap className="w-16 h-16 text-gray-50" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {user?.name || 'Profesor'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;