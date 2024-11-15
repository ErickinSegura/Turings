import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Terminal, PlusCircle, ChevronRight, ArrowDownCircle, ArrowUpCircle, ShoppingBag } from 'lucide-react';
import useShopTransactions from "../../hooks/UseShopTransactions";

const ActionCard = ({ icon: Icon, title, description }) => (
    <div className="group bg-white rounded-3xl overflow-hidden border border-black hover:border-black shadow-sm hover:shadow-xl transition-all duration-500 p-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-3 bg-gray-800 rounded-2xl group-hover:bg-gray-100 transition-all duration-500">
          <Icon className="w-8 h-8 text-gray-50 group-hover:text-gray-900 transition-all duration-500" />
        </div>
        <div className="ml-6 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
            {title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform translate-x-0 group-hover:translate-x-1 transition-all duration-500" />
      </div>
    </div>
);

const TransactionItem = ({ transaction }) => {
  const isSpent = transaction.totalPrice < 0;
  const Icon = isSpent ? ArrowDownCircle : ArrowUpCircle;
  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
      <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isSpent ? 'bg-red-50' : 'bg-green-50'}`}>
                <Icon className={`w-5 h-5 ${isSpent ? 'text-red-500' : 'text-green-500'}`} />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  {transaction.productName || transaction.description}
                </p>
                <p className="text-gray-400 text-sm">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
            <span className={`text-sm font-medium ${isSpent ? 'text-red-600' : 'text-green-600'}`}>
              {isSpent ? '- ' : '+ '}
              {Math.abs(transaction.totalPrice)} τ
            </span>
              {transaction.quantity > 1 && (
                  <p className="text-xs text-gray-400">
                    Cantidad: {transaction.quantity}
                  </p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

const StatsCard = ({ title, value }) => (
    <div className="bg-white rounded-3xl border border-black p-6">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
    </div>
);

const HomePage = () => {
  const { user } = useAuth(); // Usuario actual
  const { getStudentTransactions, loading: transactionsLoading, error: transactionsError } = useShopTransactions(user?.groupId); // Hook de transacciones
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (user?.uid) {
        try {
          const transactions = await getStudentTransactions(user.uid);
          setRecentTransactions(
              transactions
                  .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()) // Ordena por fecha descendente
                  .slice(0, 5) // Toma las 5 más recientes
          );
        } catch (error) {
          console.error("Error al cargar transacciones:", error);
        }
      }
    };

    loadTransactions();
  }, [user, getStudentTransactions]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Bienvenido, {user?.name || "Estudiante"}
              </h1>
              <p className="text-gray-500 text-lg">
                Tu lugar seguro, disruptivo y de alto impacto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <StatsCard title="Actividades Completadas" value="24" />
            <StatsCard title="Turings Disponibles" value={user?.turingBalance || 0} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link to="/register-activity" className="block">
              <ActionCard
                  icon={PlusCircle}
                  title="Registrar Nueva Actividad"
                  description="Documenta tus participaciones para ganar Turings"
              />
            </Link>
            <Link to="/shop" className="block">
              <ActionCard
                  icon={ShoppingBag}
                  title="Visitar Tienda"
                  description="Explora productos y canjea tus Turings"
              />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                  <Terminal className="w-6 h-6 text-gray-50" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Últimas Transacciones</h2>
                  <p className="text-gray-500 text-sm mt-1">Tus movimientos más recientes</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {transactionsLoading ? (
                  <div className="text-center py-8 text-gray-500">Cargando transacciones...</div>
              ) : transactionsError ? (
                  <div className="text-center py-8 text-red-500">
                    Error al cargar transacciones: {transactionsError}
                  </div>
              ) : recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                  ))
              ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay transacciones recientes
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};


export default HomePage;