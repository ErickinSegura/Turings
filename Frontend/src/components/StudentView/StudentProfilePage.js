import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { User, Mail, Star, Target, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';
import useShopTransactions from '../../hooks/UseShopTransactions';

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-gray-700 rounded-xl">
          <Icon className="w-6 h-6 text-gray-50" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
);

// Transaction Chart Card Component
const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
);

const ProfilePage = () => {
  const { user, logOut } = useAuth();
  const [studentInfo, setStudentInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getStudentTransactions } = useShopTransactions(studentInfo?.groupId);

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Cargar datos del estudiante
  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setStudentInfo(userDoc.data());
          } else {
            setError('No se encontró información del estudiante');
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          setError('Error al cargar los datos del usuario');
        }
      }
    };
    fetchStudentInfo();
  }, [user]);

  // Cargar transacciones
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.uid && studentInfo?.groupId) {
        try {
          const transactionData = await getStudentTransactions(user.uid);
          setTransactions(transactionData);
        } catch (error) {
          console.error('Error al cargar transacciones:', error);
          setError('Error al cargar las transacciones');
        } finally {
          setLoading(false);
        }
      }
    };

    if (studentInfo) {
      if (studentInfo.groupId) {
        fetchTransactions();
      } else {
        setLoading(false);
      }
    }
  }, [user, studentInfo]);

  // Procesar datos para gráficas
  const processTransactionData = () => {
    const activityVsPurchase = { activities: 0, purchases: 0 };
    let totalEarned = 0;
    let totalSpent = 0;
    let runningBalance = 0;

    // Ordenar transacciones por fecha
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = a.timestamp?.toDate() || new Date();
      const dateB = b.timestamp?.toDate() || new Date();
      return dateA - dateB;
    });

    const balanceData = [{
      date: sortedTransactions[0]?.timestamp?.toDate() || new Date(),
      balance: 0,
      description: 'Inicio',
      amount: 0
    }];

    sortedTransactions.forEach(transaction => {
      runningBalance += transaction.totalPrice;

      balanceData.push({
        date: transaction.timestamp?.toDate() || new Date(),
        balance: runningBalance,
        description: transaction.description || transaction.productName || 'Transacción',
        amount: transaction.totalPrice,
        type: transaction.type
      });

      if (transaction.type === 'activity') {
        activityVsPurchase.activities++;
        totalEarned += transaction.totalPrice;
      } else if (transaction.type === 'purchase') {
        activityVsPurchase.purchases++;
        totalSpent += Math.abs(transaction.totalPrice);
      }
    });

    return {
      balanceData,
      activityVsPurchase: [
        { name: 'Actividades', value: activityVsPurchase.activities },
        { name: 'Compras', value: activityVsPurchase.purchases }
      ],
      totalEarned,
      totalSpent
    };
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Cargando perfil...</div>;
  }

  if (!studentInfo?.groupId) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Mi Perfil</h1>
                <p className="text-gray-500 text-lg">Gestiona tu información y revisa tus estadísticas</p>
              </div>

              <button
                  onClick={handleLogOut}
                  className="inline-flex items-center px-6 py-3 bg-black text-gray-50 rounded-2xl"
              >
                Cerrar Sesión
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-black p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-black rounded-2xl">
                  <User className="w-16 h-16 text-gray-50"/>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {studentInfo?.name || 'Estudiante'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3"/>
                      {studentInfo?.email || 'Sin correo'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No tienes un grupo asignado
                </h3>
                <p className="text-gray-600">
                  Por favor, contacta con tu profesor para que te asigne a un grupo.
                </p>
              </div>
            </div>
          </div>
        </div>
    );
  }

  const {balanceData, activityVsPurchase, totalEarned, totalSpent} = processTransactionData();
  const COLORS = ['#0088FE', '#00C49F'];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Mi Perfil</h1>
              <p className="text-gray-500 text-lg">Gestiona tu información y revisa tus estadísticas</p>
            </div>

            <button
                onClick={handleLogOut}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-black shadow-sm p-8 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <User className="w-16 h-16 text-gray-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{studentInfo?.name || 'Estudiante'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    {studentInfo?.email || 'Sin correo'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
                icon={Star}
                title="Turings Totales"
                value={totalEarned}
                description="Turings ganados hasta la fecha"
            />
            <StatsCard
                icon={Target}
                title="Disponibles"
                value={studentInfo?.turingBalance || 0}
                description="Turings para utilizar"
            />

            <StatsCard
                icon={TrendingDown}
                title="Gastados"
                value={totalSpent}
                description="Turings gastados en compras"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Monthly Balance Chart */}
            <ChartCard title="Balance de Turings">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                          return date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit'
                          });
                        }}
                    />
                    <YAxis />
                    <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                                  <p className="font-bold">
                                    {label.toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: '2-digit'
                                    })}
                                  </p>
                                  <p className="text-sm text-gray-600">{data.description}</p>
                                  <p className={`font-semibold ${
                                      data.amount > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {data.amount > 0 ? '+' : ''}{data.amount} Turings
                                  </p>
                                  <p className="text-gray-800">Balance: {data.balance} Turings</p>
                                </div>
                            );
                          }
                          return null;
                        }}
                    />
                    <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                    <Line
                        type="stepAfter"
                        dataKey="balance"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          return (
                              <circle
                                  cx={cx}
                                  cy={cy}
                                  r={4}
                                  fill={payload.amount > 0 ? "#4CAF50" : "#f44336"}
                                  stroke="white"
                                  strokeWidth={2}
                              />
                          );
                        }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Transaction Types Chart */}
            <ChartCard title="Tipos de Transacciones">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                        data={activityVsPurchase}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                      {activityVsPurchase.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;