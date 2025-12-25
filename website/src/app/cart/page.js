'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

export default function CartPage() {
    const { user } = useAuth();
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
    const router = useRouter();

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                </div>
                <Footer />
            </>
        );
    }

    if (cart.items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container" style={{
                    padding: '80px 24px',
                    textAlign: 'center',
                    minHeight: '60vh'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>Your bag is empty</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Looks like you haven't added anything to your bag yet.
                    </p>
                    <Link
                        href="/products"
                        style={{
                            display: 'inline-block',
                            padding: '14px 32px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600'
                        }}
                    >
                        Start Shopping
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const handleCheckout = () => {
        if (!user) {
            router.push('/auth/login?redirect=/cart');
            return;
        }
        router.push('/checkout');
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>
                    Shopping Bag ({cart.items.length} items)
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
                    <div>
                        {cart.items.map((item, index) => (
                            <div
                                key={`${item.productId}-${item.size}-${item.color}`}
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    padding: '20px 0',
                                    borderBottom: index < cart.items.length - 1 ? '1px solid var(--border)' : 'none'
                                }}
                            >
                                <Link href={`/products/${item.productId}`}>
                                    <div style={{
                                        width: '120px',
                                        height: '150px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '12px' }}>No Image</div>
                                        )}
                                    </div>
                                </Link>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{item.brand}</div>
                                    <Link href={`/products/${item.productId}`}>
                                        <h3 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>{item.name}</h3>
                                    </Link>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                        {item.size && <span>Size: {item.size}</span>}
                                        {item.color && <span> | Color: {item.color}</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                            <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>−</button>
                                            <span style={{ width: '40px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.productId, item.size, item.color)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}><TrashIcon /></button>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>RM {(item.price * item.quantity).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', position: 'sticky', top: '100px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}><span>Subtotal</span><span>RM {cart.total.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}><span>Shipping</span><span style={{ color: 'var(--success)' }}>{cart.total >= 80 ? 'FREE' : 'RM 5'}</span></div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '16px' }}><span>Total</span><span>RM {(cart.total + (cart.total >= 80 ? 0 : 5)).toLocaleString()}</span></div>
                            {cart.total < 80 && (<p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 12px', borderRadius: '8px' }}>🚚 Add RM {80 - cart.total} more for FREE shipping!</p>)}
                            <button onClick={handleCheckout} style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>{user ? 'Proceed to Checkout' : 'Login to Checkout'}</button>
                            <Link href="/products" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--primary)' }}>Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
