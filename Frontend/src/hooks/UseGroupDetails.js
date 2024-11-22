import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export function useGroupDetails(groupId) {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deactivateGroup = async () => {
        if (!group || !groupId) {
            setError('No hay grupo para desactivar');
            return;
        }

        setLoading(true);
        const batch = writeBatch(db);

        try {
            // Actualizar el estado del grupo
            const groupRef = doc(db, 'groups', groupId);
            batch.update(groupRef, {
                isActive: false,
                deactivatedAt: new Date(),
            });

            // Actualizar cada estudiante
            await Promise.all(
                group.students.map(student => {
                    const studentRef = doc(db, 'users', student.id);
                    batch.update(studentRef, {
                        groupId: null, // Eliminar la asignación del grupo
                        turingBalance: 0, // Resetear los turings a 0
                    });
                })
            );

            // Ejecutar todas las actualizaciones
            await batch.commit();

            // Actualizar el estado local
            setGroup(prevGroup => ({
                ...prevGroup,
                isActive: false,
                students: prevGroup.students.map(student => ({
                    ...student,
                    groupId: null,
                    turingBalance: 0,
                })),
            }));

        } catch (err) {
            console.error('Error al desactivar el grupo:', err);
            setError('Error al desactivar el grupo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!groupId) {
            setError('ID de grupo no proporcionado');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const fetchGroupDetails = async () => {
            try {
                // Fetch group data
                const groupRef = doc(db, 'groups', groupId);
                const groupDoc = await getDoc(groupRef);

                if (!groupDoc.exists()) {
                    setError('Grupo no encontrado');
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

                // Fetch students data
                const studentsData = await Promise.all(
                    (groupData.studentIds || []).map(async (studentId) => {
                        const studentDoc = await getDoc(doc(db, 'users', studentId));
                        return studentDoc.exists() ? { id: studentDoc.id, ...studentDoc.data() } : null;
                    })
                );

                // Fetch activities data
                const activitiesQuery = query(
                    collection(db, 'activities'),
                    where('groupId', '==', groupId)
                );
                const activitiesSnapshot = await getDocs(activitiesQuery);
                const activitiesData = activitiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setGroup({
                    id: groupDoc.id,
                    ...groupData,
                    students: studentsData.filter(Boolean),
                    activities: activitiesData
                });
            } catch (err) {
                console.error('Error fetching group details:', err);
                setError('Error al cargar los datos del grupo');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    return { group, loading, error, deactivateGroup };
}