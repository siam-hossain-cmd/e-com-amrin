'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AdminAuthContext = createContext({});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setAdmin({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'Admin',
                    photoURL: firebaseUser.photoURL,
                    phone: firebaseUser.phoneNumber || ''
                });
            } else {
                setAdmin(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            // Clear any local storage
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
            }
            setAdmin(null);
            // Force redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if error
            window.location.href = '/login';
        }
    };

    // Change password
    const changePassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error('No user logged in');
        }

        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);
    };

    const value = {
        admin,
        loading,
        logout,
        changePassword
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}
