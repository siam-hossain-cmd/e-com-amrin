// Shared utility functions for E-commerce Platform

/**
 * Format price with currency
 */
export function formatPrice(price, currency = 'BDT') {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Generate unique SKU
 */
export function generateSKU(productName, size, color) {
    const prefix = productName.substring(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    const colorCode = color.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${sizeCode}-${colorCode}-${random}`;
}

/**
 * Generate unique order ID
 */
export function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

/**
 * Calculate discount
 */
export function calculateDiscount(price, discount) {
    if (discount.type === 'percentage') {
        return price * (discount.value / 100);
    } else if (discount.type === 'fixed') {
        return discount.value;
    }
    return 0;
}

/**
 * Format date
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Order status colors
 */
export const orderStatusColors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444'
};

/**
 * Truncate text
 */
export function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
