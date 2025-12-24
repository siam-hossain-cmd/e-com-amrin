'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Icons
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// Sample cart items
const initialCartItems = [
    {
        id: 1,
        name: 'Premium Chiffon Hijab',
        brand: 'Amrin Essentials',
        color: 'Nude',
        price: 45,
        quantity: 2,
        image: null
    },
    {
        id: 2,
        name: 'Jersey Instant Hijab',
        brand: 'Amrin Easy Wear',
        color: 'Black',
        price: 35,
        quantity: 1,
        image: null
    },
    {
        id: 3,
        name: 'Modal Cotton Underscarf',
        brand: 'Amrin Basics',
        color: 'White',
        price: 18,
        quantity: 3,
        image: null
    }
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const updateQuantity = (id, change) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const applyPromo = () => {
        if (promoCode.toLowerCase() === 'raya20') {
            setPromoApplied(true);
            alert('Promo code applied! 20% discount');
        } else {
            alert('Invalid promo code');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = promoApplied ? subtotal * 0.2 : 0;
    const shipping = subtotal >= 80 ? 0 : 10;
    const total = subtotal - discount + shipping;

    return (
        <>
            <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

            <div style={{
                background: 'var(--bg-cream)',
                minHeight: '80vh',
                padding: '40px 0 80px'
            }}>
                <div className="container">
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '32px',
                        fontWeight: '400',
                        marginBottom: '40px'
                    }}>
                        Shopping Cart
                    </h1>

                    {cartItems.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 380px',
                            gap: '40px'
                        }}>
                            {/* Cart Items */}
                            <div>
                                {/* Header */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                                    gap: '20px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #e8e4df',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    color: '#999',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    <span>Product</span>
                                    <span style={{ textAlign: 'center' }}>Price</span>
                                    <span style={{ textAlign: 'center' }}>Quantity</span>
                                    <span style={{ textAlign: 'right' }}>Total</span>
                                    <span></span>
                                </div>

                                {/* Items */}
                                {cartItems.map(item => (
                                    <div key={item.id} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                                        gap: '20px',
                                        padding: '24px 0',
                                        borderBottom: '1px solid #e8e4df',
                                        alignItems: 'center'
                                    }}>
                                        {/* Product */}
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{
                                                width: '80px',
                                                height: '100px',
                                                background: '#f5f0ea',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '32px'
                                            }}>
                                                🧕
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                                                    {item.brand}
                                                </div>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#666' }}>
                                                    Color: {item.color}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div style={{ textAlign: 'center', fontWeight: '500' }}>
                                            RM {item.price}
                                        </div>

                                        {/* Quantity */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #e0e0e0',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <MinusIcon />
                                            </button>
                                            <span style={{ width: '32px', textAlign: 'center', fontWeight: '500' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #e0e0e0',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <PlusIcon />
                                            </button>
                                        </div>

                                        {/* Total */}
                                        <div style={{ textAlign: 'right', fontWeight: '600' }}>
                                            RM {item.price * item.quantity}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#999',
                                                padding: '8px'
                                            }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}

                                {/* Continue Shopping */}
                                <div style={{ marginTop: '24px' }}>
                                    <Link href="/products" style={{
                                        fontSize: '13px',
                                        color: '#c4a77d',
                                        textDecoration: 'underline'
                                    }}>
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <div style={{
                                    background: 'white',
                                    padding: '32px'
                                }}>
                                    <h2 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        marginBottom: '24px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        Order Summary
                                    </h2>

                                    {/* Promo Code */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px'
                                        }}>
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Promo code"
                                                disabled={promoApplied}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    border: '1px solid #e0e0e0',
                                                    fontSize: '14px'
                                                }}
                                            />
                                            <button
                                                onClick={applyPromo}
                                                disabled={promoApplied}
                                                style={{
                                                    padding: '12px 20px',
                                                    background: promoApplied ? '#e8e4df' : '#1a1a1a',
                                                    color: promoApplied ? '#999' : 'white',
                                                    border: 'none',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    cursor: promoApplied ? 'default' : 'pointer'
                                                }}
                                            >
                                                {promoApplied ? 'Applied' : 'Apply'}
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                                            Try: RAYA20 for 20% off
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        paddingBottom: '20px',
                                        borderBottom: '1px solid #e8e4df',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <span>Subtotal</span>
                                            <span>RM {subtotal}</span>
                                        </div>
                                        {promoApplied && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2e7d32' }}>
                                                <span>Discount (20%)</span>
                                                <span>-RM {discount.toFixed(0)}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <span>Shipping</span>
                                            <span style={{ color: shipping === 0 ? '#2e7d32' : 'inherit' }}>
                                                {shipping === 0 ? 'FREE' : `RM ${shipping}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '24px'
                                    }}>
                                        <span>Total</span>
                                        <span>RM {total.toFixed(0)}</span>
                                    </div>

                                    <Link href="/checkout" style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '16px',
                                        background: '#c4a77d',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        Proceed to Checkout
                                    </Link>

                                    <div style={{
                                        marginTop: '20px',
                                        fontSize: '12px',
                                        color: '#666',
                                        textAlign: 'center'
                                    }}>
                                        🔒 Secure checkout with SSL encryption
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div style={{
                                    marginTop: '16px',
                                    padding: '16px',
                                    background: 'white',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>
                                        WE ACCEPT
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        fontSize: '24px'
                                    }}>
                                        💳 🏧 📱
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            background: 'white'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
                            <h2 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '24px',
                                fontWeight: '400',
                                marginBottom: '12px'
                            }}>
                                Your cart is empty
                            </h2>
                            <p style={{ color: '#666', marginBottom: '24px' }}>
                                Looks like you haven&apos;t added anything yet
                            </p>
                            <Link href="/products" style={{
                                display: 'inline-block',
                                padding: '16px 32px',
                                background: '#1a1a1a',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase'
                            }}>
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
