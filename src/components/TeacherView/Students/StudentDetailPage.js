import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import useShopTransactions from '../../../hooks/UseShopTransactions';
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  Building2,
  Phone,
  Clock,
  BookOpen,
  TrendingUp,
  ShoppingCart,
  Award
} from 'lucide-react';


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

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);

  const { getStudentTransactions } = useShopTransactions(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const studentRef = doc(db, 'users', studentId);
        const studentDoc = await getDoc(studentRef);

        if (!studentDoc.exists()) {
          setError('Estudiante no encontrado');
          return;
        }

        const studentData = {
          id: studentDoc.id,
          ...studentDoc.data()
        };

        if (studentData.groupId) {
          const groupRef = doc(db, 'groups', studentData.groupId);
          const groupDoc = await getDoc(groupRef);

          studentData.groupName = groupDoc.exists() ? groupDoc.data().name : studentData.groupId;
        }


        const studentTransactions = await getStudentTransactions(studentId);
        setTransactions(studentTransactions);

        const completedActivitiesRef = doc(db, 'users', studentId);
        const completedActivitiesDoc = await getDoc(completedActivitiesRef);
        const activitiesData = completedActivitiesDoc.data()?.completedActivities || [];

        const activitiesDetails = await Promise.all(
            activitiesData.map(async activityId => {
              const activityRef = doc(db, 'activities', activityId);
              const activityDoc = await getDoc(activityRef);
              return activityDoc.exists() ? activityDoc.data() : null;
            })
        );

        setCompletedActivities(activitiesDetails.filter(Boolean));

        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Error al cargar los detalles del estudiante');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
      <div className="text-xl text-gray-500 dark:text-gray-400">Cargando Alumno...</div>
    </div>;
  }

  if (error) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
                onClick={() => navigate('/students')}
                className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista
            </button>
          </div>
        </div>
    );
  }

  if (!student) return null;

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="p-6 bg-gray-800 dark:bg-gray-50 rounded-2xl h-fit text-center">
                <GraduationCap className="w-16 h-16 text-gray-50 dark:text-gray-800" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">
                  {student.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-500">
                      <Building2 className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Matrícula</p>
                        <p className="font-medium">{student.matricula}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-500">
                      <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </div>

                    {student.phone && (
                        <div className="flex items-center text-gray-600 dark:text-gray-500">
                          <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                            <p className="font-medium">{student.phone}</p>
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {student.status && (
                        <div className="flex items-center text-gray-600 dark:text-gray-500">
                          <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                            <p className="font-medium">{student.status}</p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>

                {student.groupName && (
                    <div className="mt-8">
                      <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-500" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                          Grupo Inscrito
                        </h2>
                      </div>
                      <div className="flex">
      <span className="px-4 py-2 bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800 rounded-xl text-sm font-medium">
        {student.groupName}
      </span>
                      </div>
                    </div>
                )}

              </div>
            </div>

            {/* New Statistics Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6">Estadísticas del Estudiante</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard
                    icon={TrendingUp}
                    title="Balance de Turing"
                    value={student.turingBalance}
                    description="Balance actual"/>

                <StatsCard
                    icon={ShoppingCart}
                    title="Compras"
                    value={transactions.length}
                    description="Total de compras realizadas"/>

                <StatsCard
                    icon={Award}
                    title="Actividades"
                    value={completedActivities.length}
                    description="Actividades completadas"/>
              </div>


              {completedActivities.length > 0 && (
                  <div className="mt-8 bg-white dark:bg-black border border-black dark:border-white p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-4">
                      Actividades Completadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedActivities.map((activity, index) => (
                          <div
                              key={index}
                              className="bg-gray-50 dark:bg-black p-4 rounded-lg shadow-sm border border-black dark:border-white"
                          >
                            <p className="font-medium text-gray-800 dark:text-gray-50">
                              {activity.title || activity.name || 'Actividad sin nombre'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              +{activity.turingBalance} τ
                            </p>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>
        </div>
        );
        };

        export default StudentDetailPage;