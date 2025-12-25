// API Route: /api/wishlist
// CRUD operations for user wishlist

import clientPromise, { DB_NAME } from '@/lib/mongodb';

// GET - Fetch user's wishlist
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return Response.json({ items: [] });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const wishlist = await db.collection('wishlists').findOne({ userId });

        return Response.json({ items: wishlist?.items || [] });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return Response.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST - Add item to wishlist
export async function POST(request) {
    try {
        const { userId, product } = await request.json();

        console.log('Adding to wishlist:', { userId, productId: product?._id });

        if (!userId || !product) {
            return Response.json({ error: 'User ID and product required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const item = {
            productId: product._id,
            name: product.name,
            brand: product.brand || '',
            image: product.image?.url || '',
            price: product.basePrice,
            addedAt: new Date()
        };

        // First check if item already exists
        const existing = await db.collection('wishlists').findOne({
            userId,
            'items.productId': product._id
        });

        if (existing) {
            console.log('Item already in wishlist');
            return Response.json({ success: true, message: 'Already in wishlist' });
        }

        // Add new item
        await db.collection('wishlists').updateOne(
            { userId },
            {
                $push: { items: item },
                $set: { updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
        );

        console.log('Item added to wishlist successfully');
        return Response.json({ success: true });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return Response.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(request) {
    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return Response.json({ error: 'User ID and product ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        await db.collection('wishlists').updateOne(
            { userId },
            {
                $pull: { items: { productId } },
                $set: { updatedAt: new Date() }
            }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return Response.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
