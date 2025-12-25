// API Route: POST /api/upload
// Handles image uploads to Cloudinary

import { uploadImage, deleteImage, uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request) {
    try {
        const { image, images, folder } = await request.json();

        // Handle multiple images
        if (images && Array.isArray(images)) {
            const results = await uploadMultipleImages(images, folder || 'products');
            return Response.json({ success: true, images: results });
        }

        // Handle single image
        if (image) {
            const result = await uploadImage(image, folder || 'products');
            return Response.json({ success: true, ...result });
        }

        return Response.json({ error: 'No image provided' }, { status: 400 });
    } catch (error) {
        console.error('Upload API error:', error);
        return Response.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return Response.json({ error: 'No publicId provided' }, { status: 400 });
        }

        await deleteImage(publicId);
        return Response.json({ success: true });
    } catch (error) {
        console.error('Delete API error:', error);
        return Response.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
