import React from 'react';
import { useParams } from 'react-router-dom';
import { useGroupDetails } from '../hooks/UseGroupDetails';
import GroupShop from '../components/GroupShop';

const GroupShopPage = () => {
    const { groupId } = useParams();
    const { loading, error } = useGroupDetails(groupId);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
            <GroupShop groupId={groupId} />
    );
};

export default GroupShopPage;