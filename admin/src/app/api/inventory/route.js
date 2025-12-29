// API Route: /api/inventory
// Handles inventory management - derived from products and their variants

import clientPromise, { DB_NAME, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch inventory (derived from products + variants)
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        const products = await collection.find({}).toArray();

        // Generate inventory items from products and their variants
        const inventory = [];

        for (const product of products) {
            if (product.variants && product.variants.length > 0) {
                // Product has variants
                for (const variant of product.variants) {
                    const sku = variant.sku || `${product.name.substring(0, 3).toUpperCase()}-${variant.size || 'OS'}-${variant.color?.substring(0, 3).toUpperCase() || 'DEF'}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

                    inventory.push({
                        _id: variant._id || `${product._id}-${variant.size}-${variant.color}`,
                        productId: product._id.toString(),
                        sku: sku,
                        product: product.name,
                        size: variant.size || 'One Size',
                        color: variant.color || 'Default',
                        stock: variant.stock || 0,
                        minStock: variant.minStock || 10,
                        price: variant.price || product.price || 0,
                        image: product.image
                    });
                }
            } else {
                // Product without variants
                const sku = product.sku || `${product.name.substring(0, 3).toUpperCase()}-OS-DEF-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

                inventory.push({
                    _id: product._id.toString(),
                    productId: product._id.toString(),
                    sku: sku,
                    product: product.name,
                    size: 'One Size',
                    color: 'Default',
                    stock: product.stock || 0,
                    minStock: product.minStock || 10,
                    price: product.price || 0,
                    image: product.image
                });
            }
        }

        return Response.json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return Response.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

// PUT - Update stock for a variant/product
export async function PUT(request) {
    try {
        const { productId, variantId, sku, stock } = await request.json();

        if (!productId && !sku) {
            return Response.json({ error: 'Product ID or SKU required' }, { status: 400 });
        }

        if (stock === undefined || stock < 0) {
            return Response.json({ error: 'Valid stock value required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.PRODUCTS);

        if (variantId) {
            // Update variant stock
            const result = await collection.updateOne(
                {
                    _id: new ObjectId(productId),
                    'variants._id': variantId
                },
                {
                    $set: {
                        'variants.$.stock': stock,
                        updatedAt: new Date()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return Response.json({ error: 'Variant not found' }, { status: 404 });
            }
        } else {
            // Update product stock directly
            const result = await collection.updateOne(
                { _id: new ObjectId(productId) },
                {
                    $set: {
                        stock: stock,
                        updatedAt: new Date()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return Response.json({ error: 'Product not found' }, { status: 404 });
            }
        }

        return Response.json({ success: true, stock });
    } catch (error) {
        console.error('Error updating inventory:', error);
        return Response.json({ error: 'Failed to update inventory' }, { status: 500 });
    }
}
