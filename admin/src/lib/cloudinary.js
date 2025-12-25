// Cloudinary Configuration
// Upload images to Cloudinary for Products, Banners, and Hero sections

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} folder - Folder to store the image (e.g., 'products', 'banners', 'hero')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(base64Image, folder = 'amrin') {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: `amrin/${folder}`,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
}

/**
 * Upload multiple images
 * @param {string[]} base64Images - Array of base64 encoded images
 * @param {string} folder - Folder to store images
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export async function uploadMultipleImages(base64Images, folder = 'amrin') {
    try {
        const uploadPromises = base64Images.map(img => uploadImage(img, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error);
        throw new Error('Failed to upload images');
    }
}

export default cloudinary;
