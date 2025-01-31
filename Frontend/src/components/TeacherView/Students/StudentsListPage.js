import React, { useState, useEffect } from 'react';
import {
  Search,
  GraduationCap,
  Mail,
  Building2,
  Filter,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  orderBy,
  doc,
  getDoc,
  endBefore,
  limitToLast
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

const STUDENTS_PER_PAGE = 10;

const StudentsListPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    group: '',
    enrollmentYear: ''
  });
  const [groups, setGroups] = useState([]);

  // Obtener todos los grupos
  const fetchGroups = async () => {
    try {
      const groupsQuery = query(collection(db, 'groups'));
      const groupsSnapshot = await getDocs(groupsQuery);
      const groupsData = groupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(groupsData);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchStudents = async (searchQuery = '', direction = 'next') => {
    try {
      setLoading(true);
      setError(null);

      let studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          orderBy('name')
      );

      if (searchQuery) {
        studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('name', '>=', searchQuery),
            where('name', '<=', searchQuery + '\uf8ff'),
            orderBy('name')
        );
      }

      if (filters.group) {
        studentsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('groupId', '==', filters.group),
            orderBy('name')
        );
      }

      // Lógica de paginación bidireccional
      if (direction === 'next' && lastVisible) {
        studentsQuery = query(studentsQuery, startAfter(lastVisible), limit(STUDENTS_PER_PAGE));
      } else if (direction === 'prev' && firstVisible) {
        studentsQuery = query(studentsQuery, endBefore(firstVisible), limitToLast(STUDENTS_PER_PAGE));
      } else {
        studentsQuery = query(studentsQuery, limit(STUDENTS_PER_PAGE));
      }

      const querySnapshot = await getDocs(studentsQuery);
      const docs = querySnapshot.docs;

      // Actualizar cursores de paginación
      setFirstVisible(docs[0]);
      setLastVisible(docs[docs.length - 1]);

      // Verificar si hay más páginas en ambas direcciones
      const hasMoreNext = docs.length === STUDENTS_PER_PAGE;
      const hasMorePrev = page > 1;
      setHasMore(hasMoreNext);
      setHasPrevious(hasMorePrev);

      const studentsData = await Promise.all(docs.map(async studentDoc => {
        const studentData = {
          id: studentDoc.id,
          ...studentDoc.data()
        };

        if (studentData.groupIds && studentData.groupIds.length > 0) {
          const groupNames = await Promise.all(
              studentData.groupIds.map(async groupId => {
                const groupRef = doc(db, 'groups', groupId);
                const groupDoc = await getDoc(groupRef);
                return groupDoc.exists() ? groupDoc.data().name : groupId;
              })
          );
          studentData.groupNames = groupNames;
        }

        return studentData;
      }));

      setStudents(studentsData);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error al cargar los estudiantes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStudents('', 'next');
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFirstVisible(null);
      setLastVisible(null);
      setPage(1);
      setHasMore(true);
      setHasPrevious(false);
      fetchStudents(searchTerm, 'next');  // Ahora llamamos a fetchStudents sin importar si searchTerm está vacío
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadPrevious = () => {
    if (page > 1 && !loading) {
      setPage(prev => prev - 1);
      fetchStudents(searchTerm, 'prev');
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchStudents(searchTerm, 'next');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    setFirstVisible(null);
    setLastVisible(null);
    setHasMore(true);
    setHasPrevious(false);

    if (!value.trim()) {
      fetchStudents('', 'next');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      group: '',
      enrollmentYear: ''
    });
    setPage(1);
    setFirstVisible(null);
    setLastVisible(null);
    setHasMore(true);
    setHasPrevious(false);
  };


  const renderStudents = () => {
    if (loading && students.length === 0) {
      return <div className="min-h-screen bg-gray-50 dark:bg-black flex justify-center">
        <div className="text-xl text-gray-500 dark:text-gray-400">Cargando Alumnos...</div>
      </div>;
    }

    if (students.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No se encontraron estudiantes
        </div>
      );
    }

    return students.map((student) => (
      <div
      key={student.id}
      className="bg-white border-black dark:bg-black dark:border-white rounded-3xl border p-6 hover:shadow-lg transition-all duration-500 cursor-pointer"
      onClick={() => navigate(`/estudiantes/${student.id}`)}
    >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-xl">
            <GraduationCap className="w-12 h-12 text-gray-50 dark:text-gray-800" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-4">
              {student.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Mail className="w-5 h-5 mr-3" />
                {student.email}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Building2 className="w-5 h-5 mr-3" />
                Matrícula: {student.matricula}
              </div>
            </div>
            {student.groupName && student.groupName.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Grupos Inscritos:</h4>
                <div className="flex flex-wrap gap-2">
                  {student.groupNames.map((groupName, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {groupName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
              Estudiantes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Lista completa de estudiantes en la plataforma
            </p>
          </div>
        </div>

        <div className="bg-white border-black dark:bg-black dark:border-white rounded-3xl border  p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="bg-white dark:bg-black w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-1 outline-none
                                                                      dark:border-gray-100 dark:focus:border-gray-400
                                                                      dark:text-gray-50
                "
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-2 rounded-xl transition-colors
                    bg-gray-800 text-gray-50 border border-gray-800 hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                    dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-gray-50 dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
              "
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtros
              {Object.values(filters).some(value => value !== '') && (
                <span className="ml-2 px-2 py-0.5 bg-gray-500 dark:bg-gray-400 text-gray-50 rounded-full text-xs">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-black rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold dark:text-gray-50">Filtros</h3>
                {Object.values(filters).some(value => value !== '') && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-50 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-50 mb-1">
                    Grupo
                  </label>
                  <select
                      className="w-full rounded-lg border bg-white border-black dark:border-gray-50 dark:bg-black p-2 dark:text-gray-50"
                      value={filters.group}
                      onChange={(e) => handleFilterChange('group', e.target.value)}
                  >
                    <option value="" className="dark:text-white">Todos los grupos</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id} className="dark:text-gray-50">
                          {group.name}
                        </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
        )}

        <div className="space-y-4">
          {renderStudents()}
        </div>

        {students.length > 0 && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                  onClick={loadPrevious}
                  disabled={page === 1 || loading}
                  className={`flex items-center px-4 py-2 rounded-xl ${
                      page === 1 || loading
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-800 dark:text-gray-50'
                  }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1"/>
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-500 dark:text-gray-400">
        Página {page}
      </span>
              <button
                  onClick={loadMore}
                  disabled={!hasMore || loading}
                  className={`flex items-center px-4 py-2 rounded-xl ${
                      !hasMore || loading
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-800 dark:text-gray-50'
                  }`}
              >
                Siguiente
                <ChevronRight className="w-5 h-5 ml-1"/>
              </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentsListPage;