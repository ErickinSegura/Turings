import React, {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Clock, Search, Users, Plus, Terminal, UserPlus, UserMinus } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const SectionCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-white rounded-3xl overflow-hidden border border-black dark:bg-black dark:border-white shadow-sm p-8 mb-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gray-800 dark:bg-gray-50 rounded-2xl mr-4">
          <Icon className="w-6 h-6 text-gray-50 dark:text-gray-800" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
);

const EditGroupForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    classroom: '',
    studentIds: []
  });
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupRef = doc(db, 'groups', groupId);
        const groupDoc = await getDoc(groupRef);
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          setFormData({
            name: groupData.name || '',
            classroom: groupData.classroom || '',
            studentIds: groupData.studentIds || []
          });
          try {
            setSelectedSchedule(JSON.parse(groupData.schedule) || []);
          } catch {
            setSelectedSchedule([]);
          }
          const studentPromises = (groupData.studentIds || []).map(async (studentId) => {
            const studentDoc = await getDoc(doc(db, 'users', studentId));
            return studentDoc.exists() ? { id: studentDoc.id, ...studentDoc.data() } : null;
          });
          setSelectedStudents((await Promise.all(studentPromises)).filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableStudents = async () => {
      try {
        const studentsRef = collection(db, 'users');
        const studentsSnapshot = await getDocs(studentsRef);
        setAvailableStudents(studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchGroupData();
    fetchAvailableStudents();
  }, [groupId]);

  const getTimeSlotKey = (day, hour) => `${day} ${hour}`;

  const toggleTimeSlot = (day, hour) => {
    const timeSlot = getTimeSlotKey(day, hour);
    setSelectedSchedule((prev) =>
        prev.includes(timeSlot) ? prev.filter((slot) => slot !== timeSlot) : [...prev, timeSlot]
    );
  };

  const handleMouseDown = (day, hour) => {
    const timeSlot = getTimeSlotKey(day, hour);
    isDragging.current = true;
    setIsSelecting(!selectedSchedule.includes(timeSlot));
    setSelectionStart(timeSlot);
    toggleTimeSlot(day, hour);
  };

  const handleMouseEnter = (day, hour) => {
    if (isDragging.current) {
      const [startDay, startHour] = selectionStart.split(' ');

      if (startDay === day) {
        const startIndex = HOURS.indexOf(startHour);
        const currentIndex = HOURS.indexOf(hour);
        const start = Math.min(startIndex, currentIndex);
        const end = Math.max(startIndex, currentIndex);

        const newSchedule = selectedSchedule.filter(slot => !slot.startsWith(day));

        for (let i = start; i <= end; i++) {
          const currentSlot = getTimeSlotKey(day, HOURS[i]);
          if (isSelecting) {
            newSchedule.push(currentSlot);
          }
        }

        setSelectedSchedule(newSchedule);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(prev => [...prev, student]);
      setFormData(prev => ({ ...prev, studentIds: [...prev.studentIds, student.id] }));
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== studentId));
    setFormData(prev => ({ ...prev, studentIds: prev.studentIds.filter(id => id !== studentId) }));
  };

  const filteredStudents = availableStudents.filter(student =>
      !selectedStudents.find(s => s.id === student.id) &&
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus(null);

    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);
      const currentStudentIds = groupDoc.exists() ? (groupDoc.data().studentIds || []) : [];

      const studentsToAdd = formData.studentIds.filter(id => !currentStudentIds.includes(id));
      const studentsToRemove = currentStudentIds.filter(id => !formData.studentIds.includes(id));

      await updateDoc(groupRef, {
        ...formData,
        schedule: JSON.stringify(selectedSchedule),
      });

      // Actualizar groupId para nuevos estudiantes
      for (const studentId of studentsToAdd) {
        const studentRef = doc(db, 'users', studentId);
        await updateDoc(studentRef, {
          groupId: groupId
        });
      }

      for (const studentId of studentsToRemove) {
        const studentRef = doc(db, 'users', studentId);
        await updateDoc(studentRef, {
          groupId: ""
        });
      }

      setSaveStatus('Grupo actualizado exitosamente');
      navigate(`/grupos/${groupId}`);
    } catch (err) {
      console.error('Error updating group:', err);
      setSaveStatus('Error al actualizar el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                Editar Grupo
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Gestiona la información y estudiantes del grupo
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <SectionCard
                icon={Terminal}
                title="Información Básica"
                description="Datos generales del grupo"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-50 mb-2">
                    Nombre del Grupo
                  </label>
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-black dark:bg-black text-gray-800 dark:text-gray-100 dark:border-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 rounded-xl "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-50 mb-2">
                    Sala
                  </label>
                  <input
                      type="text"
                      name="classroom"
                      value={formData.classroom}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-black dark:bg-black text-gray-800 dark:text-gray-100 dark:border-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 rounded-xl "
                  />
                </div>
              </div>
            </SectionCard>

            {/* Horario */}
            <SectionCard
                icon={Clock}
                title="Horario de Clases"
                description="Selecciona los horarios asignados"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                  <tr>
                    <th className="p-2 border-b-2 border-black dark:border-white"></th>
                    {HOURS.map((hour) => (
                        <th key={hour} className="p-2 text-sm dark:text-gray-50 text-center border-b-2 border-black dark:border-white">
                          {hour}
                        </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {DAYS.map((day) => (
                      <tr key={day}>
                        <td className="p-2 font-semibold dark:text-gray-50">{day}</td>
                        {HOURS.map((hour, hourIndex) => {
                          const isSelected = selectedSchedule.includes(`${day} ${hour}`);
                          const nextHourSelected = hourIndex < HOURS.length - 1 &&
                              selectedSchedule.includes(`${day} ${HOURS[hourIndex + 1]}`);
                          const prevHourSelected = hourIndex > 0 &&
                              selectedSchedule.includes(`${day} ${HOURS[hourIndex - 1]}`);

                          return (
                              <td
                                  key={`${day}-${hour}`}
                                  className={`p-2 cursor-pointer text-center transition-all duration-200
                  ${isSelected ? 'bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                  ${isSelected && nextHourSelected ? 'rounded-r-none' : ''}
                  ${isSelected && prevHourSelected ? 'rounded-l-none' : ''}
                  ${isSelected && !nextHourSelected && !prevHourSelected ? 'rounded-xl' : ''}
                  ${isSelected && prevHourSelected && nextHourSelected ? '' : ''}
                  ${isSelected && prevHourSelected && !nextHourSelected ? 'rounded-r-xl' : ''}
                  ${isSelected && !prevHourSelected && nextHourSelected ? 'rounded-l-xl' : ''}`}
                                  onMouseDown={() => handleMouseDown(day, hour)}
                                  onMouseEnter={() => handleMouseEnter(day, hour)}
                                  onMouseUp={handleMouseUp}
                              />
                          );
                        })}
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Estudiantes */}
            <SectionCard
                icon={Users}
                title="Estudiantes"
                description="Gestiona los estudiantes del grupo"
            >
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                      type="button"
                      onClick={() => setShowStudentSelector(!showStudentSelector)}
                      className="p-2 bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <UserPlus className="w-5 h-5"/>
                    <span>Agregar Estudiante</span>
                  </button>
                </div>

                {showStudentSelector && (
                    <div className="rounded-xl p-4">
                      <div className="flex items-center mb-4">
                        <Search className="w-5 h-5 text-gray-800 dark:text-gray-50 mr-2"/>
                        <input
                            type="text"
                            placeholder="Buscar estudiantes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-black dark:bg-black text-gray-800 dark:text-gray-100 dark:border-white focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 rounded-xl "
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => handleAddStudent(student)}
                                className="flex items-center justify-between p-3 rounded-xl cursor-pointer border-black dark:border-white"
                            >
                              <span className="font-medium dark:text-gray-50">{student.name}</span>
                              <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedStudents.map((student) => (
                      <div
                          key={student.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-black dark:border-white"
                      >
                        <span className="font-medium dark:text-gray-50">{student.name || 'Sin nombre'}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveStudent(student.id)}
                            className="text-red-500 hover:text-red-600 transition-all duration-200"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Botón de Guardar */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>

            {saveStatus && (
                <div className={`text-center p-4 rounded-xl ${
                    saveStatus.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {saveStatus}
                </div>
            )}
          </form>
        </div>
      </div>
  );
};

export default EditGroupForm;