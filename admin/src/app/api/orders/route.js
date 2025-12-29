// API Route: GET, PUT, DELETE /api/orders
// Admin Orders Management

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all orders for admin
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.ORDERS);

        const orders = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const serialized = orders.map(o => ({
            ...o,
            _id: o._id.toString()
        }));

        return Response.json(serialized);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// PUT - Update order status
export async function PUT(request) {
    try {
        const { orderId, status, trackingNumber } = await request.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.ORDERS);

        const updateData = {
            updatedAt: new Date()
        };

        if (status) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

        // Try to find by orderId field first, then by _id
        let result = await collection.updateOne(
            { orderId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            // Try by MongoDB _id
            try {
                result = await collection.updateOne(
                    { _id: new ObjectId(orderId) },
                    { $set: updateData }
                );
            } catch (e) {
                return Response.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        if (result.matchedCount === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// DELETE - Cancel/delete order
export async function DELETE(request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.ORDERS);

        // Try to find by orderId field first
        let result = await collection.deleteOne({ orderId });

        if (result.deletedCount === 0) {
            // Try by MongoDB _id
            try {
                result = await collection.deleteOne({ _id: new ObjectId(orderId) });
            } catch (e) {
                return Response.json({ error: 'Order not found' }, { status: 404 });
            }
        }

        if (result.deletedCount === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting order:', error);
        return Response.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
