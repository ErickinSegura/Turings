import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useGroupDetails } from '../hooks/UseGroupDetails';
import {
    Users,
    Save,
    ArrowLeft,
    Clock,
    MapPin,
    Hash,
    Loader2,
    Search,
    AlertCircle,
    X,
    GraduationCap,
    Mail,
    Plus
} from 'lucide-react';

const Alert = ({ children, variant = "error" }) => {
    const variants = {
        error: "bg-red-50 text-red-800 border-red-200",
        success: "bg-green-50 text-green-800 border-green-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    };

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${variants[variant]}`}>
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div className="flex-1">{children}</div>
        </div>
    );
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
});

const GroupEditPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { group, loading, error } = useGroupDetails(groupId);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [notFoundStudents, setNotFoundStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        schedule: '',
        classroom: '',
    });

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || '',
                schedule: group.schedule || '',
                classroom: group.classroom || '',
            });
            setSelectedStudents(group.students || []);
            try {
                const scheduleArray = JSON.parse(group.schedule);
                setSelectedSchedule(scheduleArray);
            } catch {
                setSelectedSchedule([]);
            }
        }
    }, [group]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const searchStudents = async (query) => {
        if (query.length < 3) return;

        setSearchLoading(true);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef,
                where('role', '==', 'student'),
                where('email', '>=', query),
                where('email', '<=', query + '\uf8ff')
            );

            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                // Check if student is not already in the selected students
                if (!selectedStudents.some(s => s.id === doc.id)) {
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching students:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const addStudent = (student) => {
        setSelectedStudents(prev => [...prev, student]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeStudent = (studentId) => {
        setSelectedStudents(prev => prev.filter(student => student.id !== studentId));
    };

    const toggleTimeSlot = (day, hour) => {
        const timeSlot = `${day} ${hour}`;
        setSelectedSchedule(prev => {
            if (prev.includes(timeSlot)) {
                return prev.filter(slot => slot !== timeSlot);
            }
            return [...prev, timeSlot];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const groupRef = doc(db, 'groups', groupId);
            await updateDoc(groupRef, {
                ...formData,
                schedule: JSON.stringify(selectedSchedule),
                students: selectedStudents,
                studentIds: selectedStudents.map(student => student.id)
            });
            navigate(`/grupos/${groupId}`);
        } catch (error) {
            console.error('Error updating group:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-gray-600">Cargando datos del grupo...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(`/grupos/${groupId}`)}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver al grupo
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Editar Grupo {formData.name?.split('-')[1] || 'Sin número'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-3xl border border-black p-8">
                        <div className="flex items-center mb-8">
                            <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                                <Users className="w-6 h-6 text-gray-50" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Hash className="w-4 h-4 inline mr-2" />
                                    Nombre del Grupo
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    placeholder="Ej: Grupo-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Sala
                                </label>
                                <input
                                    type="text"
                                    name="classroom"
                                    value={formData.classroom}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    placeholder="Ej: Lab-101"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div className="bg-white rounded-3xl border border-black p-8">
                        <div className="flex items-center mb-8">
                            <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                                <Clock className="w-6 h-6 text-gray-50" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Horario</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="p-2 border text-left"></th>
                                    {HOURS.map(hour => (
                                        <th key={hour} className="p-2 border text-center text-sm">
                                            {hour}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {DAYS.map(day => (
                                    <tr key={day}>
                                        <td className="p-2 border font-medium">{day}</td>
                                        {HOURS.map(hour => (
                                            <td
                                                key={`${day}-${hour}`}
                                                className="p-2 border text-center"
                                                onClick={() => toggleTimeSlot(day, hour)}
                                            >
                                                <div
                                                    className={`w-full h-6 rounded cursor-pointer transition-colors ${
                                                        selectedSchedule.includes(`${day} ${hour}`)
                                                            ? 'bg-gray-800'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Students Card */}
                    <div className="bg-white rounded-3xl border border-black p-8">
                        <div className="flex items-center mb-8">
                            <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                                <GraduationCap className="w-6 h-6 text-gray-50" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Estudiantes</h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {selectedStudents.length} estudiantes en el grupo
                                </p>
                            </div>
                        </div>

                        {/* Search Students */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        searchStudents(e.target.value);
                                    }}
                                    className="w-full px-4 py-3 pl-10 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    placeholder="Buscar estudiantes por correo..."
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>

                            {/* Search Results */}
                            {searchQuery.length >= 3 && searchResults.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {searchResults.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => addStudent(student)}
                                            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:border-gray-300"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-gray-100 rounded-xl">
                                                    <GraduationCap className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span>{student.email}</span>
                                            </div>
                                            <Plus className="w-4 h-4 text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Students List */}
                        <div className="space-y-2">
                            {selectedStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-800 rounded-xl">
                                            <GraduationCap className="w-4 h-4 text-gray-50" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{student.name || 'Sin nombre'}</p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Mail className="w-4 h-4 mr-1" />
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeStudent(student.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {notFoundStudents.length > 0 && (
                            <Alert variant="warning" className="mt-4">
                                No se encontraron {notFoundStudents.length} estudiantes:
                                {notFoundStudents.map((id, index) => (
                                    <span key={index} className="block text-sm text-gray-500">{id}</span>
                                ))}
                            </Alert>
                        )}
                    </div>



                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-gray-800 text-white px-6 py-4 rounded-3xl hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? 'Guardando cambios...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupEditPage;