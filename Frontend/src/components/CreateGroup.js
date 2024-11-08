// src/components/CreateGroup.js
import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const CreateGroup = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      // Consulta a Firestore para obtener solo los usuarios con `role` de "student"
      const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsList = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    };

    fetchStudents();
  }, []);

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName === "" || selectedStudents.length === 0) return;

    try {
      // Crear el grupo sin especificar un `document ID`
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        studentIds: selectedStudents,
        createdBy: "adminId",
        createdAt: serverTimestamp(),
      });

      // Guardar el ID del grupo
      const newGroupId = docRef.id;
      setGroupId(newGroupId);

      // Actualizar el campo `groupIds` en cada estudiante seleccionado
      for (const studentId of selectedStudents) {
        const studentRef = doc(db, "users", studentId); // Cambiado a "users" en lugar de "students"
        await updateDoc(studentRef, {
          groupIds: arrayUnion(newGroupId) // Añade el nuevo groupId al array `groupIds`
        });
      }

      alert(`Grupo creado exitosamente con ID: ${newGroupId}`);
      
      // Resetear el formulario
      setGroupName("");
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      alert("Hubo un error al crear el grupo.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear Grupo</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre del Grupo
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nombre del grupo"
          required
        />
        
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Seleccionar Estudiantes
        </label>
        <div className="grid grid-cols-2 gap-4">
          {students.map((student) => (
            <div key={student.id}>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentSelect(student.id)}
                id={`student-${student.id}`}
                className="mr-2"
              />
              <label htmlFor={`student-${student.id}`} className="text-sm">
                {student.name} ({student.id})
              </label>
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        >
          Crear Grupo
        </button>

        {groupId && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
            <p>Grupo creado con ID: {groupId}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateGroup;
