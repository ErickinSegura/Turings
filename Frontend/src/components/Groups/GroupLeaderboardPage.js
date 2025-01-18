import React from 'react';
import { useParams } from 'react-router-dom';
import { useGroupDetails } from '../../hooks/UseGroupDetails';
import { Trophy, Star, Medal } from 'lucide-react';
import {useAuth} from "../../context/authContext";

const StatsCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white border-black dark:bg-black dark:border-white rounded-3xl border p-6">
        <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gray-800 dark:bg-gray-50 rounded-xl">
                <Icon className="w-6 h-6 text-gray-50 dark:text-gray-800" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 ">{title}</h3>
        </div>
        <p className="text-3xl font-semibold text-gray-800 dark:text-gray-50 mb-2">{value}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
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
                <span className="font-semibold text-gray-800 dark:text-gray-50 text-center max-w-[100px] truncate text-sm p-1">
                    {player?.name || 'Sin nombre'}
                </span>
                <span className="text-gray-800 dark:text-gray-50 font-medium text-sm">
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
    const { group, loading: groupLoading, error } = useGroupDetails(groupId);
    const { user } = useAuth();

    const stats = React.useMemo(() => {
        if (!group?.students?.length) return null;

        const sortedStudents = [...group.students]
            .sort((a, b) => (b.turingBalance || 0) - (a.turingBalance || 0));

        const totalTurings = sortedStudents.reduce(
            (acc, student) => acc + (student.turingBalance || 0),
            0
        );

        const userPosition = sortedStudents.findIndex(student => student.uid === user?.uid) + 1;

        return {
            topUsers: sortedStudents,
            totalTurings,
            averageTurings: totalTurings / sortedStudents.length,
            userPosition: userPosition || '-',
            totalStudents: sortedStudents.length
        };
    }, [group?.students, user?.uid]);

    if (groupLoading || error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
                <div className={`text-xl ${error ? 'text-red-600' : ' text-gray-500 dark:text-gray-400'}`}>
                    {groupLoading ? 'Cargando datos...' :
                        error ? `Error: ${error}` :
                            'No hay datos disponibles'}
                </div>
            </div>
        );
    }

    const podiumOrder = [2, 1, 3];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-50 mb-2 sm:mb-3">
                        Tabla de mejores posiciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                        Los maestros de los Turings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pt-8">
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
                        icon={Medal}
                        title="Tu posición"
                        value={`#${stats.userPosition}`}
                        description={`de ${stats.totalStudents} participantes`}
                    />
                </div>

                <div className="bg-white border-black dark:bg-black dark:border-white rounded-3xl border p-8 pt-24 mb-8">
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
                                    key={player.uid || index}
                                    className="group bg-white border-black dark:bg-black dark:border-white rounded-2xl overflow-hidden p-4 border"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800 font-semibold">
                                                {index + 4}
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-gray-50">{player.name}</span>
                                        </div>
                                        <span className="text-gray-800 dark:text-gray-50 font-medium">{player.turingBalance} τ</span>
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