// API Route: GET /api/products/[id]
// Fetch single product by ID from MongoDB

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json({ error: 'Product ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        let product;

        // Try to find by ObjectId first
        try {
            product = await collection.findOne({ _id: new ObjectId(id) });
        } catch {
            // If id is not a valid ObjectId, try string match
            product = await collection.findOne({ _id: id });
        }

        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        // Convert ObjectId to string
        const serializedProduct = {
            ...product,
            _id: product._id.toString()
        };

        return Response.json(serializedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
