'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Generate random order number
const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
const orderDate = new Date().toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Sample order data
const orderData = {
    items: [
        { id: 1, name: 'Premium Chiffon Hijab', color: 'Nude', price: 45, quantity: 2 },
        { id: 2, name: 'Jersey Instant Hijab', color: 'Black', price: 35, quantity: 1 },
        { id: 3, name: 'Modal Cotton Underscarf', color: 'White', price: 18, quantity: 3 }
    ],
    subtotal: 179,
    shipping: 0,
    total: 179,
    shippingAddress: {
        name: 'Siam Hossain',
        address: 'Pearl Point Condominium, Jalan Sepadu 3, 1A-21-1',
        city: 'WP Kuala Lumpur',
        postcode: '58200',
        phone: '+60 12-345 6789'
    },
    paymentMethod: 'Credit Card ending in 4242'
};

export default function OrderConfirmationPage() {
    return (
        <>
            <Navbar />

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
                            fontSize: '36px'
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
                                        {orderNumber}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Order Date
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                        {orderDate}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Total
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                        RM {orderData.total}
                                    </div>
                                </div>
                            </div>

                            {/* Estimated Delivery */}
                            <div style={{
                                padding: '20px 0',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    📦 Estimated Delivery
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
                                    {orderData.shippingAddress.name}<br />
                                    {orderData.shippingAddress.address}<br />
                                    {orderData.shippingAddress.city} {orderData.shippingAddress.postcode}<br />
                                    {orderData.shippingAddress.phone}
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
                                    💳 {orderData.paymentMethod}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
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

                            {orderData.items.map(item => (
                                <div key={item.id} style={{
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
                                                {item.color} × {item.quantity}
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
                                    <span>RM {orderData.subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#2e7d32' }}>FREE</span>
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
                                    <span>RM {orderData.total}</span>
                                </div>
                            </div>
                        </div>

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
                                textTransform: 'uppercase'
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
                                textTransform: 'uppercase'
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
                            <a href="mailto:support@amrin.my" style={{ color: '#c4a77d', fontWeight: '500' }}>
                                Contact our support team
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
