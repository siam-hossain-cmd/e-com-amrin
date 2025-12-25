'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// Icons
const HeartIcon = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const TruckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ChevronDown = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

// Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ borderBottom: '1px solid var(--border)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600'
                }}
            >
                {title}
                <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <ChevronDown />
                </span>
            </button>
            {isOpen && (
                <div style={{ paddingBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const recommendedRef = useRef(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${params.id}`);

                if (!res.ok) {
                    throw new Error('Product not found');
                }

                const data = await res.json();
                setProduct(data);

                if (data.variants && data.variants.length > 0) {
                    setSelectedSize(data.variants[0].size);
                    setSelectedColor(data.variants[0].color);
                }

                // Fetch related products
                const relatedRes = await fetch(`/api/products?limit=10&category=${data.category}`);
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedProducts(relatedData.filter(p => p._id !== data._id));
                }
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    // Check if product is in wishlist
    useEffect(() => {
        async function checkWishlist() {
            if (!user || !product) return;
            try {
                const res = await fetch(`/api/wishlist?userId=${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    const inWishlist = data.items?.some(item => item.productId === product._id);
                    setIsWishlisted(inWishlist);
                }
            } catch (error) {
                console.error('Failed to check wishlist:', error);
            }
        }
        checkWishlist();
    }, [user, product]);

    const toggleWishlist = async () => {
        if (!user) {
            router.push('/auth/login?redirect=/products/' + params.id);
            return;
        }

        try {
            if (isWishlisted) {
                // Remove from wishlist
                await fetch('/api/wishlist', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.uid, productId: product._id })
                });
            } else {
                // Add to wishlist
                await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.uid, product })
                });
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        }
    };

    const scrollRecommended = (direction) => {
        if (recommendedRef.current) {
            const scrollAmount = 300;
            recommendedRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner />
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Product Not Found</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.basePrice / product.originalPrice) * 100)
        : 0;

    const sizes = [...new Set(product.variants?.map(v => v.size) || [])];
    const colors = [...new Set(product.variants?.map(v => v.color) || [])];
    const selectedVariant = product.variants?.find(
        v => v.size === selectedSize && (colors.length === 0 || v.color === selectedColor)
    );
    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

    // Generate product images array (use product image + placeholder gallery)
    const productImages = product.image?.url
        ? [product.image.url]
        : [];

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }

        addToCart(product, selectedVariant || { size: selectedSize, color: selectedColor }, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const getColorStyle = (color) => {
        const colorMap = {
            'white': '#fff', 'black': '#000', 'navy': '#1a365d', 'navy blue': '#1a365d',
            'nude': '#e8d3c8', 'grey': '#6b7280', 'maroon': '#800020', 'emerald': '#047857',
            'dusty pink': '#d4a5a5', 'sage green': '#9caf88', 'cream': '#fffdd0',
            'brown': '#8b4513', 'burgundy': '#722f37'
        };
        return colorMap[color?.toLowerCase()] || color;
    };

    return (
        <>
            <Navbar />

            <div className="container" style={{ padding: '24px' }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
                    {' / '}
                    <Link href="/products" style={{ color: 'var(--text-secondary)' }}>Products</Link>
                    {product.category && (
                        <>
                            {' / '}
                            <Link href={`/products?category=${product.category}`} style={{ color: 'var(--text-secondary)' }}>
                                {product.category}
                            </Link>
                        </>
                    )}
                    {' / '}
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </div>

                {/* Main Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '40px', marginBottom: '60px' }}>

                    {/* Left: Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div style={{
                            aspectRatio: '1',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {productImages.length > 0 ? (
                                <img
                                    src={productImages[activeImageIndex]}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ color: 'var(--text-light)', fontSize: '18px' }}>No Image Available</span>
                            )}

                            {hasDiscount && (
                                <span style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    background: '#dc2626',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}>
                                    -{discountPercent}%
                                </span>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {productImages.length > 1 && (
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            flexShrink: 0,
                                            border: activeImageIndex === index ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            background: 'var(--bg-secondary)'
                                        }}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        {/* Brand */}
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            {product.brand}
                        </div>

                        {/* Title */}
                        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '16px', lineHeight: 1.3 }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '24px', fontWeight: '700' }}>RM {product.basePrice?.toLocaleString()}</span>
                            {hasDiscount && (
                                <>
                                    <span style={{ fontSize: '16px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                        RM {product.originalPrice.toLocaleString()}
                                    </span>
                                    <span style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>
                                        {discountPercent}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                    <strong>Color:</strong> {selectedColor}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: selectedColor === color ? '3px solid var(--primary)' : '2px solid var(--border)',
                                                background: getColorStyle(color),
                                                cursor: 'pointer',
                                                padding: '2px'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {sizes.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                    <strong>Size:</strong> {selectedSize || 'Select a size'}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {sizes.map(size => {
                                        const variant = product.variants.find(v => v.size === size);
                                        const outOfStock = !variant || variant.stock === 0;
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => !outOfStock && setSelectedSize(size)}
                                                disabled={outOfStock}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                    borderRadius: '4px',
                                                    background: outOfStock ? 'var(--bg-secondary)' : 'white',
                                                    color: outOfStock ? 'var(--text-light)' : 'var(--text-primary)',
                                                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                                                    fontSize: '14px',
                                                    textDecoration: outOfStock ? 'line-through' : 'none'
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add to Bag + Wishlist */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={totalStock === 0 || addedToCart}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: addedToCart ? '#10b981' : (totalStock === 0 ? 'var(--bg-secondary)' : 'var(--primary)'),
                                    color: totalStock === 0 && !addedToCart ? 'var(--text-light)' : 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: totalStock === 0 ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.3s ease'
                                }}
                            >
                                {addedToCart ? '✓ Added to Bag!' : (totalStock === 0 ? 'Out of Stock' : 'Add to Bag')}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                style={{
                                    width: '52px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isWishlisted ? '#dc2626' : 'var(--text-secondary)'
                                }}
                            >
                                <HeartIcon filled={isWishlisted} />
                            </button>
                        </div>

                        {/* Delivery Info Box */}
                        <div style={{
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ fontWeight: '600', marginBottom: '12px' }}>Delivery</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                <TruckIcon />
                                <span>Select a size to view delivery information</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <div style={{ marginBottom: '4px' }}><ShieldIcon /></div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>100% Authentic</div>
                            </div>
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <div style={{ marginBottom: '4px' }}><RefreshIcon /></div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Easy Returns</div>
                            </div>
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <div style={{ marginBottom: '4px' }}><TruckIcon /></div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fast Delivery</div>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div>
                            <Accordion title="Product Information" defaultOpen={true}>
                                {product.description ? (
                                    <p>{product.description}</p>
                                ) : (
                                    <p>No product description available.</p>
                                )}
                                <div style={{ marginTop: '12px' }}>
                                    <strong>Details:</strong>
                                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                        {product.category && <li>Category: {product.category}</li>}
                                        {product.fabric && <li>Fabric: {product.fabric}</li>}
                                        {selectedVariant?.sku && <li>SKU: {selectedVariant.sku}</li>}
                                    </ul>
                                </div>
                            </Accordion>

                            <Accordion title="Material & Care">
                                <ul style={{ paddingLeft: '20px' }}>
                                    {product.fabric && <li>Material: {product.fabric}</li>}
                                    <li>Hand wash or machine wash on gentle cycle</li>
                                    <li>Do not bleach</li>
                                    <li>Iron on low heat if needed</li>
                                    <li>Do not tumble dry</li>
                                </ul>
                            </Accordion>

                            <Accordion title="Shipping & Returns">
                                <ul style={{ paddingLeft: '20px' }}>
                                    <li>Free shipping on orders over RM 80</li>
                                    <li>Standard delivery: 3-5 business days</li>
                                    <li>Express delivery available</li>
                                    <li>7-day easy returns</li>
                                    <li>Items must be unworn with tags attached</li>
                                </ul>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* Recommended Products - Horizontal Scroll */}
                {relatedProducts.length > 0 && (
                    <section style={{ marginBottom: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recommended for you</h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => scrollRecommended('left')}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '50%',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    onClick={() => scrollRecommended('right')}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '50%',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={recommendedRef}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                overflowX: 'auto',
                                scrollBehavior: 'smooth',
                                paddingBottom: '16px',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            {relatedProducts.map(p => (
                                <div key={p._id} style={{ flexShrink: 0, width: '220px' }}>
                                    <ProductCard
                                        product={{
                                            id: p._id,
                                            name: p.name,
                                            brand: p.brand,
                                            price: p.basePrice,
                                            originalPrice: p.originalPrice,
                                            image: p.image?.url,
                                            isNew: p.isNew
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />

            <style jsx global>{`
                /* Hide scrollbar for recommended products */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
