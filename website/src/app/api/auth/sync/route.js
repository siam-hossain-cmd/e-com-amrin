// API Route: POST /api/auth/sync
// Sync Firebase user to MongoDB

import clientPromise, { DB_NAME } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { uid, email, name } = await request.json();

        if (!uid || !email) {
            return Response.json({ error: 'UID and email required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('users');

        // Upsert user
        await collection.updateOne(
            { firebaseUid: uid },
            {
                $set: {
                    email,
                    name: name || email.split('@')[0],
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    firebaseUid: uid,
                    createdAt: new Date(),
                    addresses: [],
                    wishlist: []
                }
            },
            { upsert: true }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error syncing user:', error);
        return Response.json({ error: 'Failed to sync user' }, { status: 500 });
    }
}
