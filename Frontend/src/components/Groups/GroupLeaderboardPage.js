import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGroupDetails } from '../../hooks/UseGroupDetails';

const RankingCard = ({ position, username, turings }) => {
    const getMedalColor = (pos) => {
        switch (pos) {
            case 0: return 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-400';
            case 1: return 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-400';
            case 2: return 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-600';
            default: return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500';
        }
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-4 sm:p-5 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${getMedalColor(position)} text-white font-bold border`}>
                        {position + 1}
                    </div>
                    <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-900 truncate">{username}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium group-hover:bg-blue-100 transition-all duration-500 text-sm sm:text-base">
                        {turings} Turings
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform translate-x-0 group-hover:translate-x-1 transition-all duration-500" />
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white rounded-3xl border border-black p-4 sm:p-6 hover:shadow-lg transition-all duration-500">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">{value}</p>
        <p className="text-gray-500 text-xs sm:text-sm">{description}</p>
    </div>
);

const PuntajesPage = () => {
    const { groupId } = useParams();
    const { group, loading, error } = useGroupDetails(groupId);

    const stats = React.useMemo(() => {
        if (!group?.students?.length) return null;

        const sortedStudents = [...group.students]
            .sort((a, b) => (b.turingBalance || 0) - (a.turingBalance || 0))
            .slice(0, 5);

        const totalTurings = group.students.reduce(
            (acc, student) => acc + (student.turingBalance || 0),
            0
        );

        return {
            topUsers: sortedStudents,
            totalTurings,
            averageTurings: totalTurings / group.students.length,
            totalStudents: group.students.length
        };
    }, [group?.students]);

    if (loading || error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className={`text-center ${error ? 'text-red-600' : 'text-gray-600'}`}>
                    {loading ? 'Cargando datos...' :
                        error ? `Error: ${error}` :
                            'No hay datos disponibles'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                        Tabla de Clasificación
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg">
                        Los mejores recolectores de Turings
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <StatsCard
                        icon={(props) => (
                            <svg
                                {...props}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        )}
                        title="Total de Turings"
                        value={stats.totalTurings}
                        description="Turings en circulación"
                    />
                    <StatsCard
                        icon={(props) => (
                            <svg
                                {...props}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="20" x2="12" y2="10" />
                                <line x1="18" y1="20" x2="18" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="16" />
                            </svg>
                        )}
                        title="Promedio"
                        value={stats.averageTurings.toFixed(1)}
                        description="Turings por estudiante"
                    />
                    <StatsCard
                        icon={(props) => (
                            <svg
                                {...props}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        )}
                        title="Participantes"
                        value={stats.totalStudents}
                        description="Estudiantes activos"
                    />
                </div>

                {/* Ranking Section */}
                <div className="bg-white rounded-3xl border border-black shadow-sm p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-2xl sm:mr-4">
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Top 5 Turing Holders</h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">Los estudiantes con más Turings acumulados</p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {stats.topUsers.map((student, index) => (
                            <RankingCard
                                key={student.id || index}
                                position={index}
                                username={student.name || 'Sin nombre'}
                                turings={student.turingBalance || 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuntajesPage;