// API Route: DELETE /api/auth/delete-account
// Delete user account and all associated data

import clientPromise, { DB_NAME } from '@/lib/mongodb';

export async function DELETE(request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return Response.json({ error: 'User ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Delete user data from all collections
        const deletePromises = [
            // Delete user record
            db.collection('users').deleteOne({ firebaseUid: userId }),
            // Delete user's cart
            db.collection('carts').deleteOne({ userId: userId }),
            // Delete user's wishlist (if exists)
            db.collection('wishlists').deleteOne({ userId: userId }),
            // Delete user's addresses (if exists)
            db.collection('addresses').deleteMany({ userId: userId }),
            // We keep orders for record-keeping but anonymize them
            db.collection('orders').updateMany(
                { userId: userId },
                { $set: { userId: 'deleted_user', email: 'deleted@user.com' } }
            )
        ];

        await Promise.all(deletePromises);

        return Response.json({ success: true, message: 'Account data deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return Response.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
