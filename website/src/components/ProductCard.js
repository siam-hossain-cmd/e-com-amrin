'use client';

import Link from 'next/link';

const HeartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

export default function ProductCard({ product }) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <Link href={`/products/${product.id}`} className="product-card">
            <div className="product-card-image">
                {product.image ? (
                    <img src={product.image} alt={product.name} />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-light)',
                        fontSize: '14px'
                    }}>
                        No Image
                    </div>
                )}

                {hasDiscount && (
                    <span className="product-card-badge">-{discountPercent}%</span>
                )}

                {product.isNew && !hasDiscount && (
                    <span className="product-card-badge" style={{ background: '#000' }}>NEW</span>
                )}

                <button
                    className="product-card-wishlist"
                    onClick={(e) => {
                        e.preventDefault();
                        // Add to wishlist logic
                    }}
                >
                    <HeartIcon />
                </button>
            </div>

            <div className="product-card-body">
                <div className="product-card-brand">{product.brand}</div>
                <h3 className="product-card-title">{product.name}</h3>
                <div className="product-card-price">
                    <span className="product-card-price-current">RM {product.price.toLocaleString()}</span>
                    {hasDiscount && (
                        <>
                            <span className="product-card-price-original">RM {product.originalPrice.toLocaleString()}</span>
                            <span className="product-card-discount">-{discountPercent}%</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
