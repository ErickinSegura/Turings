import React from 'react';
import {
  Users,
  Trophy,
  PlusCircle,
  ArrowLeft,
  GraduationCap,
  Mail,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Default empty group structure
const defaultGroup = {
  id: '',
  groupNumber: '',
  schedule: '',
  classroom: '',
  students: []
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const GroupDetailView = ({ group = defaultGroup }) => {
  const navigate = useNavigate();

  // Safely calculate average Turing score with null checks
  const averageTuringScore = React.useMemo(() => {
    if (!group?.students?.length) return 0;
    const total = group.students.reduce((acc, student) => 
      acc + (typeof student?.turingScore === 'number' ? student.turingScore : 0), 0
    );
    return (total / group.students.length).toFixed(1);
  }, [group?.students]);

  // Early return if group is still undefined (shouldn't happen with default value)
  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600">No se encontraron datos del grupo</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Grupo {group.groupNumber || 'Sin número'}
            </h1>
            <p className="text-gray-500">
              {group.schedule || 'Horario no definido'} • Sala {group.classroom || 'Sin asignar'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold">Estudiantes</h3>
              </div>
              <div className="text-3xl font-bold">{group.students?.length || 0}</div>
              <p className="text-gray-500 text-sm">Total de estudiantes</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <Trophy className="w-6 h-6 text-yellow-700" />
                </div>
                <h3 className="text-lg font-semibold">Promedio Turing</h3>
              </div>
              <div className="text-3xl font-bold">{averageTuringScore}</div>
              <p className="text-gray-500 text-sm">Puntos promedio</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <button
                onClick={() => navigate(`/grupos/${group.id}/nueva-actividad`)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Nueva Actividad
              </button>
            </div>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Lista de Estudiantes</h2>
            <div className="divide-y">
              {group.students?.length > 0 ? (
                group.students.map((student) => (
                  <div
                    key={student?.id || Math.random()}
                    className="py-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <GraduationCap className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student?.name || 'Sin nombre'}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Hash className="w-4 h-4 mr-1" />
                            {student?.id || 'N/A'}
                          </span>
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {student?.email || 'Sin correo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                        <Trophy className="w-4 h-4 mr-2" />
                        {student?.turingScore || 0} pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No hay estudiantes registrados en este grupo
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupDetailView;