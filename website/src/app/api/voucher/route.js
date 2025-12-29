// API Route: /api/voucher
// Validate and apply voucher codes at checkout

import clientPromise, { DB_NAME } from '@/lib/mongodb';

// Collection name for discounts
const DISCOUNTS_COLLECTION = 'discounts';

// POST - Validate voucher code
export async function POST(request) {
    try {
        const { code, userId, subtotal } = await request.json();

        if (!code) {
            return Response.json({ error: 'Voucher code is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(DISCOUNTS_COLLECTION);

        // Find the voucher
        const voucher = await collection.findOne({
            code: code.toUpperCase()
        });

        if (!voucher) {
            return Response.json({
                valid: false,
                error: 'Invalid voucher code'
            });
        }

        // Check if voucher is active
        if (voucher.status !== 'active') {
            return Response.json({
                valid: false,
                error: 'This voucher is no longer active'
            });
        }

        // Check if voucher has expired
        if (voucher.expiryDate) {
            const expiry = new Date(voucher.expiryDate);
            if (expiry < new Date()) {
                return Response.json({
                    valid: false,
                    error: 'This voucher has expired'
                });
            }
        }

        // Check if max uses reached
        if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
            return Response.json({
                valid: false,
                error: 'This voucher has reached its usage limit'
            });
        }

        // Check if one-per-user and user has already used it
        if (voucher.onePerUser && userId) {
            const usedBy = voucher.usedBy || [];
            if (usedBy.includes(userId)) {
                return Response.json({
                    valid: false,
                    error: 'You have already used this voucher'
                });
            }
        }

        // Check minimum order amount
        if (voucher.minOrder && subtotal < voucher.minOrder) {
            return Response.json({
                valid: false,
                error: `Minimum order of RM ${voucher.minOrder} required`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (voucher.type === 'percentage') {
            discountAmount = (subtotal * voucher.value) / 100;
        } else if (voucher.type === 'fixed') {
            discountAmount = voucher.value;
        }
        // For BOGO, need to handle differently in cart context

        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);

        return Response.json({
            valid: true,
            voucher: {
                code: voucher.code,
                type: voucher.type,
                value: voucher.value,
                discountAmount: discountAmount
            }
        });
    } catch (error) {
        console.error('Error validating voucher:', error);
        return Response.json({ error: 'Failed to validate voucher' }, { status: 500 });
    }
}

// PUT - Mark voucher as used (called after successful order)
export async function PUT(request) {
    try {
        const { code, userId } = await request.json();

        if (!code) {
            return Response.json({ error: 'Voucher code is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(DISCOUNTS_COLLECTION);

        const updateData = {
            $inc: { usedCount: 1 }
        };

        // If userId provided and voucher is one-per-user, track the user
        if (userId) {
            updateData.$push = { usedBy: userId };
        }

        await collection.updateOne(
            { code: code.toUpperCase() },
            updateData
        );

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error marking voucher used:', error);
        return Response.json({ error: 'Failed to update voucher' }, { status: 500 });
    }
}
