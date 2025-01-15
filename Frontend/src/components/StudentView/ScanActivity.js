import React, { useState, useEffect, useRef } from 'react';
import QrReader from 'react-qr-scanner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/authContext';
import useShopTransactions from '../../hooks/UseShopTransactions';

const ScanActivity = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [hasCamera, setHasCamera] = useState(false);
    const { user } = useAuth();
    const { recordActivityCompletion } = useShopTransactions(user?.groupId);
    const processingRef = useRef(false);
    const lastScannedRef = useRef(null);

    useEffect(() => {
        const checkCamera = async () => {
            try {
                if (!navigator?.mediaDevices?.getUserMedia) {
                    throw new Error('Tu navegador no soporta el acceso a la cámara. Por favor, usa un navegador más reciente.');
                }

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                setHasCamera(true);
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
                setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
                setHasCamera(false);
            }
        };

        checkCamera();
    }, []);

    const handleScan = async (data) => {
        // Si no hay datos o ya estamos procesando, ignorar
        if (!data || processingRef.current) return;

        try {
            const scannedData = JSON.parse(data.text);

            // Verificar si es el mismo QR escaneado en los últimos 5 segundos
            if (lastScannedRef.current === scannedData.activityId) {
                return;
            }

            // Marcar como procesando y guardar el ID
            processingRef.current = true;
            lastScannedRef.current = scannedData.activityId;
            setIsScanning(false); // Detener el escaneo inmediatamente

            const { activityId } = scannedData;

            const activityRef = doc(db, 'activities', activityId);
            const activitySnap = await getDoc(activityRef);

            if (!activitySnap.exists()) {
                throw new Error('Actividad no encontrada.');
            }

            const activity = activitySnap.data();

            if (activity.status !== 'active') {
                throw new Error('Esta actividad ya no acepta entregas.');
            }

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().completedActivities?.includes(activityId)) {
                throw new Error('Ya has completado esta actividad.');
            }

            const result = await recordActivityCompletion(
                activityId,
                user.uid,
                activity,
                activity.turingBalance
            );

            if (!result.success) {
                throw new Error(result.error || 'Error al registrar la actividad');
            }

            setScanResult(`¡Actividad registrada! Ganaste ${activity.turingBalance} τ.`);

            // Limpiar el ID escaneado después de 5 segundos
            setTimeout(() => {
                lastScannedRef.current = null;
            }, 5000);

        } catch (err) {
            setError(err.message);
        } finally {
            processingRef.current = false;
        }
    };

    const handleError = (err) => {
        console.error('Error al escanear:', err);
        setError('Error al escanear el código QR. Por favor, verifica los permisos de la cámara e intenta nuevamente.');
        setIsScanning(false);
        processingRef.current = false;
    };

    const resetScanner = () => {
        setError(null);
        setScanResult(null);
        setIsScanning(true);
        processingRef.current = false;
        lastScannedRef.current = null;
    };

    if (!hasCamera) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-black shadow-md p-6">
                    <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                        {error || 'No se detectó una cámara. Por favor, verifica los permisos y usa un dispositivo con cámara.'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-black p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Escanear Actividad</h1>
                {isScanning ? (
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <QrReader
                            delay={500} // Aumentado el delay
                            style={{ width: '100%' }}
                            onError={handleError}
                            onScan={handleScan}
                            constraints={{
                                video: { facingMode: 'environment' }
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center p-4">
                        {scanResult ? (
                            <div className="p-4 bg-green-100 text-green-800 rounded-lg">{scanResult}</div>
                        ) : (
                            <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
                        )}

                        <button
                            onClick={resetScanner}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {error ? 'Reintentar' : 'Escanear Otro QR'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanActivity;