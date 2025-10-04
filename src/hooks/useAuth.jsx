// src/hooks/useAuth.jsx

import { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase'; 

// 👇 Keep your Admin UID defined here
const ADMIN_UID = "35UDzCTYRaa0NY4KLMXzeriwFf12"; 

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This Firebase function handles state changes (login/logout/page refresh)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const login = (email, password) => {
        // This is the function called by Login.jsx
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    // 👇 NEW: Check if the current user's UID matches the admin UID
    const isAuthorizedAdmin = !!user && user.uid === ADMIN_UID;

    const value = {
        user,
        isAuthenticated: !!user, // User is logged in
        isAuthorizedAdmin: isAuthorizedAdmin, // 👇 User is the specific admin
        loading,
        login,
        logout,
    };

    // We only render children once we know the loading state is resolved
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};