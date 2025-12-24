// Shared Catalog Data - Fabrics, Categories, and Subcategories
// This file will be updated to use a database later (Firebase/MongoDB)
// Currently using localStorage for persistence

// Default data
const defaultFabrics = [
    'Chiffon',
    'Jersey',
    'Satin Silk',
    'Modal',
    'Cotton',
    'Cashmere',
    'Crepe',
    'Voile',
    'Silk',
    'Satin'
];

const defaultCategories = [
    {
        id: 'hijabs',
        name: 'Hijabs',
        slug: 'hijabs',
        subcategories: ['Chiffon', 'Jersey', 'Satin', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile']
    },
    {
        id: 'scarves',
        name: 'Scarves',
        slug: 'scarves',
        subcategories: ['Printed', 'Plain', 'Embroidered']
    },
    {
        id: 'instant',
        name: 'Instant Hijabs',
        slug: 'instant-hijabs',
        subcategories: ['Tie-Back', 'Slip-On', 'Pinless']
    },
    {
        id: 'underscarves',
        name: 'Underscarves',
        slug: 'underscarves',
        subcategories: ['Cotton', 'Modal', 'Bamboo']
    },
    {
        id: 'shawls',
        name: 'Shawls',
        slug: 'shawls',
        subcategories: ['Pashmina', 'Cashmere', 'Wool Blend']
    },
    {
        id: 'accessories',
        name: 'Accessories',
        slug: 'accessories',
        subcategories: ['Pins', 'Magnets', 'Caps', 'Headbands']
    }
];

const defaultColors = [
    'Black',
    'White',
    'Nude',
    'Grey',
    'Navy',
    'Navy Blue',
    'Maroon',
    'Emerald',
    'Dusty Pink',
    'Sage Green',
    'Cream',
    'Brown',
    'Burgundy',
    'Lavender',
    'Mint',
    'Coral'
];

const defaultSizes = ['Standard', '45x45', '50x50', '55x55', '70x70'];

// Storage keys
const STORAGE_KEYS = {
    FABRICS: 'amrin_fabrics',
    CATEGORIES: 'amrin_categories',
    COLORS: 'amrin_colors',
    SIZES: 'amrin_sizes'
};

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Get fabrics
export function getFabrics() {
    if (!isBrowser) return defaultFabrics;
    const stored = localStorage.getItem(STORAGE_KEYS.FABRICS);
    return stored ? JSON.parse(stored) : defaultFabrics;
}

// Save fabrics
export function saveFabrics(fabrics) {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.FABRICS, JSON.stringify(fabrics));
}

// Get categories
export function getCategories() {
    if (!isBrowser) return defaultCategories;
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : defaultCategories;
}

// Save categories
export function saveCategories(categories) {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

// Get colors
export function getColors() {
    if (!isBrowser) return defaultColors;
    const stored = localStorage.getItem(STORAGE_KEYS.COLORS);
    return stored ? JSON.parse(stored) : defaultColors;
}

// Save colors
export function saveColors(colors) {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(colors));
}

// Get sizes
export function getSizes() {
    if (!isBrowser) return defaultSizes;
    const stored = localStorage.getItem(STORAGE_KEYS.SIZES);
    return stored ? JSON.parse(stored) : defaultSizes;
}

// Save sizes
export function saveSizes(sizes) {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.SIZES, JSON.stringify(sizes));
}

// Reset to defaults
export function resetToDefaults() {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.FABRICS, JSON.stringify(defaultFabrics));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(defaultColors));
    localStorage.setItem(STORAGE_KEYS.SIZES, JSON.stringify(defaultSizes));
}

// Export defaults for reference
export const defaults = {
    fabrics: defaultFabrics,
    categories: defaultCategories,
    colors: defaultColors,
    sizes: defaultSizes
};
