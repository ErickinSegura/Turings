import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useGroupDetails = (groupId) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      setError('ID de grupo no proporcionado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Crear una referencia al documento del grupo
    const groupRef = doc(db, 'groups', groupId);

    // Suscribirse a cambios en tiempo real del grupo
    const unsubscribe = onSnapshot(groupRef,
        async (groupDoc) => {
          if (!groupDoc.exists()) {
            setError('Grupo no encontrado');
            setLoading(false);
            return;
          }

          const groupData = { id: groupDoc.id, ...groupDoc.data() };

          // Si no hay studentIds, establecer un array vacío
          if (!groupData.studentIds?.length) {
            setGroup({
              ...groupData,
              students: []
            });
            setLoading(false);
            return;
          }

          try {
            // Obtener datos de estudiantes
            const studentsData = await Promise.all(
                groupData.studentIds.map(async (studentId) => {
                  try {
                    const studentDoc = await getDoc(doc(db, 'users', studentId));
                    if (!studentDoc.exists()) return null;
                    return {
                      id: studentDoc.id,
                      ...studentDoc.data()
                    };
                  } catch (err) {
                    console.error(`Error fetching student ${studentId}:`, err);
                    return null;
                  }
                })
            );

            setGroup({
              ...groupData,
              students: studentsData.filter(Boolean) // Eliminar nulls
            });
          } catch (err) {
            console.error('Error fetching students:', err);
            setError('Error al cargar los estudiantes');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error in group subscription:', err);
          setError(err.message);
          setLoading(false);
        }
    );

    // Limpiar suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [groupId]);

  return { group, loading, error };
};