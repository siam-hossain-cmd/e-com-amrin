// API Route: CRUD /api/banners
// Handles banner management with MongoDB

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { deleteImage } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

// GET - Fetch all banners
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.BANNERS);

        let query = {};
        if (activeOnly) {
            const now = new Date();
            query = {
                isActive: true,
                startDate: { $lte: now.toISOString().split('T')[0] },
                endDate: { $gte: now.toISOString().split('T')[0] }
            };
        }

        const banners = await collection.find(query).sort({ createdAt: -1 }).toArray();

        const serializedBanners = banners.map(b => ({
            ...b,
            _id: b._id.toString()
        }));

        return Response.json(serializedBanners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        return Response.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }
}

// POST - Create new banner
export async function POST(request) {
    try {
        const bannerData = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.BANNERS);

        const newBanner = {
            ...bannerData,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newBanner);

        return Response.json({
            ...newBanner,
            _id: result.insertedId.toString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating banner:', error);
        return Response.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}

// PUT - Update banner
export async function PUT(request) {
    try {
        const { _id, ...updateData } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Banner ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.BANNERS);

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
            return Response.json({ error: 'Banner not found' }, { status: 404 });
        }

        return Response.json({ success: true, _id });
    } catch (error) {
        console.error('Error updating banner:', error);
        return Response.json({ error: 'Failed to update banner' }, { status: 500 });
    }
}

// DELETE - Remove banner
export async function DELETE(request) {
    try {
        const { _id, image } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Banner ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.BANNERS);

        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) {
            return Response.json({ error: 'Banner not found' }, { status: 404 });
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
        console.error('Error deleting banner:', error);
        return Response.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
