import {
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  User,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const StatsCard = ({ icon: Icon, title, value, description, to }) => {
  const content = (
    <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500 cursor-pointer">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-gray-800 rounded-xl">
          <Icon className="w-6 h-6 text-gray-50" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );

  return to ? (
    <Link to={to}>{content}</Link>
  ) : (
    content
  );
};

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

const TeacherProfilePage = () => {
  const { user, logOut } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.uid) return;
      
      try {
        const groupsQuery = query(
          collection(db, "groups")
        );
        
        const querySnapshot = await getDocs(groupsQuery);
        const fetchedGroups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Organizar grupos por materia
        const groupedByCourse = fetchedGroups.reduce((acc, group) => {
          const courseName = group.name.split('-')[0];
          if (!acc[courseName]) {
            acc[courseName] = {
              name: courseName,
              groups: []
            };
          }
          acc[courseName].groups.push(group);
          return acc;
        }, {});
        
        setGroups(Object.values(groupedByCourse));
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, [user]);

  const totalStudents = groups.reduce((total, course) => {
    return total + course.groups.reduce((sum, group) => {
      return sum + (group.studentIds ? group.studentIds.length : 0);
    }, 0);
  }, 0);

  const totalGroups = groups.reduce((total, course) =>
    total + course.groups.length, 0
  );

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