// API Route: GET /api/settings/hero
// Fetch hero settings from MongoDB for website display

import clientPromise, { DB_NAME } from '@/lib/mongodb';

const SETTINGS_COLLECTION = 'settings';

const defaultHeroSettings = {
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

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(SETTINGS_COLLECTION);

        let settings = await collection.findOne({ _id: 'hero' });

        if (!settings) {
            settings = defaultHeroSettings;
        }

        return Response.json(settings);
    } catch (error) {
        console.error('Error fetching hero settings:', error);
        // Return defaults on error
        return Response.json(defaultHeroSettings);
    }
}
