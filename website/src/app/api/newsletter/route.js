// Newsletter Subscription API
import { NextResponse } from 'next/server';
import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

// POST - Subscribe to newsletter
export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const subscribers = db.collection(COLLECTIONS.SUBSCRIBERS);

        // Check if already subscribed
        const existing = await subscribers.findOne({ email: normalizedEmail });
        if (existing) {
            return NextResponse.json(
                { message: 'You are already subscribed!' },
                { status: 200 }
            );
        }

        // Add subscriber
        await subscribers.insertOne({
            email: normalizedEmail,
            subscribedAt: new Date(),
            status: 'active',
            source: 'website'
        });

        return NextResponse.json(
            { message: 'Successfully subscribed to our newsletter!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}

// GET - Get all subscribers (for admin)
export async function GET(request) {
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

// DELETE - Unsubscribe
export async function DELETE(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const subscribers = db.collection(COLLECTIONS.SUBSCRIBERS);

        await subscribers.updateOne(
            { email: email.toLowerCase().trim() },
            { $set: { status: 'unsubscribed', unsubscribedAt: new Date() } }
        );

        return NextResponse.json({ message: 'Successfully unsubscribed' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}
