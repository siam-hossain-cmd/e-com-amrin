// API Route: GET /api/products
// Fetch products from MongoDB for website display

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const fabric = searchParams.get('fabric');
        const featured = searchParams.get('featured') === 'true';
        const limit = parseInt(searchParams.get('limit')) || 20;

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        let query = { status: 'active' };

        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        if (fabric) {
            query.fabric = { $regex: new RegExp(fabric, 'i') };
        }

        let cursor = collection.find(query).sort({ createdAt: -1 });

        if (limit) {
            cursor = cursor.limit(limit);
        }

        const products = await cursor.toArray();

        const serializedProducts = products.map(p => ({
            ...p,
            _id: p._id.toString()
        }));

        return Response.json(serializedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
