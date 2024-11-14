import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useGroupDetails(groupId) {
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

    return { group, loading, error };
}