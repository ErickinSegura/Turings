import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para crear el documento de usuario en Firestore
  const createUserDocument = async (matricula, userData) => {
    try {
      const userRef = doc(db, "users", matricula); // Usa la matrícula como ID del documento
      await setDoc(userRef, {
        uid: matricula, // Guarda la matrícula como UID en el documento
        email: userData.email,
        name: userData.name,
        role: userData.role || "student",
        groupIds: [],
        turingBalance: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  };

  // Función de registro de usuario
  const signUp = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Extrae la matrícula del correo institucional
      const matricula = email.split("@")[0];

      // Crea el documento en Firestore usando la matrícula como ID
      await createUserDocument(matricula, {
        email,
        ...additionalData
      });

      return userCredential;
    } catch (error) {
      return { error };
    }
  };


  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", email.split("@")[0])); // Usar el ID correcto
      if (userDoc.exists()) {
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userDoc.data().name, // Asegúrate de que Firestore tiene este campo
          ...userDoc.data()
        });
      }
      return userCredential;
    } catch (error) {
      return { error };
    }
  };
  

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            ...currentUser,
            ...userDoc.data()
          });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      signUp,
      logIn,
      user,
      logOut,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider, useAuth };

