'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Icons
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

// Sample cart data
const initialCartItems = [
    {
        id: 1,
        name: 'Classic White Cotton T-Shirt',
        brand: 'Amrin Basics',
        size: 'M',
        color: 'White',
        price: 1200,
        originalPrice: 1500,
        quantity: 2,
        image: null
    },
    {
        id: 2,
        name: 'Premium Denim Jacket',
        brand: 'Amrin Denim',
        size: 'L',
        color: 'Blue',
        price: 5000,
        originalPrice: null,
        quantity: 1,
        image: null
    }
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'WELCOME20') {
            setAppliedCoupon({ code: 'WELCOME20', type: 'percentage', value: 20 });
        } else if (couponCode.toUpperCase() === 'FLAT500') {
            setAppliedCoupon({ code: 'FLAT500', type: 'fixed', value: 500 });
        } else {
            alert('Invalid coupon code');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = cartItems.reduce((sum, item) => {
        if (item.originalPrice) {
            return sum + ((item.originalPrice - item.price) * item.quantity);
        }
        return sum;
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else {
            discount = appliedCoupon.value;
        }
    }

    const shipping = subtotal >= 80 ? 0 : 10;
    const total = subtotal - discount + shipping;

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Your cart is empty</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Looks like you haven&apos;t added anything yet.</p>
                    <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

            <div className="container" style={{ padding: '40px 24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Shopping Cart</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
                    {/* Cart Items */}
                    <div>
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    padding: '24px',
                                    borderBottom: '1px solid var(--border)'
                                }}
                            >
                                {/* Image */}
                                <div style={{
                                    width: '120px',
                                    height: '150px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-light)',
                                    fontSize: '12px',
                                    flexShrink: 0
                                }}>
                                    No Image
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        {item.brand}
                                    </div>
                                    <Link
                                        href={`/products/${item.id}`}
                                        style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', display: 'block' }}
                                    >
                                        {item.name}
                                    </Link>
                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        Size: {item.size} | Color: {item.color}
                                    </div>

                                    {/* Quantity */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '4px 0 0 4px',
                                                    background: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{
                                                width: '40px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderTop: '1px solid var(--border)',
                                                borderBottom: '1px solid var(--border)',
                                                fontSize: '14px'
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '0 4px 4px 0',
                                                    background: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                color: 'var(--text-secondary)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <TrashIcon /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700' }}>
                                        RM {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    {item.originalPrice && (
                                        <div style={{ fontSize: '14px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                            RM {(item.originalPrice * item.quantity).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h2>

                            {/* Coupon */}
                            {!appliedCoupon ? (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Coupon code"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius)',
                                                fontSize: '14px'
                                            }}
                                        />
                                        <button onClick={applyCoupon} className="btn btn-dark" style={{ padding: '12px 20px' }}>
                                            Apply
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                        Try: WELCOME20 or FLAT500
                                    </p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: 'var(--radius)',
                                    marginBottom: '24px'
                                }}>
                                    <div>
                                        <span style={{ fontWeight: '600', color: 'var(--success)' }}>{appliedCoupon.code}</span>
                                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>applied</span>
                                    </div>
                                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '14px' }}>
                                        Remove
                                    </button>
                                </div>
                            )}

                            {/* Summary Lines */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                    <span>RM {subtotal.toLocaleString()}</span>
                                </div>
                                {savings > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--success)' }}>Product Savings</span>
                                        <span style={{ color: 'var(--success)' }}>-RM {savings.toLocaleString()}</span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--success)' }}>Coupon Discount</span>
                                        <span style={{ color: 'var(--success)' }}>-৳ {discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                    <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
                                        {shipping === 0 ? 'FREE' : `৳ ${shipping}`}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '1px solid var(--border)',
                                marginTop: '16px',
                                paddingTop: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: '600' }}>Total</span>
                                <span style={{ fontSize: '24px', fontWeight: '700' }}>৳ {total.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px' }}>
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/products"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: '16px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px'
                                }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
