// API Route: GET /api/banners
// Fetch active banners from MongoDB for website display

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const position = searchParams.get('position');

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.BANNERS);

        const now = new Date().toISOString().split('T')[0];

        let query = {
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        };

        if (position) {
            query.position = position;
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
