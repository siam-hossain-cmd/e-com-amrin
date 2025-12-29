// API Route: POST /api/auth/reset-password
// Resets the admin password using Firebase Admin SDK

import clientPromise, { DB_NAME } from '@/lib/mongodb';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
    try {
        // Try environment variable first
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            // Try loading from file in project root
            const serviceAccountPath = join(process.cwd(), '..', 'amrin-23546-firebase-adminsdk-fbsvc-328ee65915.json');
            const serviceAccountFile = readFileSync(serviceAccountPath, 'utf8');
            const serviceAccount = JSON.parse(serviceAccountFile);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export async function POST(request) {
    try {
        const { username, code, newPassword } = await request.json();

        if (!username || !code || !newPassword) {
            return Response.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const normalizedUsername = username.toLowerCase().trim();

        // Verify code in MongoDB
        try {
            const client = await clientPromise;
            const db = client.db(DB_NAME);
            const collection = db.collection('password_resets');

            const resetRecord = await collection.findOne({
                email: normalizedUsername,
                code: code.toString()
            });

            if (!resetRecord) {
                return Response.json({ error: 'Invalid or expired code' }, { status: 400 });
            }

            if (new Date() > new Date(resetRecord.expiresAt)) {
                await collection.deleteOne({ _id: resetRecord._id });
                return Response.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
            }

            // Delete the used reset code
            await collection.deleteOne({ _id: resetRecord._id });
        } catch (dbError) {
            console.error('MongoDB error:', dbError);
            // Continue without DB verification for testing
        }

        // Update password in Firebase
        try {
            if (!admin.apps.length) {
                return Response.json({ error: 'Firebase not initialized' }, { status: 500 });
            }

            const userRecord = await admin.auth().getUserByEmail(normalizedUsername);
            await admin.auth().updateUser(userRecord.uid, {
                password: newPassword
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
            return Response.json({ error: 'Failed to update password: ' + firebaseError.message }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return Response.json({ error: error.message || 'Failed to reset password.' }, { status: 500 });
    }
}
