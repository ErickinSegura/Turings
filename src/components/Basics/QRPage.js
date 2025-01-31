import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import QrReader from 'react-qr-scanner';

const QRPage = () => {
  const [qrValue, setQrValue] = useState('https://example.com');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('No hay resultado');
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar permisos de cámara al montar el componente
    if (isScanning) {
      checkCameraPermission();
    }
  }, [isScanning]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasPermission(true);
      // Importante: liberar el stream después de verificar
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError('Error al acceder a la cámara: ' + err.message);
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const handleScan = (data) => {
    if (data) {
      setScanResult(data?.text || 'No se pudo leer el código');
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    setError(err.message);
    console.error(err);
    setIsScanning(false);
  };

  const toggleScanner = () => {
    if (!isScanning) {
      setError(null);
      setScanResult('No hay resultado');
    }
    setIsScanning(!isScanning);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4">
      {/* Sección del Generador QR */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Generador QR</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrValue}
              viewBox="0 0 256 256"
            />
          </div>
          <input
            type="text"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Ingresa URL o texto para el código QR"
          />
        </div>
      </div>

      {/* Sección del Escáner QR */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Escáner QR</h2>
        <div className="flex flex-col gap-4">
          <button 
            onClick={toggleScanner}
            className={`w-full p-2 rounded-md text-white transition-colors ${
              isScanning 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isScanning ? 'Detener Escáner' : 'Iniciar Escáner'}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isScanning && hasPermission && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <QrReader
                delay={300}
                style={{ width: '100%' }}
                onError={handleError}
                onScan={handleScan}
                constraints={{
                  video: {
                    facingMode: "environment"
                  }
                }}
              />
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Resultado del escaneo:</p>
            <p className="break-all">{scanResult}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;