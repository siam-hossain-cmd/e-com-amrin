'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Clear cart on confirmation page load
        if (clearCart) {
            clearCart();
        }
    }, [clearCart]);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/orders?orderId=${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Find the specific order if multiple returned
                    const foundOrder = Array.isArray(data)
                        ? data.find(o => o.orderId === orderId)
                        : data;
                    setOrder(foundOrder);
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    const orderDate = new Date().toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '80px' }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '3px solid #f0f0f0',
                    borderTop: '3px solid #c4a77d',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--bg-cream)',
            minHeight: '80vh',
            padding: '60px 0 80px'
        }}>
            <div className="container">
                {/* Success Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#e8f5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        fontSize: '36px',
                        color: '#2e7d32'
                    }}>
                        ✓
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '32px',
                        fontWeight: '400',
                        marginBottom: '12px'
                    }}>
                        Thank You for Your Order!
                    </h1>
                    <p style={{ color: '#666', fontSize: '15px' }}>
                        Order confirmation has been sent to your email
                    </p>
                </div>

                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {/* Order Info */}
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '24px',
                            textAlign: 'center',
                            paddingBottom: '24px',
                            borderBottom: '1px solid #e8e4df'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Order Number
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {orderId || 'Processing...'}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Order Date
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' }) : orderDate}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Total
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    RM {order?.total || 0}
                                </div>
                            </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div style={{
                            padding: '20px 0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                                Estimated Delivery
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#c4a77d' }}>
                                3-5 Business Days
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '24px'
                    }}>
                        {/* Shipping Address */}
                        <div style={{ background: 'white', padding: '24px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Shipping Address
                            </h3>
                            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>
                                {order?.customer?.name || `${order?.customer?.firstName || ''} ${order?.customer?.lastName || ''}`}<br />
                                {order?.shippingAddress?.address}<br />
                                {order?.shippingAddress?.city} {order?.shippingAddress?.postcode}<br />
                                {order?.customer?.phone}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{ background: 'white', padding: '24px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Payment Method
                            </h3>
                            <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {order?.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                    order?.paymentMethod === 'card' ? 'Credit/Debit Card' :
                                        order?.paymentMethod === 'fpx' ? 'Online Banking (FPX)' :
                                            order?.paymentMethod === 'ewallet' ? 'E-Wallet' :
                                                order?.paymentMethod || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    {order?.items && order.items.length > 0 && (
                        <div style={{ background: 'white', padding: '24px', marginBottom: '24px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '20px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Order Items
                            </h3>

                            {order.items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            background: '#f5f0ea',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px'
                                        }}>
                                            🧕
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                                            <div style={{ fontSize: '13px', color: '#999' }}>
                                                {item.size}{item.color ? `, ${item.color}` : ''} × {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>
                                        RM {item.price * item.quantity}
                                    </div>
                                </div>
                            ))}

                            {/* Totals */}
                            <div style={{ marginTop: '20px', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span>Subtotal</span>
                                    <span>RM {order.subtotal || 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: order.shipping === 0 ? '#2e7d32' : 'inherit' }}>
                                        {order.shipping === 0 ? 'FREE' : `RM ${order.shipping}`}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e8e4df'
                                }}>
                                    <span>Total</span>
                                    <span>RM {order.total}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center'
                    }}>
                        <Link href="/account" style={{
                            padding: '16px 32px',
                            background: 'white',
                            color: '#1a1a1a',
                            border: '1px solid #1a1a1a',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            textDecoration: 'none'
                        }}>
                            View Order History
                        </Link>
                        <Link href="/products" style={{
                            padding: '16px 32px',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            textDecoration: 'none'
                        }}>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Help */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '40px',
                        padding: '24px',
                        background: 'white'
                    }}>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                            Need help with your order?
                        </p>
                        <a href="mailto:support@amrinexclusive.com" style={{ color: '#c4a77d', fontWeight: '500' }}>
                            Contact our support team
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div style={{ textAlign: 'center', padding: '80px' }}>Loading...</div>
            }>
                <OrderConfirmationContent />
            </Suspense>
            <Footer />
        </>
    );
}
