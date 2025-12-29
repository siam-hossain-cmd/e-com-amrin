// API Route: /api/discounts
// CRUD operations for discount/voucher codes

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all discounts
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.DISCOUNTS);

        const discounts = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const serialized = discounts.map(d => ({
            ...d,
            _id: d._id.toString()
        }));

        return Response.json(serialized);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        return Response.json({ error: 'Failed to fetch discounts' }, { status: 500 });
    }
}

// POST - Create new discount
export async function POST(request) {
    try {
        const data = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.DISCOUNTS);

        // Check if code already exists
        const existing = await collection.findOne({
            code: data.code.toUpperCase()
        });
        if (existing) {
            return Response.json({ error: 'Discount code already exists' }, { status: 400 });
        }

        const newDiscount = {
            code: data.code.toUpperCase(),
            type: data.type, // 'percentage', 'fixed', 'bogo'
            value: parseInt(data.value) || 0,
            minOrder: parseInt(data.minOrder) || 0,
            maxUses: data.maxUses ? parseInt(data.maxUses) : null,
            usedCount: 0,
            usedBy: [], // Track which users have used this voucher
            onePerUser: data.onePerUser || false, // If true, each user can only use once
            expiryDate: data.expiryDate,
            status: data.status || 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newDiscount);

        return Response.json({
            success: true,
            _id: result.insertedId.toString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating discount:', error);
        return Response.json({ error: 'Failed to create discount' }, { status: 500 });
    }
}

// PUT - Update discount
export async function PUT(request) {
    try {
        const { _id, ...updates } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Discount ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.DISCOUNTS);

        // If updating code, check for duplicates
        if (updates.code) {
            const existing = await collection.findOne({
                code: updates.code.toUpperCase(),
                _id: { $ne: new ObjectId(_id) }
            });
            if (existing) {
                return Response.json({ error: 'Discount code already exists' }, { status: 400 });
            }
            updates.code = updates.code.toUpperCase();
        }

        updates.updatedAt = new Date();

        await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updates }
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error updating discount:', error);
        return Response.json({ error: 'Failed to update discount' }, { status: 500 });
    }
}

// DELETE - Remove discount
export async function DELETE(request) {
    try {
        const { _id } = await request.json();

        if (!_id) {
            return Response.json({ error: 'Discount ID required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.DISCOUNTS);

        await collection.deleteOne({ _id: new ObjectId(_id) });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting discount:', error);
        return Response.json({ error: 'Failed to delete discount' }, { status: 500 });
    }
}
