import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, PlusCircle, BookOpen, ClipboardList, ChevronRight, Coins} from 'lucide-react';

const ActionCard = ({ icon: Icon, title, description, to, onClick }) => {
    const Component = to ? Link : 'div';
    return (
        <Component
            to={to}
            onClick={onClick}
            className="block group cursor-pointer"
        >
            <div className="bg-white dark:bg-black rounded-3xl overflow-hidden border border-black dark:border-white hover:border-black dark:hover:border-gray-800 shadow-sm hover:shadow-xl p-8 transition-all duration-500">
                <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-gray-800 border border-gray-800 dark:bg-white rounded-2xl group-hover:bg-white group-hover:border-black dark:group-hover:bg-black dark:group-hover:border-white transition-colors duration-500">
                        <Icon className="w-8 h-8 text-gray-50 dark:text-black group-hover:text-gray-800 dark:group-hover:text-gray-50 transition-colors duration-500" />
                    </div>
                    <div className="ml-6 flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
                    </div>
                </div>
            </div>
        </Component>
    );
};

const GroupItem = ({ group }) => {
    const totalStudents = group.studentIds?.length || 0;

    return (
        <div className="group bg-white dark:bg-black border border-black dark:border-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800 dark:bg-gray-50 rounded-xl">
                            <Users className="w-5 h-5 text-gray-50 dark:text-gray-800" />
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-50 font-medium">Grupo {group.name}</p>
                            <div className="flex items-center space-x-4 mt-1">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                    {totalStudents} estudiantes
                </span>

                            </div>
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 " />
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-6">
        <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gray-800 dark:bg-white rounded-xl">
                <Icon className="w-6 h-6 text-gray-50 dark:text-gray-800" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{title}</h3>
        </div>
        <p className="text-3xl font-semibold text-gray-800 dark:text-gray-50 mb-2">{value}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
);

const TeacherHomepage = () => {
    const [groups, setGroups] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener grupos con estudiantes y actividades
                const groupsQuery = query(collection(db, 'groups'));
                const groupsSnapshot = await getDocs(groupsQuery);

                const groupsData = await Promise.all(
                    groupsSnapshot.docs.map(async doc => {
                        const group = { id: doc.id, ...doc.data() };
                        if (group.isActive === false) return null;

                        // Obtener estudiantes
                        const studentsQuery = query(
                            collection(db, 'users'),
                            where('groupId', '==', doc.id)
                        );
                        const studentsSnapshot = await getDocs(studentsQuery);
                        const students = studentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                        // Calcular estadísticas
                        const totalTuring = students.reduce((acc, student) => acc + (student.turingBalance || 0), 0);
                        const averageTuring = students.length > 0 ? (totalTuring / students.length).toFixed(2) : 0;

                        return {
                            ...group,
                            students,
                            totalTuring,
                            averageTuring
                        };
                    })
                );

                // Obtener todas las actividades
                const activitiesQuery = query(collection(db, 'activities'));
                const activitiesSnapshot = await getDocs(activitiesQuery);
                const allActivities = activitiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    dueDate: doc.data().dueDate?.toDate()
                }));

                setGroups(groupsData.filter(Boolean));
                setActivities(allActivities);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = {
        totalGroups: groups.length,
        activeStudents: groups.reduce((acc, group) => acc + (group.students?.length || 0), 0),
        totalActivities: activities.length
    };

    const getGroupActivities = (groupId) =>
        activities
            .filter(a => a.groupId === groupId)
            .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

    const activeGroups = groups
        .filter(g => g.isActive !== false)
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 3);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-xl text-gray-500 dark:text-gray-400">Cargando datos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Modal de selección de grupo */}
                {showGroupModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-black border border-black dark:border-white rounded-3xl p-8 max-w-2xl w-full">
                            <h3 className="text-2xl font-bold mb-6 dark:text-white">Seleccionar Grupo</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        onClick={() => {
                                            navigate(`/grupos/${group.id}/nueva-actividad`);
                                            setShowGroupModal(false);
                                        }}
                                        className="p-4 border border-black dark:border-white rounded-xl cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                      <span className="dark:text-white">
                        Grupo {group.name?.split('-')[1]}
                      </span>
                                            <ChevronRight className="w-5 h-5 dark:text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="mt-6 px-6 py-2 bg-gray-800 text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Encabezado */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                            Panel del Profesor
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Herramientas de gestión académica
                        </p>
                    </div>
                </div>

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <StatsCard
                        icon={Users}
                        title="Grupos Activos"
                        value={stats.totalGroups}
                        description="Total de grupos bajo tu dirección"
                    />
                    <StatsCard
                        icon={BookOpen}
                        title="Estudiantes"
                        value={stats.activeStudents}
                        description="Alumnos registrados en total"
                    />
                </div>

                {/* Acciones rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
                    <ActionCard
                        icon={PlusCircle}
                        title="Nueva Actividad"
                        description="Crear actividad para un grupo específico"
                        onClick={() => setShowGroupModal(true)}
                    />

                </div>

                {/* Resumen de Actividades por Grupo */}
                <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white shadow-sm p-8 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-800 dark:bg-white rounded-2xl mr-4">
                                <ClipboardList className="w-6 h-6 text-gray-50 dark:text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">
                                    Actividades por Grupo
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    Resumen de actividades recientes por grupo
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map((group) => {
                            const groupActivities = getGroupActivities(group.id);
                            const groupNumber = group.name?.split('-')[1];

                            return (
                                <div
                                    key={group.id}
                                    className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
                                            Grupo {groupNumber}
                                        </h3>
                                    </div>

                                    {groupActivities.length > 0 ? (
                                        <div className="space-y-4">
                                            {groupActivities.slice(0, 3).map((activity) => (
                                                <Link
                                                    to={`/actividades/${activity.id}`} // Enlace específico a la actividad
                                                    key={activity.id}
                                                    className="block hover:shadow-lg transition-shadow duration-300"
                                                >
                                                    <div className="bg-white border border-black dark:border-white dark:bg-black rounded-xl p-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                                                {activity.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Coins className="w-4 h-4 mr-1" />
                          {activity.turingBalance} τ
                      </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-50" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                                            No hay actividades en este grupo
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grupos Activos */}

                <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-800 dark:bg-white rounded-2xl mr-4">
                                <Users className="w-6 h-6 text-gray-50 dark:text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">Grupos Activos</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tus grupos actualmente activos</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeGroups.map(group => (
                            <Link to={`/grupos/${group.id}`} key={group.id}>
                                <GroupItem group={group} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHomepage;