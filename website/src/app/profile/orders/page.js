'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/profile/orders');
            return;
        }

        // In a real app, fetch orders from API
        // For now, show empty state
        setLoading(false);
    }, [user, authLoading, router]);

    if (authLoading || loading) {
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

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ← Back to Profile
                </Link>

                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        padding: '60px 24px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>No orders yet</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            When you place orders, they will appear here.
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
                ) : (
                    <div>
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    padding: '20px',
                                    marginBottom: '16px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div>
                                        <p style={{ fontWeight: '600' }}>Order #{order.orderNumber}</p>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{order.date}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                        color: order.status === 'Delivered' ? '#059669' : '#d97706',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '15px' }}>{order.items} items • RM {order.total}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
