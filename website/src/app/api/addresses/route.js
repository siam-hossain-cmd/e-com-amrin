// API Route: /api/addresses
// CRUD operations for user addresses

import clientPromise, { DB_NAME } from '@/lib/mongodb';

// GET - Fetch user's addresses
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return Response.json({ addresses: [] });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const user = await db.collection('users').findOne({ firebaseUid: userId });

        return Response.json({ addresses: user?.addresses || [] });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return Response.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }
}

// POST - Add new address
export async function POST(request) {
    try {
        const { userId, address } = await request.json();

        if (!userId || !address) {
            return Response.json({ error: 'User ID and address required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const id = Date.now().toString();
        const newAddress = { ...address, _id: id, createdAt: new Date() };

        await db.collection('users').updateOne(
            { firebaseUid: userId },
            { $push: { addresses: newAddress } }
        );

        return Response.json({ success: true, id });
    } catch (error) {
        console.error('Error adding address:', error);
        return Response.json({ error: 'Failed to add address' }, { status: 500 });
    }
}

// DELETE - Remove address by index
export async function DELETE(request) {
    try {
        const { userId, index } = await request.json();

        if (!userId || index === undefined) {
            return Response.json({ error: 'User ID and index required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Get current addresses
        const user = await db.collection('users').findOne({ firebaseUid: userId });
        if (!user || !user.addresses) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove address at index
        const updatedAddresses = user.addresses.filter((_, i) => i !== index);

        await db.collection('users').updateOne(
            { firebaseUid: userId },
            { $set: { addresses: updatedAddresses } }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting address:', error);
        return Response.json({ error: 'Failed to delete address' }, { status: 500 });
    }
}
