import React, { useState } from "react";
import { Users, Upload, Search, PlusCircle, X, AlertCircle, CheckCircle } from "lucide-react";
import { useGroups } from "../../context/groupsContext";
import {useNavigate} from "react-router-dom";

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

const ActionCard = ({ icon: Icon, title, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full group bg-white rounded-3xl overflow-hidden border border-black hover:border-black shadow-sm hover:shadow-xl transition-all duration-500 p-8 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 p-3 bg-gray-800 rounded-2xl group-hover:bg-gray-100 transition-all duration-500">
          <Icon className="w-8 h-8 text-gray-50 group-hover:text-gray-900 transition-all duration-500" />
        </div>
        <div className="ml-6 flex-1 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
            {title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
);

const StudentItem = ({ student, onRemove }) => (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-500 p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <div>
            <p className="text-gray-800 font-medium">{student.name}</p>
            <p className="text-gray-400 text-sm">{student.matricula}</p>
          </div>
        </div>
        <button
            onClick={() => onRemove(student.id)}
            className="p-1 hover:bg-red-50 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
);

const CreateGroupPage = ({  }) => {
  const {
    selectedStudents,
    notFoundStudents,
    error,
    loading,
    addStudentById,
    processStudentFile,
    createGroup,
    removeStudent,
  } = useGroups();

  const navigate = useNavigate();
  const [studentIdSearch, setStudentIdSearch] = useState("");
  const [classCode, setClassCode] = useState("TC3004");
  const [codeNumber, setCodeNumber] = useState("");
  const [isGroupCreated, setIsGroupCreated] = useState(false);

  const navigateToGroups = () => {
    navigate('/grupos');
  };

  const handleStudentSearch = () => {
    if (studentIdSearch.trim() === "") return;
    addStudentById(studentIdSearch);
    setStudentIdSearch("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processStudentFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGroupId = await createGroup(classCode, codeNumber);
    if (newGroupId) {
      setIsGroupCreated(true);
      setTimeout(() => {
        navigateToGroups();
      }, 2000);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {isGroupCreated ? (
              <div className="flex flex-col items-center justify-center min-h-screen">
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Grupo creado con éxito!</h1>
                <p className="text-gray-500 text-lg">Serás redirigido a la página de grupos en breve.</p>
              </div>
          ) : (
              <div>
                <div className="mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">Crear Nuevo Grupo</h1>
                  <p className="text-gray-500 text-lg">Configura un nuevo grupo y agrega estudiantes</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Configuration & Student Addition */}
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
                      <div className="flex items-center mb-6">
                        <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                          <Users className="w-6 h-6 text-gray-50" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Configuración del Grupo</h2>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Código de Clase</label>
                          <select
                              value={classCode}
                              onChange={(e) => setClassCode(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="TC3004">TC3004</option>
                            <option value="TC3005">TC3005</option>
                            <option value="TC3006">TC3006</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Código de 3 dígitos</label>
                          <input
                              type="text"
                              value={codeNumber}
                              onChange={(e) => setCodeNumber(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Ej. 001"
                              required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={studentIdSearch}
                            onChange={(e) => setStudentIdSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
                            className="w-full pl-10 pr-4 py-2 border border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Ingresa la matrícula del estudiante"
                        />
                        {studentIdSearch.trim() && (
                            <button
                                onClick={handleStudentSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              <PlusCircle className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                            </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <ActionCard
                            icon={Upload}
                            title="Cargar Archivo"
                            description="Importar lista de estudiantes desde Excel o CSV"
                            onClick={() => {
                              document.getElementById('file-upload').click();
                            }}
                            disabled={loading}
                        />
                        <input
                            id="file-upload"
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Selected Students */}
                  <div className="bg-white rounded-3xl border border-black shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-gray-800 rounded-2xl mr-4">
                          <Users className="w-6 h-6 text-gray-50" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Estudiantes Seleccionados</h2>
                          <p className="text-gray-500 text-sm mt-1">
                            {selectedStudents.length} estudiantes agregados
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 overflow-y-auto max-h-96">
                      {selectedStudents.map((student) => (
                          <StudentItem
                              key={student.id}
                              student={student}
                              onRemove={removeStudent}
                          />
                      ))}
                    </div>

                    {notFoundStudents.length > 0 && (
                        <Alert variant="warning" className="mb-6">
                          No se encontraron {notFoundStudents.length} estudiantes:
                          {notFoundStudents.map((id, index) => (
                              <span key={index} className="block text-sm text-gray-500">{id}</span>
                          ))}
                        </Alert>
                    )}

                    <ActionCard
                        icon={PlusCircle}
                        title="Crear Grupo"
                        description={`Crear grupo con ${selectedStudents.length} estudiantes`}
                        onClick={handleSubmit}
                        disabled={!codeNumber || selectedStudents.length === 0}
                    />

                    {error && (
                        <Alert variant="error" className="mt-6">
                          {error}
                        </Alert>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default CreateGroupPage;