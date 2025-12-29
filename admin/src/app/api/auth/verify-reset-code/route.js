// API Route: POST /api/auth/verify-reset-code
// Verifies the password reset code from MongoDB

import clientPromise, { DB_NAME } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { username, code } = await request.json();

        if (!username || !code) {
            return Response.json({ error: 'Username and code are required' }, { status: 400 });
        }

        const normalizedCode = code.toString().trim();
        const normalizedUsername = username.toLowerCase().trim();

        // Verify from MongoDB
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('password_resets');

        const resetRecord = await collection.findOne({
            email: normalizedUsername,
            code: normalizedCode
        });

        if (!resetRecord) {
            return Response.json({ error: 'Invalid code. Please check and try again.' }, { status: 400 });
        }

        // Check if expired
        if (new Date() > new Date(resetRecord.expiresAt)) {
            await collection.deleteOne({ _id: resetRecord._id });
            return Response.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: 'Code verified successfully'
        });

    } catch (error) {
        console.error('Verify code error:', error);
        return Response.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
    }
}
