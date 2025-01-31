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
  Clock,
  Coins,
  Terminal,
  ShoppingBag,
  ArrowRight,
  MapPin
} from 'lucide-react';

const ScheduleDisplay = ({ schedule, classroom }) => {
  const scheduleByDay = schedule.reduce((acc, slot) => {
    const [day, time] = slot.split(" ");
    if (!acc[day]) acc[day] = [];
    acc[day].push(time);
    return acc;
  }, {});

  const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const sortedDays = Object.keys(scheduleByDay).sort((a, b) =>
      daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <StatsCard
              icon={Clock}
              title="Horario"
              value={
                <div className="space-y-2 w-full">
                  {sortedDays.map((day) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 truncate">{day}</span>
                        <div className="flex space-x-1">
                          {scheduleByDay[day].sort().map((time) => (
                              <span
                                  key={`${day}-${time}`}
                                  className="bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800 text-xs px-2 py-0.5 rounded-full"
                              >
                        {time}
                      </span>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
              }
              fullHeight
          />
        </div>

        {/* Tarjeta para la ubicación */}
        <div className="flex-1"> {/* Asegura que ocupe el espacio disponible */}
          <StatsCard
              icon={MapPin}
              title="Ubicación"
              value={classroom || "Sin asignar"}
              subtitle={!classroom && "No se ha especificado un salón para este grupo"}
              fullHeight
          />
        </div>
      </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, subtitle, fullHeight }) => (
    <div className={`bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-6 ${fullHeight ? 'h-full' : ''}`}>
      <div className="flex items-center h-full">
        <div className="p-2 sm:p-3 bg-gray-800 dark:bg-white rounded-2xl mr-3 sm:mr-4 shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
        </div>
        <div className="min-w-0 w-full">
          <p className="text-gray-800 dark:text-gray-50 text-xs sm:text-sm truncate">{title}</p>
          <div className="h-full flex flex-col justify-center">
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-50 truncate">
              {value}
            </h3>
            {subtitle && <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 truncate">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
);

const StudentCard = ({ student }) => (
    <div className="group bg-white dark:bg-black rounded-2xl overflow-hidden p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="p-2 sm:p-3 bg-gray-800 dark:bg-gray-50 rounded-2xl shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-800 dark:text-gray-50 truncate">{student?.name || 'Sin nombre'}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
        <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800 text-sm">
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
        className="block group bg-white rounded-2xl border-black dark:bg-black dark:border-white border overflow-hidden hover:shadow-md transition-all duration-500 p-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-gray-800 dark:bg-gray-50 rounded-2xl shrink-0">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-50 truncate">{activity.title}</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Coins className="w-4 h-4 mr-1 shrink-0" />
              {activity.turingBalance} τ
            </span>
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-50" />
      </div>
    </Link>
);

const GroupDetailView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { group, loading, error, deactivateGroup } = useGroupDetails(groupId);
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
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
          <div className="text-xl text-gray-500 dark:text-gray-400">Cargando datos del grupo...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-lg text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                Grupo {groupNumber}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Gestion del grupo.
              </p>
            </div>

            <div className="mt-8 sm:mt-10">
              <ScheduleDisplay
                  schedule={JSON.parse(group?.schedule || '[]')}
                  classroom={group?.classroom || 'Sin asignar'}
              />
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
                className="flex-1 bg-white text-gray-800 border border-black hover:bg-gray-800 hover:text-gray-50 hover:border hover:border-black
                                  dark:bg-black dark:text-gray-50 dark:border dark:border-white dark:hover:border-black dark:hover:bg-gray-50 dark:hover:text-gray-800
                px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              <span className="hidden sm:inline">Editar Grupo</span>
            </button>
            <button
                onClick={() => navigate(`/grupos/${group.id}/nueva-actividad`)}
                className="flex-1 bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nueva Actividad</span>
            </button>
            <button
                onClick={() => navigate(`/grupos/${group.id}/tienda/admin`)}
                className="flex-1 bg-white text-gray-800 border border-black hover:bg-gray-800 hover:text-gray-50 hover:border hover:border-black
                                  dark:bg-black dark:text-gray-50 dark:border dark:border-white dark:hover:border-black dark:hover:bg-gray-50 dark:hover:text-gray-800
                px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Tienda del Grupo</span>
            </button>

            {group?.isActive && (
                <button
                    onClick={handleDeactivateGroup}
                    className="flex-1 bg-red-50 text-red-600 border border-red-600 hover:bg-red-600 hover:text-red-50
                                                                dark:bg-red-600 dark:text-red-50 dark:border dark:border-red-600 dark:hover:border-red-50 dark:hover:bg-red-50 dark:hover:text-red-600
                                                                 px-4 sm:px-6 py-3 sm:py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="hidden sm:inline">Desactivar Grupo</span>
                </button>
            )}
          </div>

          {/* Students List */}
          <div className="bg-white rounded-3xl border border-black dark:bg-black dark:border-white p-4 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-8">
              <div className="p-2 sm:p-3 bg-gray-800 dark:bg-gray-50 rounded-2xl mr-3 sm:mr-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-50">Lista de Estudiantes</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Estudiantes registrados en el grupo</p>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-4">
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
          <div className="bg-white rounded-3xl border border-black dark:bg-black dark:border-white p-4 sm:p-8 mt-6 sm:mt-8">
            <div className="flex items-center mb-4 sm:mb-8">
              <div className="p-2 sm:p-3 bg-gray-800 dark:bg-gray-50 rounded-2xl mr-3 sm:mr-4">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-50">Actividades del Grupo</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Actividades asignadas a este grupo</p>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-4">
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