import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import {Terminal, PlusCircle, ChevronRight, ArrowDownCircle, ArrowUpCircle, Star} from 'lucide-react';
import useShopTransactions from "../../hooks/UseShopTransactions";

const ActionCard = ({ icon: Icon, title, description }) => (
    <div className="group bg-white dark:bg-black rounded-3xl overflow-hidden border border-black dark:border-white hover:border-black dark:hover:border-gray-800 shadow-sm hover:shadow-xl p-8 transition-[transform,border-color,box-shadow] duration-500 ease-in-out">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-3 bg-gray-800 border border-gray-800 dark:bg-white rounded-2xl group-hover:bg-white group-hover:border group-hover:border-black dark:group-hover:bg-black dark:group-hover:border-white transition-colors duration-500">
          <Icon className="w-8 h-8 text-gray-50 dark:text-black group-hover:text-gray-800 dark:group-hover:text-gray-50 transition-colors duration-500" />
        </div>
        <div className="ml-6 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-50">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-50 dark:group-hover:text-gray-200 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-500" />
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
      <div className="group bg-white dark:bg-black rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isSpent ? 'bg-red-50 dark:bg-white/10' : 'bg-green-50 dark:bg-white/10'}`}>
                <Icon className={`w-5 h-5 ${isSpent ? 'text-red-500 dark:text-gray-50' : 'text-green-500 dark:text-gray-50'}`} />
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-50 font-medium">
                  {transaction.productName || transaction.description}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className={`text-sm font-medium ${isSpent ? 'text-red-600 dark:text-gray-50' : 'text-green-600 dark:text-gray-50'}`}>
                {isSpent ? '- ' : '+ '}
                {Math.abs(transaction.totalPrice)} τ
              </span>
              {transaction.quantity > 1 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Cantidad: {transaction.quantity}
                  </p>
              )}
            </div>
          </div>
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

const HomePage = () => {
  const { user } = useAuth();
  const { getStudentTransactions, loading: transactionsLoading, error: transactionsError } = useShopTransactions(user?.groupId);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (user?.uid) {
        try {
          const transactions = await getStudentTransactions(user.uid);
          setRecentTransactions(
              transactions
                  .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis())
                  .slice(0, 5)
          );
        } catch (error) {
          console.error("Error al cargar transacciones:", error);
        }
      }
    };

    loadTransactions();
  }, [user, getStudentTransactions]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                Bienvenido, {user?.name || "Estudiante"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tu lugar seguro, disruptivo y de alto impacto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <StatsCard
                icon={Star}
                title="Actividades Completadas"
                value={user?.completedActivities?.length || 0}
                description="Cantidad de actividades que haz realizado en total"
            />
            <StatsCard
                icon={Star}
                title="Turings Disponibles"
                value={user?.turingBalance || 0}
                description="Cantidad de Turings que tienes en este momento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
            <Link to="/scan" className="block">
              <ActionCard
                  icon={PlusCircle}
                  title="Registrar Nueva Actividad"
                  description="Documenta tus participaciones para ganar Turings"
              />
            </Link>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-gray-50 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 bg-gray-800 dark:bg-white rounded-2xl mr-4">
                  <Terminal className="w-6 h-6 text-gray-50 dark:text-black"/>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">Últimas Transacciones</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tus movimientos más recientes</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {transactionsLoading ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando transacciones...</div>
              ) : transactionsError ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    Error al cargar transacciones: {transactionsError}
                  </div>
              ) : recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction}/>
                  ))
              ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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