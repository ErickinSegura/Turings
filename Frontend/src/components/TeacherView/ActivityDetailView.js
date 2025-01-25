import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { db } from '../../firebase';
import { Award, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const StatsCard = ({ icon: Icon, title, value, fullHeight, children }) => (
    <div className={`bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-6 ${fullHeight ? 'h-full' : ''}`}>
        <div className="flex items-center h-full">
            <div className="p-2 sm:p-3 bg-gray-800 dark:bg-white rounded-2xl mr-3 sm:mr-4 shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-50 dark:text-gray-800" />
            </div>
            <div className="min-w-0 w-full">
                {children || (
                    <>
                        <p className="text-gray-800 dark:text-gray-50 text-xs sm:text-sm truncate">{title}</p>
                        <div className="h-full flex flex-col justify-center">
                            <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-50 truncate">
                                {value}
                            </h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status, showIcon = true }) => {
    const isActive = status === 'active';
    const Icon = isActive ? Activity : AlertCircle;

    return (
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
            {showIcon && <Icon className="w-4 h-4 mr-2" />}
            <span className="font-medium">
                {isActive ? 'Actividad Activa' : 'Actividad Inactiva'}
            </span>
        </div>
    );
};

const QRSection = ({ qrData }) => (
    <div className="bg-white rounded-3xl border border-black dark:bg-black dark:border-white p-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-6">Código QR para registro de actividad</h3>
        <div className="bg-white p-4 inline-block rounded-3xl shadow-sm">
            <QRCode value={qrData} size={256} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 max-w-md mx-auto">
            Los estudiantes pueden escanear este código para registrar la actividad completada.
        </p>
    </div>
);

const ActivityDetailView = () => {
    const { activityId } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const isTeacher = user?.role === 'teacher' || user?.isTeacher;

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const activityRef = doc(db, 'activities', activityId);
                const activitySnap = await getDoc(activityRef);

                if (activitySnap.exists()) {
                    setActivity(activitySnap.data());
                } else {
                    setError('Actividad no encontrada.');
                }
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Error al cargar la actividad.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [activityId]);

    const handleDeactivate = async () => {
        try {
            const activityRef = doc(db, 'activities', activityId);
            await updateDoc(activityRef, {
                status: 'inactive',
            });
            setActivity((prev) => ({ ...prev, status: 'inactive' }));
        } catch (err) {
            console.error('Error deactivating activity:', err);
            setError('Error al desactivar la actividad.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black ">
                <div className="text-lg text-gray-600 dark:text-gray-500">Cargando datos de la actividad...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    const qrData = JSON.stringify({ activityId });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center mb-12">
                    <div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">{activity.title}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{activity.description}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <StatsCard
                        icon={Award}
                        title="Puntos Turing"
                        value={`${activity.turingBalance} τ`}
                    />

                    <StatsCard
                        icon={activity.status === 'active' ? Activity : AlertCircle}
                        fullHeight
                    >
                        <div className="flex items-center justify-between w-full">
                            <StatusBadge status={activity.status} />
                            {isTeacher && activity.status === 'active' && (
                                <button
                                    onClick={handleDeactivate}
                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-600 hover:bg-red-600 hover:text-red-50
                                  dark:bg-red-600 dark:text-red-50 dark:border dark:border-red-600 dark:hover:border-red-50 dark:hover:bg-red-50 dark:hover:text-red-600
                                     rounded-xl transition-colors duration-300"
                                >
                                    Desactivar
                                </button>
                            )}
                        </div>
                    </StatsCard>
                </div>

                {activity.status === 'active' && (
                    <QRSection qrData={qrData} />
                )}
            </div>
        </div>
    );
};

export default ActivityDetailView;