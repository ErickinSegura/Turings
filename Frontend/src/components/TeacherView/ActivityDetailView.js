import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { db } from '../../firebase';
import { ArrowLeft, Calendar, Award, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const StatsCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white rounded-3xl border border-black p-6">
        <div className="flex items-center space-x-3 mb-1">
            <Icon className="w-5 h-5 text-gray-600" />
            <p className="text-gray-500 text-sm">{title}</p>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 ml-8">{value}</h3>
    </div>
);

const StatusBadge = ({ status }) => {
    const isActive = status === 'active';
    const Icon = isActive ? Activity : AlertCircle;

    return (
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
            <Icon className="w-4 h-4 mr-2" />
            <span className="font-medium">
        {isActive ? 'Actividad Activa' : 'Actividad Inactiva'}
      </span>
        </div>
    );
};

const QRSection = ({ qrData }) => (
    <div className="bg-white rounded-3xl border border-black p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Código QR para Registro</h3>
        <div className="bg-white p-4 inline-block rounded-3xl shadow-sm">
            <QRCode value={qrData} size={256} />
        </div>
        <p className="text-gray-500 text-sm mt-6 max-w-md mx-auto">
            Los estudiantes pueden escanear este código para registrar la actividad completada.
        </p>
    </div>
);

const ActivityDetailView = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center text-gray-500">Cargando actividad...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    const qrData = JSON.stringify({ activityId });
    const formattedDate = activity.dueDate
        ? new Date(activity.dueDate).toLocaleDateString()
        : 'No definida';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            {activity.title}
                        </h1>
                        <p className="text-gray-500 text-lg">
                            {activity.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <StatsCard
                        icon={Award}
                        title="Puntos Turing"
                        value={`${activity.turingBalance} τ`}
                    />
                    <div className="bg-white rounded-3xl border border-black p-6 flex items-center justify-between">
                        <StatusBadge status={activity.status} />
                        {isTeacher && activity.status === 'active' && (
                            <button
                                onClick={handleDeactivate}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300"
                            >
                                Desactivar
                            </button>
                        )}
                    </div>
                </div>

                {activity.status === 'active' && (
                    <QRSection qrData={qrData} />
                )}
            </div>
        </div>
    );
};

export default ActivityDetailView;