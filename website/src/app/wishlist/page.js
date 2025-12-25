'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const { addToCart } = useCart();
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWishlist() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/wishlist?userId=${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setWishlist(data.items || []);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchWishlist();
        }
    }, [user, authLoading]);

    const removeFromWishlist = async (productId) => {
        try {
            await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, productId })
            });
            setWishlist(wishlist.filter(item => item.productId !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const moveToCart = async (item) => {
        addToCart({
            _id: item.productId,
            name: item.name,
            brand: item.brand,
            image: { url: item.image },
            basePrice: item.price
        }, { size: 'Standard', color: '' }, 1);
        await removeFromWishlist(item.productId);
    };

    if (authLoading || loading) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: '60px 24px', textAlign: 'center', minHeight: '60vh' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>❤️</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>Your Wishlist</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Sign in to save your favorite items
                    </p>
                    <Link href="/auth/login?redirect=/wishlist" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
                        Sign In
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
                <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ← Back to Profile
                </Link>

                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#dc2626' }}><HeartIcon /></span>
                    My Wishlist ({wishlist.length})
                </h1>

                {wishlist.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '60px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💝</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Save items you love by clicking the heart icon on products
                        </p>
                        <Link href="/products" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {wishlist.map((item) => (
                            <div key={item.productId} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <Link href={`/products/${item.productId}`}>
                                    <div style={{ height: '200px', background: 'var(--bg-secondary)' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>No Image</div>
                                        )}
                                    </div>
                                </Link>
                                <div style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{item.brand}</p>
                                    <Link href={`/products/${item.productId}`}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', lineHeight: 1.4 }}>{item.name}</h3>
                                    </Link>
                                    <p style={{ fontWeight: '600', marginBottom: '16px' }}>RM {item.price}</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => moveToCart(item)} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                                            Add to Bag
                                        </button>
                                        <button onClick={() => removeFromWishlist(item.productId)} style={{ width: '40px', border: '1px solid var(--border)', borderRadius: '6px', background: 'white', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
