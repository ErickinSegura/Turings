const GroupDetailContainer = () => {
  const { groupId } = useParams();
  const { group, loading, error } = useGroupDetails(groupId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Solo mostrar el mensaje de no encontrado si no hay grupo y no hay error
  if (!group && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Grupo no encontrado</div>
      </div>
    );
  }

  return <GroupDetailView group={group} />;
};