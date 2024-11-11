import {
  Book,
  BookOpen,
  Building2,
  Calendar,
  ChartBar,
  Clock,
  GraduationCap,
  Mail,
  Medal,
  Target,
  User,
  Users
} from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';

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

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-3xl border border-black shadow-sm p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gray-800 rounded-xl mr-4">
        <BookOpen className="w-6 h-6 text-gray-50" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
    </div>
    <div className="space-y-4">
      {course.groups.map((group, index) => (
        <div key={index} className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900">Grupo {group.groupNumber}</h4>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                {group.schedule}
              </div>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Target className="w-4 h-4 mr-2" />
                Sala {group.classroom}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium">
                {group.students} estudiantes
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TeacherProfilePage = () => {
  const { user, logOut } = useAuth();

  const teacherInfo = {
    name: user?.name || 'Profesor',
    email: user?.email || 'profesor@universidad.edu',
    department: 'Departamento de Computación',
    title: 'Doctor en Ciencias Computacionales',
    courses: [
      {
        name: 'Algoritmos y Estructuras de Datos',
        groups: [
          {
            groupNumber: '001',
            students: 35,
            schedule: 'Lunes y Miércoles 10:00-12:00',
            classroom: '301-A',
            progress: 85
          },
          {
            groupNumber: '002',
            students: 32,
            schedule: 'Martes y Jueves 12:00-14:00',
            classroom: '302-A',
            progress: 78
          }
        ]
      },
      {
        name: 'Máquinas de Turing',
        groups: [
          {
            groupNumber: '001',
            students: 28,
            schedule: 'Martes y Jueves 8:00-10:00',
            classroom: '205-B',
            progress: 65
          }
        ]
      },
      {
        name: 'Bases de Datos Avanzadas',
        groups: [
          {
            groupNumber: '001',
            students: 30,
            schedule: 'Viernes 7:00-11:00',
            classroom: '401-C',
            progress: 45
          },
          {
            groupNumber: '002',
            students: 25,
            schedule: 'Sábados 8:00-12:00',
            classroom: '401-C',
            progress: 42
          }
        ]
      }
    ],
    stats: {
      totalGroups: 5,
      totalStudents: 150,
      activeAssignments: 12,
      averageProgress: 63
    }
  };

  // Calcular estadísticas
  const totalStudents = teacherInfo.courses.reduce((total, course) =>
    total + course.groups.reduce((sum, group) => sum + group.students, 0), 0
  );

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
                {teacherInfo.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  {teacherInfo.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-5 h-5 mr-3" />
                  {teacherInfo.department}
                </div>
                <div className="flex items-center text-gray-600">
                  <Medal className="w-5 h-5 mr-3" />
                  {teacherInfo.title}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatsCard
            icon={BookOpen}
            title="Grupos"
            value={teacherInfo.stats.totalGroups}
            description="Grupos activos"
          />
          <StatsCard
            icon={Users}
            title="Estudiantes"
            value={totalStudents}
            description="Estudiantes totales"
            to="/estudiantes" 
          />
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          {teacherInfo.courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/crear-grupo"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors flex items-center"
          >
            <User className="w-5 h-5 mr-2" />
            Editar Perfil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;