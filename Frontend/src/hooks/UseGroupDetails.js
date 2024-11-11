export const useGroupDetails = (groupId) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        setError('ID de grupo no proporcionado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch group document
        const groupRef = doc(db, 'groups', groupId);
        const groupDoc = await getDoc(groupRef);

        if (!groupDoc.exists()) {
          setError('Grupo no encontrado');
          setLoading(false);
          return;
        }

        const groupData = { ...groupDoc.data(), id: groupDoc.id };

        // Si no hay studentIds, devolver grupo con array vacío
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
          students: studentsData.filter(Boolean)
        });
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return { group, loading, error };
};