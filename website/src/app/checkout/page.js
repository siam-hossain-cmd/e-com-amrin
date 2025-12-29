'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, loading: cartLoading } = useCart();
    const { user, loading: authLoading } = useAuth();
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

    // Saved addresses feature
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewAddress, setShowNewAddress] = useState(false);

    // Voucher feature
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherError, setVoucherError] = useState('');

    // Use cart items from context
    const cartItems = cart.items || [];
    const subtotal = cart.total || 0;
    const shipping = subtotal >= 80 ? 0 : 5; // RM 5 shipping, free above RM 80
    const discount = appliedVoucher?.discountAmount || 0;
    const total = subtotal + shipping - discount;

    // Pre-fill email if user is logged in
    useEffect(() => {
        if (user?.email) {
            setShippingData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    // Fetch saved addresses for logged-in users
    useEffect(() => {
        async function fetchAddresses() {
            if (user?.uid) {
                try {
                    const res = await fetch(`/api/addresses?userId=${user.uid}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSavedAddresses(data.addresses || []);
                        // Auto-select default address if available
                        const defaultAddr = data.addresses?.find(a => a.isDefault);
                        if (defaultAddr) {
                            selectAddress(defaultAddr);
                        } else if (data.addresses?.length > 0) {
                            // Select first address if no default
                            selectAddress(data.addresses[0]);
                        } else {
                            setShowNewAddress(true);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch addresses:', error);
                    setShowNewAddress(true);
                }
            } else {
                setShowNewAddress(true);
            }
        }
        if (!authLoading) {
            fetchAddresses();
        }
    }, [user, authLoading]);

    // Select a saved address
    const selectAddress = (addr) => {
        setSelectedAddressId(addr._id);
        setShippingData(prev => ({
            ...prev,
            firstName: addr.firstName || prev.firstName,
            lastName: addr.lastName || prev.lastName,
            phone: addr.phone || prev.phone,
            address: addr.address || addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            postcode: addr.postcode || addr.postalCode || '',
            country: addr.country || 'Malaysia'
        }));
        setShowNewAddress(false);
    };

    // Redirect if cart is empty
    useEffect(() => {
        if (!cartLoading && cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartLoading, cartItems, router]);

    const handleShippingChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    // Apply voucher code
    const applyVoucher = async () => {
        if (!voucherCode.trim()) return;

        setVoucherLoading(true);
        setVoucherError('');

        try {
            const res = await fetch('/api/voucher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: voucherCode,
                    userId: user?.uid || null,
                    subtotal
                })
            });

            const data = await res.json();

            if (data.valid) {
                setAppliedVoucher(data.voucher);
                setVoucherError('');
            } else {
                setVoucherError(data.error || 'Invalid voucher');
                setAppliedVoucher(null);
            }
        } catch (error) {
            console.error('Voucher validation failed:', error);
            setVoucherError('Failed to validate voucher');
        } finally {
            setVoucherLoading(false);
        }
    };

    // Remove applied voucher
    const removeVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCode('');
        setVoucherError('');
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            // Process order
            setIsSubmitting(true);
            try {
                // Create order in database
                const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user?.uid || null,
                        email: shippingData.email,
                        firstName: shippingData.firstName,
                        lastName: shippingData.lastName,
                        phone: shippingData.phone,
                        address: shippingData.address,
                        city: shippingData.city,
                        state: shippingData.state,
                        postcode: shippingData.postcode,
                        country: shippingData.country,
                        items: cartItems.map(item => ({
                            productId: item.productId,
                            name: item.name,
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity,
                            price: item.price
                        })),
                        subtotal,
                        shipping,
                        discount,
                        total,
                        paymentMethod,
                        voucher: appliedVoucher ? {
                            code: appliedVoucher.code,
                            discountAmount: appliedVoucher.discountAmount
                        } : null
                    })
                });

                if (!orderResponse.ok) {
                    throw new Error('Failed to create order');
                }

                const orderResult = await orderResponse.json();

                // Send order confirmation email
                try {
                    await fetch('/api/email/order-confirmation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: shippingData.email,
                            name: shippingData.firstName,
                            orderId: orderResult.orderId,
                            orderItems: cartItems.map(item => ({
                                name: item.name,
                                variant: `${item.size}${item.color ? ', ' + item.color : ''}`,
                                quantity: item.quantity,
                                price: item.price
                            })),
                            total,
                            shippingAddress: {
                                name: `${shippingData.firstName} ${shippingData.lastName}`,
                                address: shippingData.address,
                                city: shippingData.city,
                                state: shippingData.state,
                                postcode: shippingData.postcode,
                                phone: shippingData.phone
                            }
                        })
                    });
                } catch (emailError) {
                    console.error('Failed to send confirmation email:', emailError);
                }

                // Save address if user requested
                if (showNewAddress && shippingData.saveAddress && user?.uid) {
                    try {
                        await fetch('/api/addresses', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: user.uid,
                                address: {
                                    firstName: shippingData.firstName,
                                    lastName: shippingData.lastName,
                                    phone: shippingData.phone,
                                    address: shippingData.address,
                                    city: shippingData.city,
                                    state: shippingData.state,
                                    postcode: shippingData.postcode,
                                    country: shippingData.country,
                                    isDefault: savedAddresses.length === 0 // Make default if first address
                                }
                            })
                        });
                    } catch (addressError) {
                        console.error('Failed to save address:', addressError);
                    }
                }

                // Mark voucher as used
                if (appliedVoucher) {
                    try {
                        await fetch('/api/voucher', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                code: appliedVoucher.code,
                                userId: user?.uid || null
                            })
                        });
                    } catch (voucherError) {
                        console.error('Failed to mark voucher used:', voucherError);
                    }
                }

                // Clear cart (if clearCart function exists in context)
                // cart.clearCart?.();

                // Redirect to confirmation with order ID
                router.push(`/order-confirmation?orderId=${orderResult.orderId}`);
            } catch (error) {
                console.error('Order creation failed:', error);
                alert('Failed to place order. Please try again.');
                setIsSubmitting(false);
            }
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

                                        {/* Saved Addresses Selection */}
                                        {user && savedAddresses.length > 0 && (
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>
                                                    Select Delivery Address
                                                </label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {savedAddresses.map((addr) => (
                                                        <label
                                                            key={addr._id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '12px',
                                                                padding: '16px',
                                                                border: selectedAddressId === addr._id ? '2px solid #c4a77d' : '1px solid #e0e0e0',
                                                                background: selectedAddressId === addr._id ? '#faf8f5' : 'white',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px'
                                                            }}
                                                            onClick={() => selectAddress(addr)}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="savedAddress"
                                                                checked={selectedAddressId === addr._id}
                                                                onChange={() => selectAddress(addr)}
                                                                style={{ width: '18px', height: '18px', marginTop: '2px' }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                                    {addr.label || `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Saved Address'}
                                                                    {addr.isDefault && (
                                                                        <span style={{
                                                                            marginLeft: '8px',
                                                                            padding: '2px 8px',
                                                                            background: '#c4a77d',
                                                                            color: 'white',
                                                                            fontSize: '10px',
                                                                            borderRadius: '4px',
                                                                            textTransform: 'uppercase'
                                                                        }}>Default</span>
                                                                    )}
                                                                </div>
                                                                <div style={{ fontSize: '13px', color: '#666' }}>
                                                                    {addr.address || addr.street}, {addr.city}, {addr.state} {addr.postcode}
                                                                </div>
                                                                {addr.phone && (
                                                                    <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                                                                        {addr.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}

                                                    {/* Add New Address Option */}
                                                    <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '16px',
                                                            border: showNewAddress ? '2px solid #c4a77d' : '1px solid #e0e0e0',
                                                            background: showNewAddress ? '#faf8f5' : 'white',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px'
                                                        }}
                                                        onClick={() => {
                                                            setShowNewAddress(true);
                                                            setSelectedAddressId(null);
                                                            setShippingData(prev => ({
                                                                ...prev,
                                                                firstName: '',
                                                                lastName: '',
                                                                phone: '',
                                                                address: '',
                                                                city: '',
                                                                state: '',
                                                                postcode: ''
                                                            }));
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="savedAddress"
                                                            checked={showNewAddress}
                                                            onChange={() => { }}
                                                            style={{ width: '18px', height: '18px' }}
                                                        />
                                                        <span style={{ fontWeight: '500' }}>+ Use a New Address</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

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

                                        {/* Save Address Option for New Addresses */}
                                        {user && showNewAddress && (
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={shippingData.saveAddress || false}
                                                        onChange={(e) => setShippingData(prev => ({
                                                            ...prev,
                                                            saveAddress: e.target.checked
                                                        }))}
                                                        style={{ width: '18px', height: '18px' }}
                                                    />
                                                    Save this address for future orders
                                                </label>
                                            </div>
                                        )}

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

                                {cartItems.map((item, index) => (
                                    <div key={item.productId + item.size + index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>
                                                {item.size}{item.color ? `, ${item.color}` : ''} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '500' }}>
                                            RM {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                                {/* Voucher Code Input */}
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e4df' }}>
                                    <h4 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                        Have a Voucher?
                                    </h4>
                                    {appliedVoucher ? (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            background: '#f0fdf4',
                                            borderRadius: '8px',
                                            border: '1px solid #bbf7d0'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#166534' }}>
                                                    {appliedVoucher.code}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#166534' }}>
                                                    -RM {appliedVoucher.discountAmount.toFixed(2)} applied
                                                </div>
                                            </div>
                                            <button
                                                onClick={removeVoucher}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter voucher code"
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px 12px',
                                                    border: voucherError ? '1px solid #dc2626' : '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                            <button
                                                onClick={applyVoucher}
                                                disabled={voucherLoading || !voucherCode.trim()}
                                                style={{
                                                    padding: '10px 16px',
                                                    background: '#1a1a1a',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: voucherLoading || !voucherCode.trim() ? 'not-allowed' : 'pointer',
                                                    opacity: voucherLoading || !voucherCode.trim() ? 0.5 : 1,
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {voucherLoading ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                    )}
                                    {voucherError && (
                                        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>
                                            {voucherError}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e4df' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                        <span>Subtotal</span>
                                        <span>RM {subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#166534' }}>
                                            <span>Discount ({appliedVoucher?.code})</span>
                                            <span>-RM {discount.toFixed(2)}</span>
                                        </div>
                                    )}
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
                                        <span>RM {total.toFixed(2)}</span>
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
