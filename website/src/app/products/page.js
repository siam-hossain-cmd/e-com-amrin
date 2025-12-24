'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

// Icons
const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const GridIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
);

// Hijab & Scarf Products
const allProducts = [
    { id: 1, name: 'Premium Chiffon Hijab', brand: 'Amrin Essentials', price: 45, originalPrice: 59, category: 'hijabs', material: 'Chiffon', size: ['Standard'], image: null },
    { id: 2, name: 'Luxury Satin Silk Shawl', brand: 'Amrin Luxe', price: 89, originalPrice: null, category: 'scarves', material: 'Satin Silk', size: ['Standard'], image: null, isNew: true },
    { id: 3, name: 'Jersey Instant Hijab', brand: 'Amrin Easy Wear', price: 35, originalPrice: 45, category: 'instant', material: 'Jersey', size: ['Standard'], image: null },
    { id: 4, name: 'Modal Cotton Underscarf', brand: 'Amrin Basics', price: 18, originalPrice: null, category: 'underscarves', material: 'Modal', size: ['Standard'], image: null, isNew: true },
    { id: 5, name: 'Pashmina Cashmere Scarf', brand: 'Amrin Premium', price: 120, originalPrice: 150, category: 'scarves', material: 'Cashmere', size: ['Standard'], image: null },
    { id: 6, name: 'Pleated Chiffon Hijab', brand: 'Amrin Essentials', price: 55, originalPrice: null, category: 'hijabs', material: 'Chiffon', size: ['Standard'], image: null, isNew: true },
    { id: 7, name: 'Printed Voile Square Scarf', brand: 'Amrin Prints', price: 42, originalPrice: 55, category: 'scarves', material: 'Voile', size: ['Standard'], image: null },
    { id: 8, name: 'Crepe Premium Hijab', brand: 'Amrin Luxe', price: 65, originalPrice: null, category: 'hijabs', material: 'Crepe', size: ['Standard'], image: null, isNew: true },
    { id: 9, name: 'Cotton Jersey Underscarf', brand: 'Amrin Basics', price: 15, originalPrice: 20, category: 'underscarves', material: 'Cotton Jersey', size: ['Standard'], image: null },
    { id: 10, name: 'Bawal Satin Square', brand: 'Amrin Essentials', price: 38, originalPrice: null, category: 'hijabs', material: 'Satin', size: ['45x45', '50x50'], image: null },
    { id: 11, name: 'Tie-Back Instant Hijab', brand: 'Amrin Easy Wear', price: 42, originalPrice: 52, category: 'instant', material: 'Jersey', size: ['Standard'], image: null },
    { id: 12, name: 'Floral Print Chiffon Shawl', brand: 'Amrin Prints', price: 58, originalPrice: null, category: 'scarves', material: 'Chiffon', size: ['Standard'], image: null, isNew: true },
];

// Default catalog data (fallback)
const defaultCategories = ['All', 'Hijabs', 'Scarves', 'Instant Hijabs', 'Underscarves'];
const defaultMaterials = ['Chiffon', 'Jersey', 'Satin Silk', 'Modal', 'Cotton', 'Cashmere', 'Crepe', 'Voile'];

const priceRanges = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under RM30', min: 0, max: 30 },
    { label: 'RM30 - RM60', min: 30, max: 60 },
    { label: 'RM60 - RM100', min: 60, max: 100 },
    { label: 'Over RM100', min: 100, max: Infinity },
];
const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'On Sale', value: 'sale' },
];

export default function ProductsPage() {
    const [categories, setCategories] = useState(defaultCategories);
    const [materials, setMaterials] = useState(defaultMaterials);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(true);

    // Load dynamic catalog data from API
    useEffect(() => {
        async function fetchCatalog() {
            try {
                const res = await fetch('/api/catalog');
                if (res.ok) {
                    const data = await res.json();
                    if (data.categories) {
                        setCategories(['All', ...data.categories.map(c => c.name)]);
                    }
                    if (data.fabrics) {
                        setMaterials(data.fabrics);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch catalog:', error);
                // Keep using defaults on error
            }
        }
        fetchCatalog();
    }, []);

    // Filter products
    let filteredProducts = allProducts.filter(product => {
        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory.toLowerCase()) {
            return false;
        }
        // Material filter
        if (selectedSize && product.material !== selectedSize) {
            return false;
        }
        // Price filter
        if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) {
            return false;
        }
        return true;
    });

    // Sort products
    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'sale':
                return (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0);
            default:
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
    });

    return (
        <>
            <Navbar />

            <div className="container" style={{ padding: '40px 24px' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                        {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredProducts.length} products found
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '32px' }}>
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <aside style={{ width: '240px', flexShrink: 0 }}>
                            {/* Categories */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Categories
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '8px 12px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                                color: selectedCategory === cat ? 'white' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Material/Fabric */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Fabric
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {materials.map(material => (
                                        <button
                                            key={material}
                                            onClick={() => setSelectedSize(selectedSize === material ? null : material)}
                                            style={{
                                                padding: '8px 12px',
                                                border: selectedSize === material ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                borderRadius: '6px',
                                                background: selectedSize === material ? 'var(--primary)' : 'white',
                                                color: selectedSize === material ? 'white' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Price
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {priceRanges.map((range, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedPriceRange(range)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '8px 12px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                background: selectedPriceRange === range ? 'var(--bg-secondary)' : 'transparent',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setSelectedSize(null);
                                    setSelectedPriceRange(priceRanges[0]);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Clear All Filters
                            </button>
                        </aside>
                    )}

                    {/* Products Grid */}
                    <div style={{ flex: 1 }}>
                        {/* Toolbar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                <FilterIcon /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '10px 16px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Products */}
                        {filteredProducts.length > 0 ? (
                            <div className="products-grid" style={{
                                gridTemplateColumns: showFilters ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
                            }}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No products found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
