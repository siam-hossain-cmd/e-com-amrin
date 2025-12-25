'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const MapPinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const MenuItem = ({ href, icon, title, description }) => (
    <Link href={href} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        transition: 'all 0.2s ease'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{description}</div>
        </div>
    </Link>
);

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login?redirect=/profile');
        }
    }, [user, loading, router]);

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

    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
                {/* Profile Header */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary), #9e8270)',
                    borderRadius: '16px',
                    padding: '40px',
                    color: 'white',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <UserIcon />
                        )}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                            {user.displayName || 'User'}
                        </h1>
                        <p style={{ opacity: 0.9 }}>{user.email}</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div style={{ display: 'grid', gap: '12px' }}>
                    <MenuItem
                        href="/profile/orders"
                        icon={<BoxIcon />}
                        title="My Orders"
                        description="Track, return, or buy again"
                    />
                    <MenuItem
                        href="/wishlist"
                        icon={<HeartIcon />}
                        title="Wishlist"
                        description="Your saved items"
                    />
                    <MenuItem
                        href="/profile/addresses"
                        icon={<MapPinIcon />}
                        title="Addresses"
                        description="Manage your delivery addresses"
                    />
                    <MenuItem
                        href="/profile/settings"
                        icon={<SettingsIcon />}
                        title="Account Settings"
                        description="Password, email, and preferences"
                    />
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '16px',
                        marginTop: '32px',
                        background: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#dc2626',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
            <Footer />
        </>
    );
}
