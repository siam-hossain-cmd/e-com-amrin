// API Route: GET & POST /api/orders
// Handles order creation and retrieval for website

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

// Generate unique order ID
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AMR-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// GET - Fetch user's orders or single order by orderId
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const orderId = searchParams.get('orderId');

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.ORDERS);

        let orders;

        if (orderId) {
            // Fetch single order by orderId
            const order = await collection.findOne({ orderId });
            if (!order) {
                return Response.json({ error: 'Order not found' }, { status: 404 });
            }
            return Response.json({
                ...order,
                _id: order._id.toString()
            });
        } else if (userId) {
            // Fetch all orders for a user
            orders = await collection
                .find({ userId })
                .sort({ createdAt: -1 })
                .toArray();
        } else {
            return Response.json({ error: 'userId or orderId required' }, { status: 400 });
        }

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

// POST - Create new order
export async function POST(request) {
    try {
        const orderData = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.ORDERS);

        // Generate unique order ID
        let orderId = generateOrderId();

        // Check if order ID already exists (very unlikely but just in case)
        let existing = await collection.findOne({ orderId });
        while (existing) {
            orderId = generateOrderId();
            existing = await collection.findOne({ orderId });
        }

        const newOrder = {
            orderId,
            userId: orderData.userId || null,
            customer: {
                email: orderData.email,
                firstName: orderData.firstName,
                lastName: orderData.lastName,
                phone: orderData.phone,
                name: `${orderData.firstName} ${orderData.lastName}`
            },
            shippingAddress: {
                address: orderData.address,
                city: orderData.city,
                state: orderData.state,
                postcode: orderData.postcode,
                country: orderData.country || 'Malaysia'
            },
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            shipping: orderData.shipping || 0,
            discount: orderData.discount || 0,
            total: orderData.total || 0,
            voucher: orderData.voucher || null,
            paymentMethod: orderData.paymentMethod || 'cod',
            status: 'pending',
            trackingNumber: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newOrder);

        return Response.json({
            success: true,
            orderId,
            _id: result.insertedId.toString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
