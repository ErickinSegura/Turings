import React, { useState, useEffect, useRef } from 'react';
import QrReader from 'react-qr-scanner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/authContext';
import useShopTransactions from '../../hooks/UseShopTransactions';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const ScanActivity = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [hasCamera, setHasCamera] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuth();
    const { recordActivityCompletion } = useShopTransactions(user?.groupId);
    const processingRef = useRef(false);
    const lastScannedRef = useRef(null);

    useEffect(() => {
        const checkCamera = async () => {
            try {
                if (!navigator?.mediaDevices?.getUserMedia) {
                    throw new Error('Navegador no compatible con cámara');
                }
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                setHasCamera(true);
            } catch (err) {
                setError('Error al acceder a la cámara');
                setHasCamera(false);
            }
        };
        checkCamera();
    }, []);

    const handleScan = async (data) => {
        if (!data || processingRef.current) return;

        try {
            const scannedData = JSON.parse(data.text);
            if (!scannedData?.activityId) throw new Error('QR inválido');
            if (lastScannedRef.current === scannedData.activityId) return;

            processingRef.current = true;
            setIsProcessing(true);
            setError(null);
            setScanResult(null);
            lastScannedRef.current = scannedData.activityId;
            setIsScanning(false);

            const { activityId } = scannedData;
            const [activitySnap, userSnap] = await Promise.all([
                getDoc(doc(db, 'activities', activityId)),
                getDoc(doc(db, 'users', user.uid))
            ]);

            if (!activitySnap.exists()) throw new Error('Actividad no encontrada');

            const activity = activitySnap.data();
            const validationErrors = [];
            if (activity.status !== 'active') validationErrors.push('Actividad inactiva');
            if (userSnap.data()?.completedActivities?.includes(activityId)) validationErrors.push('Ya completada');

            if (validationErrors.length > 0) throw new Error(validationErrors.join(' • '));

            const result = await recordActivityCompletion(
                activityId,
                user.uid,
                activity,
                activity.turingBalance
            );

            if (!result.success) throw new Error(result.error || 'Error al registrar');
            setScanResult(`¡Registrada! +${activity.turingBalance}τ`);

        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => {
                processingRef.current = false;
                setIsProcessing(false);
            }, 500);
        }
    };

    const handleError = (err) => {
        setError('Error al escanear QR');
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

    const getResultContent = () => {
        if (isProcessing) {
            return (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <Loader2 className="w-12 h-12 text-gray-800 dark:text-gray-200 animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Validando...</p>
                </div>
            );
        }

        if (scanResult) {
            return (
                <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                    <div>
                        <p className="font-medium">{scanResult}</p>
                        <p className="text-sm mt-1">¡Buen trabajo!</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl">
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                    <div>
                        <p className="font-medium">{error}</p>
                        <p className="text-sm mt-1">Intenta escanear de nuevo</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (!hasCamera) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-8">
                        <div className="flex items-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl">
                            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                            <div>
                                <p className="font-medium">{error || 'Cámara no detectada'}</p>
                                <p className="text-sm mt-1">Verifica los permisos de cámara</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white dark:bg-black rounded-3xl border border-black dark:border-white p-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-8">
                        {isProcessing ? 'Validando...' : 'Escanear Actividad'}
                    </h1>

                    {isScanning ? (
                        <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300">
                            <QrReader
                                delay={300}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={handleError}
                                onScan={handleScan}
                                constraints={{
                                    video: {
                                        facingMode: 'environment',
                                        width: { ideal: 1280 },
                                        height: { ideal: 720 }
                                    }
                                }}
                            />
                            <div className="absolute inset-0 border-4 border-gray-800/20 rounded-2xl pointer-events-none" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {getResultContent()}

                            {!isProcessing && (
                                <button
                                    onClick={resetScanner}
                                    className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-900 dark:bg-gray-50 dark:hover:bg-gray-200
                                    text-gray-50 dark:text-gray-900 rounded-xl font-medium transition-colors duration-300"
                                >
                                    {error ? 'Reintentar escaneo' : 'Escanear otro código'}
                                </button>
                            )}
                        </div>
                    )}

                    {isScanning && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 text-center">
                            Enfoca el código QR dentro del área de escaneo
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanActivity;