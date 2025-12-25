// API Route: GET/PUT /api/settings/hero
// Manages homepage hero section settings

import clientPromise, { DB_NAME } from '@/lib/mongodb';

const SETTINGS_COLLECTION = 'settings';

// Default hero settings
const defaultHeroSettings = {
    _id: 'hero',
    badge: 'NEW COLLECTION 2024',
    title: 'Grace in Every',
    titleHighlight: 'Wrap',
    subtitle: 'Discover our curated collection of premium hijabs and scarves. Elegant fabrics, timeless styles, designed for the modern Muslimah.',
    primaryButtonText: 'Shop Hijabs',
    primaryButtonLink: '/products',
    secondaryButtonText: 'VIEW LOOKBOOK',
    secondaryButtonLink: '/products?collection=lookbook',
    backgroundImage: null
};

// GET - Fetch hero settings
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(SETTINGS_COLLECTION);

        let settings = await collection.findOne({ _id: 'hero' });

        if (!settings) {
            // Initialize with defaults
            await collection.insertOne(defaultHeroSettings);
            settings = defaultHeroSettings;
        }

        return Response.json(settings);
    } catch (error) {
        console.error('Error fetching hero settings:', error);
        return Response.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
    }
}

// PUT - Update hero settings
export async function PUT(request) {
    try {
        const updateData = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(SETTINGS_COLLECTION);

        await collection.updateOne(
            { _id: 'hero' },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        const settings = await collection.findOne({ _id: 'hero' });

        return Response.json(settings);
    } catch (error) {
        console.error('Error updating hero settings:', error);
        return Response.json({ error: 'Failed to update hero settings' }, { status: 500 });
    }
}
