// API Route: GET & PUT /api/catalog
// Handles catalog data (fabrics, categories, colors, sizes)

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

// Default catalog data
const defaultCatalog = {
    fabrics: ['Chiffon', 'Jersey', 'Satin Silk', 'Modal', 'Cotton', 'Cashmere', 'Crepe', 'Voile', 'Silk', 'Satin'],
    categories: [
        { id: 'hijabs', name: 'Hijabs', slug: 'hijabs', subcategories: ['Chiffon', 'Jersey', 'Satin', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile'] },
        { id: 'scarves', name: 'Scarves', slug: 'scarves', subcategories: ['Printed', 'Plain', 'Embroidered'] },
        { id: 'instant', name: 'Instant Hijabs', slug: 'instant-hijabs', subcategories: ['Tie-Back', 'Slip-On', 'Pinless'] },
        { id: 'underscarves', name: 'Underscarves', slug: 'underscarves', subcategories: ['Cotton', 'Modal', 'Bamboo'] },
        { id: 'shawls', name: 'Shawls', slug: 'shawls', subcategories: ['Pashmina', 'Cashmere', 'Wool Blend'] },
        { id: 'accessories', name: 'Accessories', slug: 'accessories', subcategories: ['Pins', 'Magnets', 'Caps', 'Headbands'] }
    ],
    colors: ['Black', 'White', 'Nude', 'Grey', 'Navy', 'Navy Blue', 'Maroon', 'Emerald', 'Dusty Pink', 'Sage Green', 'Cream', 'Brown', 'Burgundy', 'Lavender', 'Mint', 'Coral'],
    sizes: ['Standard', '45x45', '50x50', '55x55', '70x70']
};

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.CATALOG);

        // Find the catalog document
        let catalog = await collection.findOne({ _id: 'settings' });

        // If no catalog exists, create with defaults
        if (!catalog) {
            catalog = { _id: 'settings', ...defaultCatalog };
            await collection.insertOne(catalog);
        }

        // Remove MongoDB _id from response
        const { _id, ...catalogData } = catalog;

        return Response.json(catalogData);
    } catch (error) {
        console.error('Error fetching catalog:', error);
        return Response.json({ error: 'Failed to fetch catalog' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const updateData = await request.json();

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.CATALOG);

        // Update the catalog document
        const result = await collection.updateOne(
            { _id: 'settings' },
            { $set: updateData },
            { upsert: true }
        );

        // Fetch updated catalog
        const catalog = await collection.findOne({ _id: 'settings' });
        const { _id, ...catalogData } = catalog;

        return Response.json(catalogData);
    } catch (error) {
        console.error('Error updating catalog:', error);
        return Response.json({ error: 'Failed to update catalog' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { action } = await request.json();

        if (action === 'reset') {
            const client = await clientPromise;
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTIONS.CATALOG);

            // Reset to defaults
            await collection.updateOne(
                { _id: 'settings' },
                { $set: defaultCatalog },
                { upsert: true }
            );

            return Response.json(defaultCatalog);
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error in catalog action:', error);
        return Response.json({ error: 'Failed to perform action' }, { status: 500 });
    }
}
