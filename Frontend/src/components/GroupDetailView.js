import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGroupDetails } from '../hooks/UseGroupDetails';
import {
  Users,
  Trophy,
  PlusCircle,
  ArrowLeft,
  GraduationCap,
  Mail,
  Hash,
  Coins,
  Terminal,
  ShoppingBag,
  Book,
  Clock,
} from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gray-800 rounded-2xl mr-4">
        <Icon className="w-6 h-6 text-gray-50" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const StudentCard = ({ student }) => (
  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-800 rounded-2xl">
          <GraduationCap className="w-6 h-6 text-gray-50" />
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
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 text-gray-50 group-hover:bg-gray-700 transition-colors">
          <Trophy className="w-4 h-4 mr-2" />
          {student?.turingBalance || 0} τ
        </span>
      </div>
    </div>
  </div>
);

const ActivityCard = ({ activity }) => (
  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-800 rounded-2xl">
          {activity.type === 'participation' && <Users className="w-6 h-6 text-gray-50" />}
          {activity.type === 'homework' && <Book className="w-6 h-6 text-gray-50" />}
          {activity.type === 'project' && <Terminal className="w-6 h-6 text-gray-50" />}
          {activity.type === 'exam' && <GraduationCap className="w-6 h-6 text-gray-50" />}
          {activity.type === 'other' && <Trophy className="w-6 h-6 text-gray-50" />}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{activity.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              {activity.turingPoints} τ
            </span>
            {activity.dueDate && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(activity.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {activity.maxParticipants > 0 && (
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800">
            <Users className="w-4 h-4 mr-2" />
            {activity.participants?.length || 0}/{activity.maxParticipants}
          </span>
        )}
        <span className={`inline-flex items-center px-4 py-2 rounded-full ${
          activity.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {activity.status === 'active' ? 'Activa' : 'Finalizada'}
        </span>
      </div>
    </div>
  </div>
);

const GroupDetailView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { group, loading, error } = useGroupDetails(groupId);

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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Grupo {groupNumber}
            </h1>
            <p className="text-gray-500 text-lg">
              {group?.schedule || 'Horario no definido'} • Sala {group?.classroom || 'Sin asignar'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => navigate(`/grupos/${group.id}/editar`)}
            className="flex-1 bg-white text-gray-800 border border-black px-6 py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
          >
            <Terminal className="w-5 h-5" />
            Editar Grupo
          </button>
          <button
            onClick={() => navigate(`/grupos/${group.id}/nueva-actividad`)}
            className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Nueva Actividad
          </button>

          <button
            onClick={() => navigate(`/grupos/${group.id}/tienda`)}
            className="flex-1 bg-white text-gray-800 border border-black px-6 py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Tienda del Grupo
          </button>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-3xl border border-black p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gray-800 rounded-2xl mr-4">
              <Users className="w-6 h-6 text-gray-50" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Lista de Estudiantes</h2>
              <p className="text-gray-500 text-sm mt-1">Estudiantes registrados en el grupo</p>
            </div>
          </div>

          <div className="space-y-4">
            {group?.students?.length > 0 ? (
              group.students.map((student) => (
                <StudentCard key={student?.id || Math.random()} student={student} />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No hay estudiantes registrados en este grupo
              </div>
            )}
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-3xl border border-black p-8 mt-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gray-800 rounded-2xl mr-4">
              <Trophy className="w-6 h-6 text-gray-50" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Actividades del Grupo</h2>
              <p className="text-gray-500 text-sm mt-1">Actividades asignadas a este grupo</p>
            </div>
          </div>

          <div className="space-y-4">
            {group?.activities?.length > 0 ? (
              group.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
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