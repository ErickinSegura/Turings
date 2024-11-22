import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useGroupDetails } from '../../hooks/UseGroupDetails';
import {
  Users,
  Trophy,
  PlusCircle,
  GraduationCap,
  Mail,
  Hash,
  Coins,
  Terminal,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from "../../context/authContext";

const StatsCard = ({ icon: Icon, title, value, subtitle }) => (
    <div className="bg-white rounded-3xl border border-black p-4 sm:p-6">
      <div className="flex items-center">
        <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl mr-3 sm:mr-4 shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-500 text-xs sm:text-sm truncate">{title}</p>
          <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{value}</h3>
          {subtitle && <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
);

const StudentCard = ({ student }) => (
    <div className="group bg-white rounded-2xl overflow-hidden p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{student?.name || 'Sin nombre'}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center">
              <Hash className="w-4 h-4 mr-1 shrink-0" />
              <span className="truncate">{student?.matricula || 'N/A'}</span>
            </span>
              <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1 shrink-0" />
              <span className="truncate">{student?.email || 'Sin correo'}</span>
            </span>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto">
        <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-800 text-gray-50 text-sm group-hover:bg-gray-700 transition-colors">
          <Coins className="w-4 h-4 mr-2 shrink-0" />
          {student?.turingBalance || 0} τ
        </span>
        </div>
      </div>
    </div>
);

const ActivityCard = ({ activity }) => (
    <Link
        to={`/actividades/${activity.id}`}
        className="block group bg-white rounded-2xl border-black border overflow-hidden hover:shadow-md transition-all duration-500 p-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl shrink-0">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center">
              <Coins className="w-4 h-4 mr-1 shrink-0" />
              {activity.turingBalance} τ
            </span>
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
      </div>
    </Link>
);

const GroupDetailView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { group, loading, error, deactivateGroup } = useGroupDetails(groupId);
  const { user } = useAuth();

  const isTeacher = user?.role === 'teacher' || user?.isTeacher;

  const handleDeactivateGroup = async () => {
    if (window.confirm('¿Estás seguro de que deseas desactivar este grupo? Esta acción eliminará la asignación de grupo de todos los estudiantes y pondrá su balance de Turings en 0.')) {
      await deactivateGroup();
      navigate('/grupos');
    }
  };

  const totalTuringBalance = React.useMemo(() => {
    if (!group?.students?.length) return 0;
    return group.students.reduce((acc, student) =>
        acc + (typeof student?.turingBalance === 'number' ? student.turingBalance : 0), 0
    );
  }, [group?.students]);

  const averageTuringBalance = React.useMemo(() => {
    if (!group?.students?.length) return 0;
    return totalTuringBalance / group.students.length;
  }, [totalTuringBalance, group?.students]);

  const groupNumber = group?.name?.split('-')[1] || 'Sin número';

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-gray-600">Cargando datos del grupo...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-red-600">Error: {error}</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header */}
          <div className="flex items-center mb-6 sm:mb-12">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Grupo {groupNumber}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                {group?.schedule || 'Horario no definido'} • Sala {group?.classroom || 'Sin asignar'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-12">
            <StatsCard
                icon={Users}
                title="Total de Estudiantes"
                value={group?.students?.length || 0}
            />
            <StatsCard
                icon={Coins}
                title="Total Turings"
                value={`${totalTuringBalance} τ`}
                subtitle="Balance del grupo"
            />
            <StatsCard
                icon={Coins}
                title="Promedio Turings"
                value={`${averageTuringBalance.toFixed(2)} τ`}
                subtitle="Balance promedio"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-12">
            <button
                onClick={() => navigate(`/grupos/${group.id}/editar`)}
                className="flex-1 bg-white text-gray-800 border border-black px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              <span className="hidden sm:inline">Editar Grupo</span>
            </button>
            <button
                onClick={() => navigate(`/grupos/${group.id}/nueva-actividad`)}
                className="flex-1 bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nueva Actividad</span>
            </button>
            <button
                onClick={() => navigate(`/grupos/${group.id}/tienda?role=${isTeacher ? 'teacher' : 'student'}`)}
                className="flex-1 bg-white text-gray-800 border border-black px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Tienda del Grupo</span>
            </button>

            {isTeacher && !group?.isActive && (
                <button
                    onClick={handleDeactivateGroup}
                    className="flex-1 bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:bg-red-700 hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="hidden sm:inline">Desactivar Grupo</span>
                </button>
            )}
          </div>

          {/* Students List */}
          <div className="bg-white rounded-3xl border border-black p-4 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-8">
              <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl mr-3 sm:mr-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Lista de Estudiantes</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Estudiantes registrados en el grupo</p>
              </div>
            </div>

            <div className="space-y-4">
              {group?.students?.length > 0 ? (
                  group.students.map((student) => (
                      <StudentCard key={student?.id || Math.random()} student={student} />
                  ))
              ) : (
                  <div className="py-8 text-center text-gray-500 text-sm sm:text-base">
                    No hay estudiantes registrados en este grupo
                  </div>
              )}
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-3xl border border-black p-4 sm:p-8 mt-6 sm:mt-8">
            <div className="flex items-center mb-4 sm:mb-8">
              <div className="p-2 sm:p-3 bg-gray-800 rounded-2xl mr-3 sm:mr-4">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Actividades del Grupo</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Actividades asignadas a este grupo</p>
              </div>
            </div>

            <div className="space-y-4">
              {group?.activities?.length > 0 ? (
                  group.activities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                  ))
              ) : (
                  <div className="py-8 text-center text-gray-500 text-sm sm:text-base">
                    No hay actividades asignadas a este grupo
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default GroupDetailView;