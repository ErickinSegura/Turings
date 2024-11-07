import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Target, Users, ArrowLeft } from 'lucide-react';

const GroupDetailPage = ({ courses }) => {
  const { courseId, groupId } = useParams();
  
  // Buscar el curso y el grupo usando courseId y groupId
  const course = courses.find(c => c.name === courseId);
  const group = course?.groups.find(g => g.groupNumber === groupId);

  if (!course || !group) {
    return <p>Grupo no encontrado.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-black shadow-sm p-8 mb-12">
        <div className="flex items-center mb-6">
          <Link to="/perfil" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Grupo {group.groupNumber} - {course.name}
        </h1>

        <div className="flex items-center text-gray-600 text-lg mb-6">
          <Calendar className="w-5 h-5 mr-3" />
          <span>{group.schedule}</span>
        </div>

        <div className="flex items-center text-gray-600 text-lg mb-6">
          <Target className="w-5 h-5 mr-3" />
          <span>Sala: {group.classroom}</span>
        </div>

        <div className="flex items-center text-gray-600 text-lg mb-6">
          <Users className="w-5 h-5 mr-3" />
          <span>{group.students} estudiantes</span>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Progreso del grupo</h2>
          <p className={`text-lg font-semibold ${
            group.progress >= 75 ? 'text-green-700' :
            group.progress >= 50 ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {group.progress}% completado
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className={`h-2.5 rounded-full ${
                group.progress >= 75 ? 'bg-green-600' :
                group.progress >= 50 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${group.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
