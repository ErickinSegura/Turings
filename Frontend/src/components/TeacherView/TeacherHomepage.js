import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, PlusCircle, BookOpen, ClipboardList, ChevronRight, Calendar, Clock, Coins } from 'lucide-react';

const ActionCard = ({ icon: Icon, title, description, to }) => (
    <Link to={to} className="block group">
        <div className="bg-white dark:bg-black rounded-3xl overflow-hidden border border-black dark:border-white hover:border-black dark:hover:border-gray-800 shadow-sm hover:shadow-xl p-8 transition-all duration-500">
            <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-gray-800 border border-gray-800 dark:bg-white rounded-2xl group-hover:bg-white group-hover:border-black dark:group-hover:bg-black dark:group-hover:border-white transition-colors duration-500">
                    <Icon className="w-8 h-8 text-gray-50 dark:text-black group-hover:text-gray-800 dark:group-hover:text-gray-50 transition-colors duration-500" />
                </div>
                <div className="ml-6 flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-50 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-500" />
            </div>
        </div>
    </Link>
);

const ActivityItem = ({ activity }) => {
    const formatDate = (timestamp) => {
        const date = timestamp?.toDate();
        return date ? new Intl.DateTimeFormat('es-ES').format(date) : 'Sin fecha';
    };

    return (
        <div className="group bg-white dark:bg-black rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800 dark:bg-gray-50 rounded-xl">
                            <ClipboardList className="w-5 h-5 text-gray-50 dark:text-gray-800" />
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-50 font-medium">{activity.title}</p>
                            <div className="flex items-center space-x-4 mt-1">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(activity.dueDate)}
                </span>
                                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Coins className="w-4 h-4 mr-1" />
                                    {activity.turingBalance} τ
                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.groupId?.split('-')[1] || 'Todos'}
                </div>
            </div>
        </div>
    );
};

const GroupItem = ({ group }) => {
    const totalStudents = group.studentIds?.length || 0;
    const schedule = JSON.parse(group.schedule || '[]').join(', ');

    return (
        <div className="group bg-white dark:bg-black rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl">
                            <Users className="w-5 h-5 text-gray-800 dark:text-gray-50" />
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-50 font-medium">Grupo {group.name?.split('-')[1]}</p>
                            <div className="flex items-center space-x-4 mt-1">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                    {totalStudents} estudiantes
                </span>
                                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                                    {schedule.substring(0, 20)}...
                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-50" />
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los grupos
                const groupsQuery = query(collection(db, 'groups'));
                const groupsSnapshot = await getDocs(groupsQuery);
                const allGroups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Obtener todas las actividades
                const activitiesQuery = query(collection(db, 'activities'));
                const activitiesSnapshot = await getDocs(activitiesQuery);
                const allActivities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setGroups(allGroups);
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
        totalGroups: groups.filter(g => g.isActive !== false).length,
        activeStudents: groups.reduce((acc, group) => acc + (group.studentIds?.length || 0), 0),
        totalActivities: activities.length
    };

    const recentActivities = activities
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 3);

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                    <StatsCard
                        icon={ClipboardList}
                        title="Actividades"
                        value={stats.totalActivities}
                        description="Total de actividades creadas"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <ActionCard
                        icon={PlusCircle}
                        title="Nuevo Grupo"
                        description="Crear un nuevo grupo de estudiantes"
                        to="/crear-grupo"
                    />
                    <ActionCard
                        icon={ClipboardList}
                        title="Gestionar Actividades"
                        description="Crear o modificar actividades"
                        to="/actividades"
                    />
                </div>

                <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white shadow-sm p-8 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-800 dark:bg-white rounded-2xl mr-4">
                                <ClipboardList className="w-6 h-6 text-gray-50 dark:text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">Actividades Recientes</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Últimas actividades creadas</p>
                            </div>
                        </div>
                        <Link to="/actividades" className="text-sm text-gray-800 dark:text-gray-300 hover:underline">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} />
                        ))}
                    </div>
                </div>

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
                        <Link to="/grupos" className="text-sm text-gray-800 dark:text-gray-300 hover:underline">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="space-y-4">
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