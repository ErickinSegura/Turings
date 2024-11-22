import React, { createContext, useContext, useState } from "react";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";

const GroupsContext = createContext();

export function GroupsProvider({ children }) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notFoundStudents, setNotFoundStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addStudentById = async (studentMatricula) => {
    // Validar que la matrícula no esté vacía y sea un string
    if (!studentMatricula || typeof studentMatricula !== 'string') {
      console.warn("Matrícula inválida");
      return false;
    }

    // Limpiar y normalizar la matrícula (quitar espacios, convertir a mayúsculas)
    const cleanedMatricula = studentMatricula.trim().toUpperCase();

    try {
      // Configurar la consulta para buscar por matrícula
      const usersRef = collection(db, "users");
      const q = query(
          usersRef,
          where("matricula", "==", cleanedMatricula),
          where("role", "==", "student")
      );

      const querySnapshot = await getDocs(q);

      // Verificar si se encontró algún estudiante
      if (!querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];
        const studentData = {
          id: studentDoc.id,
          ...studentDoc.data(),
        };

        // Agregar estudiante a la lista seleccionada
        setSelectedStudents((prev) => {
          // Prevenir duplicados basados en matrícula
          const updatedList = [...prev, studentData];
          return updatedList
              .filter((s, index, self) =>
                  self.findIndex(t => t.matricula === s.matricula) === index
              )
              .sort((a, b) => a.name.split(" ")[0].localeCompare(b.name.split(" ")[0]));
        });

        return true;
      } else {
        // Si no se encuentra el estudiante, agregar a la lista de no encontrados
        console.warn(`No se encontró un estudiante con matrícula ${cleanedMatricula}`);
        setNotFoundStudents(prev => [...prev, cleanedMatricula]);
        return false;
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
      setError(`Error al buscar estudiante: ${error.message}`);
      return false;
    }
  };

  const processStudentFile = async (file) => {
    if (!file) {
      setError("Por favor, selecciona un archivo.");
      return;
    }

    setLoading(true);
    setError(null);
    // Limpiar estudiantes no encontrados al procesar nuevo archivo
    setNotFoundStudents([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      const matriculas = rows
          .map(row => row['SIS Login ID'])
          .filter(Boolean);

      const notFound = [];

      for (const studentMatricula of matriculas) {
        const studentAdded = await addStudentById(studentMatricula);
        if (!studentAdded) {
          notFound.push(studentMatricula);
        }
      }

      setNotFoundStudents(notFound);
    } catch (error) {
      setError("Error al procesar el archivo. Asegúrate de que sea un archivo Excel o CSV válido.");
      console.error("Error al procesar el archivo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Resto del código permanece igual
  const createGroup = async (classCode, codeNumber) => {
    if (codeNumber === "" || selectedStudents.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semesterSuffix = currentMonth <= 6 ? "FJ" : "AD";
    const groupName = `${classCode}-${codeNumber}-${currentYear}${semesterSuffix}`;

    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        studentIds: selectedStudents.map((s) => s.id),
        createdAt: serverTimestamp(),
        isActive: true,
      });

      for (const student of selectedStudents) {
        const studentRef = doc(db, "users", student.id);
        await updateDoc(studentRef, {
          groupId: docRef.id,
        });
      }

      // Limpiar estado después de crear el grupo
      setSelectedStudents([]);
      setNotFoundStudents([]);
      setError(null);

      return docRef.id;
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      setError("Hubo un error al crear el grupo.");
      return null;
    }
  };

  const removeStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const value = {
    selectedStudents,
    notFoundStudents,
    error,
    loading,
    addStudentById,
    processStudentFile,
    createGroup,
    removeStudent,
  };

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
};