'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Sample cart data (would come from context/state in real app)
const cartItems = [
    { id: 1, name: 'Premium Chiffon Hijab', color: 'Nude', price: 45, quantity: 2 },
    { id: 2, name: 'Jersey Instant Hijab', color: 'Black', price: 35, quantity: 1 },
    { id: 3, name: 'Modal Cotton Underscarf', color: 'White', price: 18, quantity: 3 }
];

const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const shipping = subtotal >= 80 ? 0 : 10;
const total = subtotal + shipping;

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        country: 'Malaysia'
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const handleShippingChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            // Process payment
            window.location.href = '/order-confirmation';
        }
    };

    return (
        <>
            <Navbar />

            <div style={{
                background: 'var(--bg-cream)',
                minHeight: '80vh',
                padding: '40px 0 80px'
            }}>
                <div className="container">
                    {/* Progress Steps */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '80px',
                        marginBottom: '48px'
                    }}>
                        {['Shipping', 'Payment', 'Confirm'].map((label, index) => (
                            <div key={label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: step > index ? '#1a1a1a' : step === index + 1 ? '#c4a77d' : '#e0e0e0',
                                    color: step >= index + 1 ? 'white' : '#999',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}>
                                    {step > index + 1 ? '✓' : index + 1}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: step === index + 1 ? '600' : '400',
                                    color: step === index + 1 ? '#1a1a1a' : '#999'
                                }}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 400px',
                        gap: '40px'
                    }}>
                        {/* Main Form */}
                        <div style={{ background: 'white', padding: '32px' }}>
                            <form onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <>
                                        <h2 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '24px',
                                            paddingBottom: '16px',
                                            borderBottom: '1px solid #e8e4df'
                                        }}>
                                            Shipping Information
                                        </h2>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={shippingData.email}
                                                onChange={handleShippingChange}
                                                required
                                                style={inputStyle}
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                            <div>
                                                <label style={labelStyle}>First Name *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={shippingData.firstName}
                                                    onChange={handleShippingChange}
                                                    required
                                                    style={inputStyle}
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Last Name *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={shippingData.lastName}
                                                    onChange={handleShippingChange}
                                                    required
                                                    style={inputStyle}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={shippingData.phone}
                                                onChange={handleShippingChange}
                                                required
                                                style={inputStyle}
                                                placeholder="+60 12-345 6789"
                                            />
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Address *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={shippingData.address}
                                                onChange={handleShippingChange}
                                                required
                                                style={inputStyle}
                                                placeholder="Street address, apartment, suite, etc."
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                            <div>
                                                <label style={labelStyle}>City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={shippingData.city}
                                                    onChange={handleShippingChange}
                                                    required
                                                    style={inputStyle}
                                                    placeholder="Kuala Lumpur"
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>State *</label>
                                                <select
                                                    name="state"
                                                    value={shippingData.state}
                                                    onChange={handleShippingChange}
                                                    required
                                                    style={inputStyle}
                                                >
                                                    <option value="">Select State</option>
                                                    <option value="WP Kuala Lumpur">WP Kuala Lumpur</option>
                                                    <option value="Selangor">Selangor</option>
                                                    <option value="Johor">Johor</option>
                                                    <option value="Penang">Penang</option>
                                                    <option value="Perak">Perak</option>
                                                    <option value="Sabah">Sabah</option>
                                                    <option value="Sarawak">Sarawak</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                                            <div>
                                                <label style={labelStyle}>Postcode *</label>
                                                <input
                                                    type="text"
                                                    name="postcode"
                                                    value={shippingData.postcode}
                                                    onChange={handleShippingChange}
                                                    required
                                                    style={inputStyle}
                                                    placeholder="50000"
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={shippingData.country}
                                                    disabled
                                                    style={{ ...inputStyle, background: '#f5f5f5' }}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" style={buttonStyle}>
                                            Continue to Payment
                                        </button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <h2 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            marginBottom: '24px',
                                            paddingBottom: '16px',
                                            borderBottom: '1px solid #e8e4df'
                                        }}>
                                            Payment Method
                                        </h2>

                                        {/* Payment Options */}
                                        <div style={{ marginBottom: '24px' }}>
                                            {[
                                                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                                { id: 'fpx', label: 'Online Banking (FPX)', icon: '🏧' },
                                                { id: 'ewallet', label: 'E-Wallet (Touch n Go, GrabPay)', icon: '📱' },
                                                { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                                            ].map(option => (
                                                <label
                                                    key={option.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        padding: '16px',
                                                        border: paymentMethod === option.id ? '2px solid #c4a77d' : '1px solid #e0e0e0',
                                                        marginBottom: '12px',
                                                        cursor: 'pointer',
                                                        background: paymentMethod === option.id ? '#faf8f5' : 'white'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={option.id}
                                                        checked={paymentMethod === option.id}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        style={{ width: '18px', height: '18px' }}
                                                    />
                                                    <span style={{ fontSize: '24px' }}>{option.icon}</span>
                                                    <span style={{ fontWeight: '500' }}>{option.label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Card Details */}
                                        {paymentMethod === 'card' && (
                                            <div style={{
                                                padding: '24px',
                                                background: '#f5f5f5',
                                                marginBottom: '24px'
                                            }}>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <label style={labelStyle}>Card Number *</label>
                                                    <input
                                                        type="text"
                                                        name="number"
                                                        value={cardData.number}
                                                        onChange={handleCardChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <label style={labelStyle}>Name on Card *</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={cardData.name}
                                                        onChange={handleCardChange}
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <div>
                                                        <label style={labelStyle}>Expiry Date *</label>
                                                        <input
                                                            type="text"
                                                            name="expiry"
                                                            value={cardData.expiry}
                                                            onChange={handleCardChange}
                                                            placeholder="MM/YY"
                                                            style={inputStyle}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>CVV *</label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            value={cardData.cvv}
                                                            onChange={handleCardChange}
                                                            placeholder="123"
                                                            style={inputStyle}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                style={{
                                                    ...buttonStyle,
                                                    background: 'white',
                                                    color: '#1a1a1a',
                                                    border: '1px solid #1a1a1a'
                                                }}
                                            >
                                                Back
                                            </button>
                                            <button type="submit" style={buttonStyle}>
                                                Place Order - RM {total}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div>
                            <div style={{ background: 'white', padding: '24px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    Order Summary
                                </h3>

                                {cartItems.map(item => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>
                                                {item.color} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '500' }}>
                                            RM {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}

                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e4df' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                        <span>Subtotal</span>
                                        <span>RM {subtotal}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                        <span>Shipping</span>
                                        <span style={{ color: shipping === 0 ? '#2e7d32' : 'inherit' }}>
                                            {shipping === 0 ? 'FREE' : `RM ${shipping}`}
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
                                        <span>RM {total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {step === 2 && shippingData.firstName && (
                                <div style={{ background: 'white', padding: '24px', marginTop: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        <h4 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Shipping To
                                        </h4>
                                        <button
                                            onClick={() => setStep(1)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#c4a77d',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                        {shippingData.firstName} {shippingData.lastName}<br />
                                        {shippingData.address}<br />
                                        {shippingData.city}, {shippingData.state} {shippingData.postcode}<br />
                                        {shippingData.phone}
                                    </div>
                                </div>
                            )}

                            {/* Security Badge */}
                            <div style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'white',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#666'
                            }}>
                                🔒 Secure checkout powered by SSL encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#666'
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e0e0e0',
    fontSize: '14px'
};

const buttonStyle = {
    flex: 1,
    padding: '16px 32px',
    background: '#c4a77d',
    color: 'white',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer'
};
