import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BookOpen, Calendar, User, Users, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const GroupCard = ({ group, onClick }) => (
    <div
        className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5 border border-black cursor-pointer dark:bg-black dark:border-white"
        onClick={onClick}
    >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-50">Grupo {group.name}</h4>
                    {!group.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Inactivo
                        </span>
                    )}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                    <Users className="w-4 h-4 mr-2" />
                    {group.studentIds?.length || 0} estudiantes
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(group.createdAt?.seconds * 1000).toLocaleDateString()}
                </div>
            </div>
            {!group.isActive && group.deactivatedAt && (
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Desactivado: {new Date(group.deactivatedAt?.seconds * 1000).toLocaleDateString()}
                </div>
            )}
        </div>
    </div>
);

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [isInactiveExpanded, setIsInactiveExpanded] = useState(false);

    const activeGroups = course.groups.filter(group => group.isActive !== false);
    const inactiveGroups = course.groups.filter(group => group.isActive === false);

    const toggleInactiveGroups = (e) => {
        e.stopPropagation();
        setIsInactiveExpanded(!isInactiveExpanded);
    };

    return (
        <div className="bg-white rounded-3xl border border-black shadow-sm p-6 mb-6 dark:bg-black dark:border-white">
            <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-800 dark:bg-gray-50 rounded-xl mr-4">
                    <BookOpen className="w-6 h-6 text-gray-50 dark:text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{course.name}</h3>
            </div>

            <div className="space-y-4">
                {/* Active Groups */}
                {activeGroups.length > 0 && (
                    <div className="mb-6">
                        {activeGroups.map((group) => (
                            <div className="mb-4" key={group.id}>
                            <GroupCard
                                key={group.id}
                                group={group}
                                onClick={() => navigate(`/grupos/${group.id}`)}
                            />
                            </div>
                        ))}
                    </div>
                )}

                {/* Inactive Groups */}
                {inactiveGroups.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <button
                            onClick={toggleInactiveGroups}
                            className="flex items-center justify-between w-full text-left text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-2"
                        >
                            <span className="font-medium">
                                Grupos Inactivos ({inactiveGroups.length})
                            </span>
                            {isInactiveExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {isInactiveExpanded && (
                            <div className="mt-2 space-y-4">
                                {inactiveGroups.map((group) => (
                                    <GroupCard
                                        key={group.id}
                                        group={group}
                                        onClick={() => navigate(`/grupos/${group.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groupsQuery = query(collection(db, 'groups'));
                const querySnapshot = await getDocs(groupsQuery);
                const fetchedGroups = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const groupedByCourse = fetchedGroups.reduce((acc, group) => {
                    const courseName = group.name.split('-')[0];
                    if (!acc[courseName]) {
                        acc[courseName] = { name: courseName, groups: [] };
                    }
                    acc[courseName].groups.push(group);
                    return acc;
                }, {});

                Object.values(groupedByCourse).forEach(course => {
                    course.groups.sort((a, b) => {
                        if (a.isActive === b.isActive) {
                            return b.createdAt?.seconds - a.createdAt?.seconds;
                        }
                        return a.isActive === false ? 1 : -1;
                    });
                });

                setGroups(Object.values(groupedByCourse));
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
            <div className="text-xl text-gray-500 dark:text-gray-400">Cargando grupos...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                            Mis Grupos
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Gestión general de los grupos en plataforma
                        </p>
                    </div>
                </div>
                <div className="space-y-6">
                    {groups.length > 0 ? (
                        groups.map((course, index) => <CourseCard key={index} course={course}/>)
                    ) : (
                        <div className="text-center py-12 text-gray-500">No hay grupos registrados aún</div>
                    )}
                </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 pb-4">
                <Link
                    to="/crear-grupo"
                    className="px-6 py-3 rounded-2xl transition-colors flex items-center
                    bg-gray-800 text-gray-50 border border-gray-800  hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                    dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                    "
                >
                    <User className="w-5 h-5 mr-2"/>
                    Crear Nuevo Grupo
                </Link>
            </div>
        </div>
    );
};

export default GroupsPage;