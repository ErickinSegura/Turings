import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { db } from '../../firebase';
import { ArrowLeft } from 'lucide-react';

const CreateActivity = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null); // Para almacenar el QR

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    turingBalance: 0,
    maxParticipants: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'turingBalance' || name === 'maxParticipants' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear nuevo documento de actividad
      const activityData = {
        ...formData,
        groupId,
        createdAt: serverTimestamp(),
        status: 'active',
      };

      const activityRef = await addDoc(collection(db, 'activities'), activityData);

      // Actualizar el grupo con la referencia de la nueva actividad
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        activityIds: arrayUnion(activityRef.id),
      });

      // Redirigir a la página de detalles de la actividad
      navigate(`/actividades/${activityRef.id}`);
    } catch (err) {
      console.error('Error creating activity:', err);
      setError('Error al crear la actividad');
    } finally {
      setLoading(false);
    }
  };


  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nueva Actividad</h1>
              <p className="text-gray-500 text-lg mt-1">Crea una nueva actividad para el grupo</p>
            </div>
          </div>

          {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
          )}

          {qrData ? (
              <div className="bg-white rounded-3xl border border-black shadow-sm p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Código QR Generado</h2>
                <QRCode value={qrData} size={256} />
                <p className="text-gray-500 mt-4">
                  Escanea este código para acceder a la actividad recién creada.
                </p>
                <p className="text-gray-600 mt-2">Redirigiendo a la página del grupo...</p>
              </div>
          ) : (
              <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Turings a Otorgar</label>
                      <input
                          type="number"
                          name="turingBalance"
                          value={formData.turingBalance}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Participantes</label>
                      <input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creando...' : 'Crear Actividad'}
                    </button>
                  </div>
                </form>
              </div>
          )}
        </div>
      </div>
  );
};

export default CreateActivity;
