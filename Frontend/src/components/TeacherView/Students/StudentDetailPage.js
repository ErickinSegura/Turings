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
  Calendar,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  TrendingUp,
  ShoppingCart,
  Award
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

        // Fetch group details if student has a group
        if (studentData.groupId) {
          const groupRef = doc(db, 'groups', studentData.groupId);
          const groupDoc = await getDoc(groupRef);

          studentData.groupName = groupDoc.exists() ? groupDoc.data().name : studentData.groupId;
        }


        // Fetch transactions
        const studentTransactions = await getStudentTransactions(studentId);
        setTransactions(studentTransactions);

        // Fetch completed activities
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
    return (
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );
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

  // Prepare transaction data for chart
  const transactionData = transactions
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((transaction, index) => ({
        name: `Compra ${index + 1}`,
        amount: transaction.totalPrice
      }));

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl border border-black p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="p-6 bg-gray-800 rounded-2xl h-fit">
                <GraduationCap className="w-16 h-16 text-gray-50" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {student.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Matrícula</p>
                        <p className="font-medium">{student.matricula}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </div>

                    {student.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{student.phone}</p>
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {student.status && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <p className="font-medium">{student.status}</p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>

                {student.groupName && (
                    <div className="mt-8">
                      <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                          Grupo Inscrito
                        </h2>
                      </div>
                      <div className="flex">
      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
        {student.groupName}
      </span>
                      </div>
                    </div>
                )}

              </div>
            </div>

            {/* New Statistics Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas del Estudiante</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Turing Balance Card */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Balance de Turing</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{student.turingBalance} τ</p>
                  <p className="text-sm text-gray-600">Balance actual</p>
                </div>

                {/* Transactions Card */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Compras</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{transactions.length}</p>
                  <p className="text-sm text-gray-600">Total de compras realizadas</p>
                </div>

                {/* Activities Card */}
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Award className="w-6 h-6 mr-2 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Actividades</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-700">{completedActivities.length}</p>
                  <p className="text-sm text-gray-600">Actividades completadas</p>
                </div>
              </div>

              {/* Transaction Chart */}
              {transactions.length > 0 && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Compras</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={transactionData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#3B82F6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
              )}

              {/* Completed Activities */}
              {completedActivities.length > 0 && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividades Completadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedActivities.map((activity, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                            <p className="font-medium text-gray-800">{activity.name}</p>
                            <p className="text-sm text-gray-600">+{activity.turingBalance} τ</p>
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