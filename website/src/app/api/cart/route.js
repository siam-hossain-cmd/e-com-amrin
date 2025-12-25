// API Route: /api/cart
// CRUD operations for user cart

import clientPromise, { DB_NAME } from '@/lib/mongodb';
import { cookies } from 'next/headers';

// Helper to get user ID from request (simplified - in production use proper auth)
async function getUserId(request) {
    // Get user ID from authorization header or cookie
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
        return authHeader.replace('Bearer ', '');
    }

    const cookieStore = await cookies();
    return cookieStore.get('userId')?.value;
}

// GET - Fetch user's cart
export async function GET(request) {
    try {
        const userId = await getUserId(request);

        if (!userId) {
            return Response.json({ items: [] });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('carts');

        const cart = await collection.findOne({ userId });

        return Response.json(cart || { items: [] });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

// POST - Add item to cart
export async function POST(request) {
    try {
        const userId = await getUserId(request);
        const item = await request.json();

        if (!userId) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('carts');

        // Check if item already exists
        const existingCart = await collection.findOne({ userId });

        if (existingCart) {
            const existingItemIndex = existingCart.items.findIndex(
                i => i.productId === item.productId && i.size === item.size && i.color === item.color
            );

            if (existingItemIndex >= 0) {
                // Update quantity
                existingCart.items[existingItemIndex].quantity += item.quantity;
                await collection.updateOne(
                    { userId },
                    { $set: { items: existingCart.items, updatedAt: new Date() } }
                );
            } else {
                // Add new item
                await collection.updateOne(
                    { userId },
                    {
                        $push: { items: item },
                        $set: { updatedAt: new Date() }
                    }
                );
            }
        } else {
            // Create new cart
            await collection.insertOne({
                userId,
                items: [item],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return Response.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}

// PUT - Update item quantity
export async function PUT(request) {
    try {
        const userId = await getUserId(request);
        const { productId, size, color, quantity } = await request.json();

        if (!userId) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('carts');

        const cart = await collection.findOne({ userId });

        if (cart) {
            const updatedItems = cart.items.map(item => {
                if (item.productId === productId && item.size === size && item.color === color) {
                    return { ...item, quantity };
                }
                return item;
            });

            await collection.updateOne(
                { userId },
                { $set: { items: updatedItems, updatedAt: new Date() } }
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        return Response.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
    try {
        const userId = await getUserId(request);
        const { productId, size, color } = await request.json();

        if (!userId) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection('carts');

        await collection.updateOne(
            { userId },
            {
                $pull: {
                    items: { productId, size, color }
                },
                $set: { updatedAt: new Date() }
            }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return Response.json({ error: 'Failed to remove from cart' }, { status: 500 });
    }
}
