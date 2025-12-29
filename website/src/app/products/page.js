'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryBanner from '@/components/CategoryBanner';
import SidebarBanner from '@/components/SidebarBanner';

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

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div style={{
            width: '40px', height: '40px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #c4a77d',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
);

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

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(defaultCategories);
    const [materials, setMaterials] = useState(defaultMaterials);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(true);

    // Set initial category from URL params
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            // Convert slug to display name
            const categoryMap = {
                'hijabs': 'Hijabs',
                'scarves': 'Scarves',
                'instant-hijabs': 'Instant Hijabs',
                'underscarves': 'Underscarves',
                'shawls': 'Shawls',
                'accessories': 'Accessories'
            };
            setSelectedCategory(categoryMap[categoryParam] || 'All');
        }
    }, [searchParams]);

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch('/api/products?limit=100');
                if (res.ok) {
                    const data = await res.json();
                    // Transform products to match expected format
                    const transformed = data.map(p => ({
                        id: p._id,
                        name: p.name,
                        brand: p.brand || 'Amrin',
                        price: p.basePrice,
                        originalPrice: p.originalPrice || null,
                        category: (p.category || '').toLowerCase().replace(' ', '-'),
                        material: p.fabric || '',
                        image: p.image?.url || null,
                        isNew: p.isNew || false
                    }));
                    setProducts(transformed);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Load catalog data (categories, fabrics) from API
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
            }
        }
        fetchCatalog();
    }, []);

    // Filter products
    let filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategory !== 'All') {
            const productCat = product.category.toLowerCase().replace('-', ' ');
            const selectedCat = selectedCategory.toLowerCase();
            if (!productCat.includes(selectedCat) && productCat !== selectedCat) {
                return false;
            }
        }
        // Material filter
        if (selectedMaterial && product.material !== selectedMaterial) {
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
                        <aside style={{ width: '260px', flexShrink: 0 }}>
                            {/* Sidebar Banner */}
                            <div style={{ marginBottom: '24px' }}>
                                <SidebarBanner />
                            </div>

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
                                            onClick={() => setSelectedMaterial(selectedMaterial === material ? null : material)}
                                            style={{
                                                padding: '8px 12px',
                                                border: selectedMaterial === material ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                borderRadius: '6px',
                                                background: selectedMaterial === material ? 'var(--primary)' : 'white',
                                                color: selectedMaterial === material ? 'white' : 'var(--text-primary)',
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
                                    setSelectedMaterial(null);
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
                        {/* Category Banner */}
                        <CategoryBanner />

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
                        {loading ? (
                            <LoadingSpinner />
                        ) : filteredProducts.length > 0 ? (
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

// Loading fallback
function ProductsLoading() {
    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '3px solid #f0f0f0',
                    borderTop: '3px solid #c4a77d',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
            <Footer />
        </>
    );
}

// Main export with Suspense boundary
export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsContent />
        </Suspense>
    );
}
