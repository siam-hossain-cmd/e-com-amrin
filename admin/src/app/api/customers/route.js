// API Route: /api/customers
// Fetch all customers from MongoDB for admin management

import clientPromise, { DB_NAME } from '@/lib/mongodb';

// GET - Fetch all customers with their order stats
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Fetch all users
        const users = await db.collection('users').find({}).toArray();

        // Fetch orders to calculate stats per user
        const orders = await db.collection('orders').find({}).toArray();

        // Calculate stats for each user
        const customers = users.map(user => {
            // Get orders for this user
            const userOrders = orders.filter(order =>
                order.userId === user.firebaseUid ||
                order.userEmail === user.email
            );

            // Calculate totals
            const totalOrders = userOrders.length;
            const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
            const lastOrder = userOrders.length > 0
                ? userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt
                : null;

            // Determine customer status
            let status = 'active';
            if (totalSpent >= 50000) status = 'vip';
            else if (totalOrders === 0) status = 'new';

            // Get primary address (default or first)
            const primaryAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0] || null;

            return {
                _id: user._id.toString(),
                firebaseUid: user.firebaseUid,
                name: user.name || user.email?.split('@')[0] || 'Unknown',
                email: user.email,
                phone: user.phone || primaryAddress?.phone || '-',
                addresses: user.addresses || [],
                primaryAddress: primaryAddress,
                totalOrders,
                totalSpent,
                lastOrder,
                status,
                createdAt: user.createdAt
            };
        });

        // Sort by total spent (VIP first)
        customers.sort((a, b) => b.totalSpent - a.totalSpent);

        return Response.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

// PUT - Update customer details
export async function PUT(request) {
    try {
        const { firebaseUid, name, phone, notes } = await request.json();

        if (!firebaseUid) {
            return Response.json({ error: 'User ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const updateFields = { updatedAt: new Date() };
        if (name) updateFields.name = name;
        if (phone) updateFields.phone = phone;
        if (notes !== undefined) updateFields.adminNotes = notes;

        await db.collection('users').updateOne(
            { firebaseUid },
            { $set: updateFields }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error updating customer:', error);
        return Response.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}
