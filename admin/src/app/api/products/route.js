// API Route: CRUD /api/products
// Handles product management with MongoDB

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { deleteImage } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

// GET - Fetch all products
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        const products = await collection.find({}).sort({ createdAt: -1 }).toArray();

        // Convert ObjectId to string for JSON serialization
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

// POST - Create new product
export async function POST(request) {
    try {
        const productData = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        const newProduct = {
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newProduct);

        return Response.json({
            ...newProduct,
            _id: result.insertedId.toString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return Response.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

// PUT - Update product
export async function PUT(request) {
    try {
        const { _id, ...updateData } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Product ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        return Response.json({ success: true, _id });
    } catch (error) {
        console.error('Error updating product:', error);
        return Response.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Remove product
export async function DELETE(request) {
    try {
        const { _id, image } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Product ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        // Delete product from database
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        // Delete image from Cloudinary if exists
        if (image?.publicId) {
            try {
                await deleteImage(image.publicId);
            } catch (err) {
                console.error('Failed to delete image from Cloudinary:', err);
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return Response.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
