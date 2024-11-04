import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from "../firebase";

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

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            return { error };
        }
    };

    const logIn = async (email, password) => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password)
            return user;
        } catch (error) {
            return { error }
        }
    }

    const logOut = async () => { signOut(auth) }

    useEffect(() => {
        onAuthStateChanged(auth, currentUser =>
            setUser(currentUser)
        )
    }, []);

    return (
        <AuthContext.Provider value={{ signUp, logIn, user, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}



export { AuthProvider, useAuth, AuthContext };

