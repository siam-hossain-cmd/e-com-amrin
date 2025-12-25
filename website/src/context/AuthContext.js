'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                });

                // Sync user to MongoDB
                try {
                    await fetch('/api/auth/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: firebaseUser.displayName
                        })
                    });
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Register with email/password
    const register = async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name
        await updateProfile(result.user, { displayName: name });

        // Send welcome email
        try {
            await fetch('/api/email/welcome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name })
            });
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }

        return result.user;
    };

    // Login with email/password
    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    // Login with Google
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if this is a new user (first time sign-up)
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

        if (isNewUser) {
            // Send welcome email for new Google sign-ups
            try {
                await fetch('/api/email/welcome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: result.user.email,
                        name: result.user.displayName
                    })
                });
            } catch (error) {
                console.error('Failed to send welcome email:', error);
            }
        }

        return result.user;
    };

    // Logout
    const logout = async () => {
        await signOut(auth);
    };

    // Reset password
    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const value = {
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
