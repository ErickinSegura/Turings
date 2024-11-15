import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {BookOpen, Calendar, User, Users} from 'lucide-react';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-3xl border border-black shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-800 rounded-xl mr-4">
                    <BookOpen className="w-6 h-6 text-gray-50" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
            </div>
            <div className="space-y-4">
                {course.groups.map((group) => (
                    <div
                        key={group.id}
                        className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5 border border-gray-100 cursor-pointer"
                        onClick={() => navigate(`/grupos/${group.id}`)}
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <h4 className="font-medium text-gray-900">Grupo {group.name}</h4>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                    <Users className="w-4 h-4 mr-2" />
                                    {group.studentIds?.length || 0} estudiantes
                                </div>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(group.createdAt?.seconds * 1000).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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

                // Organizar grupos por materia
                const groupedByCourse = fetchedGroups.reduce((acc, group) => {
                    const courseName = group.name.split('-')[0];
                    if (!acc[courseName]) {
                        acc[courseName] = { name: courseName, groups: [] };
                    }
                    acc[courseName].groups.push(group);
                    return acc;
                }, {});

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Mis Grupos</h1>
                <div className="space-y-6">
                    {groups.length > 0 ? (
                        groups.map((course, index) => <CourseCard key={index} course={course}/>)
                    ) : (
                        <div className="text-center py-12 text-gray-500">No hay grupos registrados aún</div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                    to="/crear-grupo"
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors flex items-center"
                >
                    <User className="w-5 h-5 mr-2"/>
                    Crear Nuevo Grupo
                </Link>
            </div>
        </div>


    );


};

export default GroupsPage;
