import React, { createContext, useContext, useState } from "react";
import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";

const GroupsContext = createContext();

export function GroupsProvider({ children }) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notFoundStudents, setNotFoundStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addStudentById = async (studentId) => {
    try {
      const studentRef = doc(db, "users", studentId);
      const studentDoc = await getDoc(studentRef);

      if (studentDoc.exists() && studentDoc.data().role === "student") {
        const studentData = {
          id: studentDoc.id,
          ...studentDoc.data(),
        };

        setSelectedStudents((prev) => {
          const updatedList = [...prev, studentData];
          return updatedList
            .filter((s, index, self) => self.findIndex(t => t.id === s.id) === index)
            .sort((a, b) => a.name.split(" ")[0].localeCompare(b.name.split(" ")[0]));
        });

        return true;
      } else {
        console.warn(`No se encontró un estudiante con ID ${studentId} o no tiene rol de estudiante.`);
        return false;
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
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

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const matriculas = rows
        .slice(1)
        .map(row => (Array.isArray(row) ? row[0] : null))
        .filter(Boolean);

      const notFound = [];

      for (const studentId of matriculas) {
        const studentAdded = await addStudentById(studentId);
        if (!studentAdded) {
          notFound.push(studentId);
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
      });

      for (const student of selectedStudents) {
        const studentRef = doc(db, "users", student.id);
        await updateDoc(studentRef, {
          groupIds: arrayUnion(docRef.id),
        });
      }

      // Clear state after successful creation
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