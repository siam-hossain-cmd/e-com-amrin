'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Icons
const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
);

// Sample product data
const productData = {
    id: 1,
    name: 'Classic White Cotton T-Shirt',
    brand: 'Amrin Basics',
    price: 1200,
    originalPrice: 1500,
    description: 'A timeless essential crafted from 100% premium cotton. Features a comfortable regular fit, ribbed crew neck, and soft hand feel. Perfect for everyday wear or as a layering piece.',
    images: [null, null, null, null],
    variants: [
        { size: 'S', color: 'White', stock: 15 },
        { size: 'M', color: 'White', stock: 25 },
        { size: 'L', color: 'White', stock: 10 },
        { size: 'XL', color: 'White', stock: 0 },
    ],
    colors: ['White', 'Black', 'Navy'],
    details: [
        '100% Premium Cotton',
        'Regular Fit',
        'Ribbed Crew Neck',
        'Machine Washable',
        'Imported'
    ]
};

const relatedProducts = [
    { id: 2, name: 'Premium Denim Jacket', brand: 'Amrin Denim', price: 5000, originalPrice: null, image: null, isNew: true },
    { id: 4, name: 'Cotton Polo Shirt - Navy', brand: 'Amrin Basics', price: 1500, originalPrice: null, image: null, isNew: true },
    { id: 6, name: 'Casual Linen Shirt', brand: 'Amrin Men', price: 1800, originalPrice: null, image: null, isNew: true },
    { id: 12, name: 'Classic Oxford Shirt', brand: 'Amrin Basics', price: 2000, originalPrice: null, image: null },
];

export default function ProductDetailPage() {
    const params = useParams();
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const product = productData; // In real app, fetch based on params.id

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    const isOutOfStock = selectedVariant && selectedVariant.stock === 0;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        alert(`Added ${quantity} x ${product.name} (${selectedSize}) to cart`);
    };

    return (
        <>
            <Navbar />

            <div className="container" style={{ padding: '40px 24px' }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
                    {' / '}
                    <Link href="/products" style={{ color: 'var(--text-secondary)' }}>Products</Link>
                    {' / '}
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </div>

                {/* Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }}>
                    {/* Images */}
                    <div>
                        <div style={{
                            aspectRatio: '3/4',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-light)'
                        }}>
                            No Image
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            {product.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    style={{
                                        aspectRatio: '1',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius)',
                                        border: activeImage === index ? '2px solid var(--primary)' : '2px solid transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'var(--text-light)'
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                            {product.brand}
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '28px', fontWeight: '700' }}>RM {product.price.toLocaleString()}</span>
                            {hasDiscount && (
                                <>
                                    <span style={{ fontSize: '18px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                        RM {product.originalPrice.toLocaleString()}
                                    </span>
                                    <span style={{
                                        background: 'var(--accent)',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '100px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        -{discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7' }}>
                            {product.description}
                        </p>

                        {/* Color Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                                Color: <span style={{ fontWeight: '400' }}>{selectedColor}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: selectedColor === color ? '2px solid var(--primary)' : '2px solid var(--border)',
                                            background: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : color.toLowerCase(),
                                            cursor: 'pointer',
                                            padding: '3px'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>Size</span>
                                <button style={{ fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Size Guide
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {product.variants.map(variant => (
                                    <button
                                        key={variant.size}
                                        onClick={() => setSelectedSize(variant.size)}
                                        disabled={variant.stock === 0}
                                        style={{
                                            minWidth: '50px',
                                            padding: '12px 16px',
                                            border: selectedSize === variant.size ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            borderRadius: 'var(--radius)',
                                            background: variant.stock === 0 ? 'var(--bg-secondary)' : 'white',
                                            color: variant.stock === 0 ? 'var(--text-light)' : 'var(--text-primary)',
                                            cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            textDecoration: variant.stock === 0 ? 'line-through' : 'none'
                                        }}
                                    >
                                        {variant.size}
                                    </button>
                                ))}
                            </div>
                            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
                                <p style={{ fontSize: '13px', color: 'var(--warning)', marginTop: '8px' }}>
                                    Only {selectedVariant.stock} left in stock!
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Quantity</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                <button
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius) 0 0 var(--radius)',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontSize: '18px'
                                    }}
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{
                                        width: '60px',
                                        height: '40px',
                                        border: '1px solid var(--border)',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        textAlign: 'center',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0 var(--radius) var(--radius) 0',
                                        background: 'white',
                                        cursor: 'pointer',
                                        fontSize: '18px'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="btn btn-primary"
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    opacity: isOutOfStock ? 0.5 : 1,
                                    cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '16px 20px' }}
                            >
                                <HeartIcon />
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div style={{
                            padding: '20px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                                <TruckIcon />
                                <span>Free shipping on orders over RM80</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                                <RefreshIcon />
                                <span>7-day easy returns</span>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div style={{ marginTop: '32px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Product Details</h3>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '2' }}>
                                {product.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <section>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>You May Also Like</h2>
                    <div className="products-grid">
                        {relatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
