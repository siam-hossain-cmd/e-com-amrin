// API Route: GET /api/catalog
// Fetches catalog data for the website frontend

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';

// Default catalog data (fallback)
const defaultCatalog = {
    fabrics: ['Chiffon', 'Jersey', 'Satin Silk', 'Modal', 'Cotton', 'Cashmere', 'Crepe', 'Voile', 'Silk', 'Satin'],
    categories: [
        { id: 'hijabs', name: 'Hijabs', slug: 'hijabs', showInNav: true, order: 1, subcategories: ['Chiffon', 'Jersey', 'Satin', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile'] },
        { id: 'scarves', name: 'Scarves', slug: 'scarves', showInNav: true, order: 2, subcategories: ['Printed', 'Plain', 'Embroidered'] },
        { id: 'instant', name: 'Instant Hijabs', slug: 'instant-hijabs', showInNav: true, order: 3, subcategories: ['Tie-Back', 'Slip-On', 'Pinless'] },
        { id: 'underscarves', name: 'Underscarves', slug: 'underscarves', showInNav: true, order: 4, subcategories: ['Cotton', 'Modal', 'Bamboo'] },
        { id: 'shawls', name: 'Shawls', slug: 'shawls', showInNav: true, order: 5, subcategories: ['Pashmina', 'Cashmere', 'Wool Blend'] },
        { id: 'accessories', name: 'Accessories', slug: 'accessories', showInNav: true, order: 6, subcategories: ['Pins', 'Magnets', 'Caps', 'Headbands'] }
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

        // If no catalog exists, return defaults
        if (!catalog) {
            return Response.json(defaultCatalog);
        }

        // Remove MongoDB _id from response
        const { _id, ...catalogData } = catalog;

        return Response.json(catalogData);
    } catch (error) {
        console.error('Error fetching catalog:', error);
        // Return defaults on error so website still works
        return Response.json(defaultCatalog);
    }
}
