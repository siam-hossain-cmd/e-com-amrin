// Get Newsletter Subscribers API for Admin
import { NextResponse } from 'next/server';
import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const subscribers = db.collection(COLLECTIONS.SUBSCRIBERS);

        const allSubscribers = await subscribers
            .find({ status: 'active' })
            .sort({ subscribedAt: -1 })
            .toArray();

        return NextResponse.json({
            subscribers: allSubscribers,
            count: allSubscribers.length
        });
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscribers' },
            { status: 500 }
        );
    }
}
