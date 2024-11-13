import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Save, Clock, Search, Users, Plus, X, UserPlus, UserMinus } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, '0')}:00`;
});

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

  const toggleTimeSlot = (day, hour) => {
    const timeSlot = `${day} ${hour}`;
    setSelectedSchedule((prev) =>
        prev.includes(timeSlot) ? prev.filter((slot) => slot !== timeSlot) : [...prev, timeSlot]
    );
  };

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
      await updateDoc(groupRef, {
        ...formData,
        schedule: JSON.stringify(selectedSchedule),
      });
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-3xl p-6">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Editar Grupo</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Info */}
            <div className="bg-white p-6 rounded-xl shadow">
              <label className="block text-sm font-medium mb-2">Nombre del Grupo</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
              />
              <label className="block text-sm font-medium mt-4 mb-2">Sala</label>
              <input
                  type="text"
                  name="classroom"
                  value={formData.classroom}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Schedule Selector */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">Horario de clases</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                  <tr>
                    <th className="p-2"></th>
                    {HOURS.map((hour) => (
                        <th key={hour} className="p-2 text-sm text-center border">{hour}</th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {DAYS.map((day) => (
                      <tr key={day}>
                        <td className="p-2 font-semibold border">{day}</td>
                        {HOURS.map((hour) => (
                            <td
                                key={`${day}-${hour}`}
                                className={`p-2 cursor-pointer text-center border ${
                                    selectedSchedule.includes(`${day} ${hour}`)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => toggleTimeSlot(day, hour)}
                            />
                        ))}
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Students Section */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-4">
                <Users className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">Estudiantes</h2>
                <button
                    type="button"
                    onClick={() => setShowStudentSelector(!showStudentSelector)}
                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
              {showStudentSelector && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Search className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                          type="text"
                          placeholder="Buscar estudiantes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {filteredStudents.map((student) => (
                          <div
                              key={student.id}
                              onClick={() => handleAddStudent(student)}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <span>{student.name}</span>
                            <Plus className="w-4 h-4" />
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Selected Students */}
              <div className="space-y-2">
                {selectedStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                      <span>{student.name || 'Sin nombre'}</span>
                      <button onClick={() => handleRemoveStudent(student.id)} className="text-red-500">
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              <Save className="w-5 h-5 mr-2 inline" />
              Guardar Cambios
            </button>

            {saveStatus && <div className="mt-4 text-center text-sm">{saveStatus}</div>}
          </form>
        </div>
      </div>
  );
};

export default EditGroupForm;
