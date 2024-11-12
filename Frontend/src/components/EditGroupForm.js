import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Save, Trash2, Search, UserPlus, UserMinus, UsersRound } from 'lucide-react';

const EditGroupForm = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    schedule: '',
    classroom: '',
    subject: '',
    studentIds: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentSelector, setShowStudentSelector] = useState(false);

  // Fetch effects remain the same...
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, 'users');
        const studentsSnapshot = await getDocs(studentsRef);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableStudents(studentsData);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupRef = doc(db, 'groups', groupId);
        const groupDoc = await getDoc(groupRef);
        
        if (!groupDoc.exists()) {
          setError('Grupo no encontrado');
          return;
        }
        
        const groupData = groupDoc.data();
        setFormData({
          name: groupData.name || '',
          schedule: groupData.schedule || '',
          classroom: groupData.classroom || '',
          subject: groupData.subject || '',
          studentIds: groupData.studentIds || []
        });
        
        const selectedStudentsData = await Promise.all(
          (groupData.studentIds || []).map(async (studentId) => {
            const studentDoc = await getDoc(doc(db, 'users', studentId));
            return studentDoc.exists() ? { id: studentDoc.id, ...studentDoc.data() } : null;
          })
        );
        setSelectedStudents(selectedStudentsData.filter(Boolean));
      } catch (err) {
        setError('Error al cargar los datos del grupo');
        console.error('Error fetching group:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [groupId]);

  // Handlers remain the same...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(prev => [...prev, student]);
      setFormData(prev => ({
        ...prev,
        studentIds: [...prev.studentIds, student.id]
      }));
    }
  };
  
  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== studentId));
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.filter(id => id !== studentId)
    }));
  };
  
  const filteredStudents = availableStudents.filter(student => 
    !selectedStudents.find(s => s.id === student.id) &&
    (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus({ type: '', message: '' });
    
    try {
      const groupRef = doc(db, 'groups', groupId);
      
      await updateDoc(groupRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      setSaveStatus({
        type: 'success',
        message: 'Grupo actualizado exitosamente'
      });
      
      setTimeout(() => {
        navigate(`/grupos/${groupId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating group:', err);
      setSaveStatus({
        type: 'error',
        message: 'Error al actualizar el grupo'
      });
    } finally {
      setLoading(false);
    }
  };

  const StudentSelector = () => (
    <div className="mt-6 bg-white rounded-3xl border border-black p-6">
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all duration-300"
        />
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-300"
            onClick={() => handleAddStudent(student)}
          >
            <div>
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-gray-500">{student.email}</div>
            </div>
            <UserPlus className="w-5 h-5 text-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading && !formData.name) {
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
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-3 hover:bg-white rounded-2xl transition-all duration-500 group border border-transparent hover:border-black"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Editar Grupo
            </h1>
            <p className="text-gray-500 text-lg mt-1">
              Actualiza la información y estudiantes del grupo
            </p>
          </div>
        </div>
        
        {saveStatus.message && (
          <div className={`mb-6 p-6 rounded-3xl border ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {saveStatus.message}
          </div>
        )}
        
        <div className="bg-white rounded-3xl border border-black shadow-sm transition-all duration-500 hover:shadow-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                  Horario
                </label>
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all duration-300"
                  placeholder="ej: Lunes y Miércoles 10:00 - 11:30"
                />
              </div>
              
              <div>
                <label htmlFor="classroom" className="block text-sm font-medium text-gray-700 mb-2">
                  Sala
                </label>
                <input
                  type="text"
                  id="classroom"
                  name="classroom"
                  value={formData.classroom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all duration-300"
                  placeholder="ej: A-301"
                />
              </div>

              <div className="bg-white rounded-3xl border border-black p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                      <UsersRound className="w-6 h-6 text-gray-50" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Estudiantes</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {selectedStudents.length} estudiantes en el grupo
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStudentSelector(!showStudentSelector)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar
                  </button>
                </div>

                {showStudentSelector && <StudentSelector />}

                <div className="mt-4 space-y-3">
                  {selectedStudents.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-black text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </button>
              
              <div className="space-x-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGroupForm;