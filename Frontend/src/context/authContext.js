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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para crear el documento de usuario en Firestore
  const createUserDocument = async (uid, userData) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        uid,
        email: userData.email,
        name: userData.name || "Usuario sin nombre",
        role: userData.role || "student",
        matricula: userData.matricula || "",
        groupId: userData.groupId || "",
        turingBalance: userData.turingBalance || 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw new Error("No se pudo crear el documento de usuario en Firestore.");
    }
  };

  // Función de registro de usuario
  const signUp = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Crea el documento en Firestore usando el UID como ID
      await createUserDocument(uid, {
        email,
        ...additionalData,
      });

      return userCredential;
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: "No se pudo registrar al usuario. Revisa los datos e inténtalo de nuevo." };
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

      return userCredential;
    } catch (error) {
      console.error("Error logging in:", error);
      return { error: "No se pudo iniciar sesión. Revisa las credenciales e inténtalo de nuevo." };
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
            loading,
          }}
      >
        {!loading && children}
      </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, useAuth };
