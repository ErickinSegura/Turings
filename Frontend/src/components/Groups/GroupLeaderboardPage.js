import React from 'react';
import { useParams } from 'react-router-dom';
import { useGroupDetails } from '../../hooks/UseGroupDetails';
import { Trophy, Star, Users } from 'lucide-react';

const StatsCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white rounded-3xl border border-black p-6 hover:shadow-lg transition-all duration-500">
        <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gray-700 rounded-xl">
                <Icon className="w-6 h-6 text-gray-50" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
        <p className="text-gray-500 text-sm">{description}</p>
    </div>
);


const PodiumPosition = ({ player, place }) => {
    const heights = {
        1: 'h-56',
        2: 'h-44',
        3: 'h-36'
    };

    const colors = {
        1: 'from-yellow-400 to-yellow-500',
        2: 'from-gray-300 to-gray-400',
        3: 'from-amber-500 to-amber-600'
    };

    return (
        <div className="flex flex-col items-center relative pt-20">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors[place]} flex items-center justify-center `}>
                    <span className="text-white text-xl font-bold">#{place || '?'}</span>
                </div>
                <span className="font-semibold text-gray-900 text-center max-w-[100px] truncate text-sm p-1">
                    {player?.name || 'Sin nombre'}
                </span>
                <span className="text-gray-900 font-medium text-sm">
                    {player?.turingBalance || 0} τ
                </span>
            </div>
            {/* Podium Platform */}
            <div className={`w-24 ${heights[place]} bg-gradient-to-br ${colors[place]} rounded-t-lg mt-4`}/>
        </div>
    );
};

const PuntajesPage = () => {
    const { groupId } = useParams();
    const { group, loading, error } = useGroupDetails(groupId);

    const stats = React.useMemo(() => {
        if (!group?.students?.length) return null;

        const sortedStudents = [...group.students]
            .sort((a, b) => (b.turingBalance || 0) - (a.turingBalance || 0));

        const totalTurings = sortedStudents.reduce(
            (acc, student) => acc + (student.turingBalance || 0),
            0
        );

        return {
            topUsers: sortedStudents,
            totalTurings,
            averageTurings: totalTurings / sortedStudents.length,
            totalStudents: sortedStudents.length
        };
    }, [group?.students]);

    if (loading || error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className={`text-xl font-semibold ${error ? 'text-red-600' : 'text-gray-600'}`}>
                    {loading ? 'Cargando datos...' :
                        error ? `Error: ${error}` :
                            'No hay datos disponibles'}
                </div>
            </div>
        );
    }

    const podiumOrder = [2, 1, 3]; // Silver, Gold, Bronze

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-3 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Tabla de mejores posiciones
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Los maestros de los Turings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatsCard
                        icon={Trophy}
                        title="Total Turings"
                        value={stats.totalTurings}
                        description="Turings acumulados en el grupo"
                    />
                    <StatsCard
                        icon={Star}
                        title="Promedio"
                        value={stats.averageTurings.toFixed(1)}
                        description="Promedio de Turings por estudiante"
                    />
                    <StatsCard
                        icon={Users}
                        title="Participantes"
                        value={stats.totalStudents}
                        description="Total de estudiantes en el grupo"
                    />
                </div>

                {/* Podium Section - Added significant top padding */}
                <div className="bg-white rounded-3xl border border-black p-8 pt-24 mb-8"> {/* Increased top padding */}
                    {/* Podium */}
                    <div className="flex justify-center items-end gap-4 h-72 mb-8">
                        {podiumOrder.map((position) => (
                            <PodiumPosition
                                key={position}
                                place={position}
                                player={stats.topUsers[position - 1]}
                            />
                        ))}
                    </div>

                    {/* Remaining Players */}
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-3">
                            {stats.topUsers.slice(3, 5).map((player, index) => (
                                <div
                                    key={player.id || index}
                                    className="group bg-white rounded-2xl overflow-hidden p-4 border border-black"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-50 font-semibold">
                                                {index + 4}
                                            </div>
                                            <span className="font-medium text-gray-900">{player.name}</span>
                                        </div>
                                        <span className="text-black font-medium">{player.turingBalance} τ</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuntajesPage;