import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { db } from '../../firebase';

const CreateActivity = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrData] = useState(null);

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
      [name]: name === 'turingBalance' || name === 'maxParticipants' ? parseInt(value) || 1 : value,
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
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-50 mb-2 sm:mb-3">Nueva Actividad</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Crea una nueva actividad para el grupo</p>
            </div>
          </div>

          {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
          )}

          <div className="bg-white dark:bg-black border-black dark:border-gray-50 rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300 relative p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xl font-medium text-gray-800 dark:text-gray-50 mb-2">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 text-gray-800 dark:text-gray-100"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-xl font-medium text-gray-800 dark:text-gray-50 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 text-gray-800 dark:text-gray-100"
                        required
                    />
                  </div>


                    <div>
                      <label className="block text-xl font-medium text-gray-800 dark:text-gray-50 mb-2">Turings a Otorgar</label>
                      <input
                          type="number"
                          name="turingBalance"
                          value={formData.turingBalance}
                          onChange={handleInputChange}
                          min="1"
                          placeholder="1"
                          className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 text-gray-800 dark:text-gray-100"
                          required
                      />
                    </div>
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border rounded-xl bg-red-50 text-red-600 border-red-600 hover:bg-red-600 hover:text-red-50
                                                                dark:bg-red-600 dark:text-red-50 dark:border dark:border-red-600 dark:hover:border-red-50 dark:hover:bg-red-50 dark:hover:text-red-600"
                    >
                      Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50"                    >
                      {loading ? 'Creando...' : 'Crear Actividad'}
                    </button>
                  </div>
                </form>
              </div>
          )
        </div>
      </div>
  );
};

export default CreateActivity;
