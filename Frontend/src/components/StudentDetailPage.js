import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  Building2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  BookOpen
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const studentRef = doc(db, 'users', studentId);
        const studentDoc = await getDoc(studentRef);

        if (!studentDoc.exists()) {
          setError('Estudiante no encontrado');
          return;
        }

        const studentData = {
          id: studentDoc.id,
          ...studentDoc.data()
        };

        // Fetch group details if student has groups
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

        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Error al cargar los detalles del estudiante');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/students')}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la lista
        </button>

        <div className="bg-white rounded-3xl border border-black p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="p-6 bg-gray-800 rounded-2xl h-fit">
              <GraduationCap className="w-16 h-16 text-gray-50" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {student.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Matrícula</p>
                      <p className="font-medium">{student.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                  </div>

                  {student.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {student.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="font-medium">{student.address}</p>
                      </div>
                    </div>
                  )}

                  {student.enrollmentDate && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha de inscripción</p>
                        <p className="font-medium">
                          {new Date(student.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {student.status && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium">{student.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {student.groupNames && student.groupNames.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Grupos Inscritos
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.groupNames.map((groupName, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium"
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
      </div>
    </div>
  );
};

export default StudentDetailPage;