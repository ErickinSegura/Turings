import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (uid, userData) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        uid,
        email: userData.email,
        name: userData.name || "Usuario sin nombre",
        role: userData.role || "student",
        matricula: userData.matricula.toUpperCase() || "",
        groupId: userData.groupId || "",
        turingBalance: userData.turingBalance || 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error; // Propagamos el error original
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await createUserDocument(uid, {
        email,
        ...additionalData,
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error };
    }
  };

  // Función de inicio de sesión
  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Consulta el documento del usuario en Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUser({
          uid,
          email: userCredential.user.email,
          ...userDoc.data(),
        });
      } else {
        console.warn("No se encontró el documento del usuario en Firestore.");
        setUser(null);
      }

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error };
    }
  };

  // Función de cierre de sesión
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Función para enviar un correo de recuperación de contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error);
      return { success: false, error };
    }
  };

  // Mantener el estado del usuario actualizado en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...userDoc.data(),
            });
          } else {
            console.warn("Documento no encontrado en Firestore para UID:", currentUser.uid);
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
      <AuthContext.Provider
          value={{
            signUp,
            logIn,
            user,
            logOut,
            resetPassword,
            loading,
          }}
      >
        {!loading && children}
      </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, useAuth };
