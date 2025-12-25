'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

// Icons
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const HeartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const UserIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const fabrics = ['Chiffon', 'Jersey', 'Satin', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile'];

export default function Navbar() {
    const [hijabDropdown, setHijabDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const { user, logout, loading: authLoading } = useAuth();
    const { itemCount } = useCart();
    const userDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setUserDropdown(false);
    };

    return (
        <>
            {/* Promo Bar */}
            <div className="promo-bar">
                FREE SHIPPING ON ORDERS OVER RM80 | NEW ARRIVALS WEEKLY
            </div>

            {/* Navigation */}
            <nav className="nav">
                <div className="nav-container">
                    <Link href="/" className="nav-logo">
                        AMRIN
                    </Link>

                    <div className="nav-links">
                        {/* Hijabs with Dropdown */}
                        <div
                            className="nav-dropdown"
                            onMouseEnter={() => setHijabDropdown(true)}
                            onMouseLeave={() => setHijabDropdown(false)}
                        >
                            <Link href="/products?category=hijabs" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                HIJABS <ChevronIcon />
                            </Link>
                            {hijabDropdown && (
                                <div className="nav-dropdown-menu">
                                    <span style={{ padding: '8px 24px', fontSize: '10px', letterSpacing: '2px', color: '#999', textTransform: 'uppercase' }}>Shop by Fabric</span>
                                    {fabrics.map(fabric => (
                                        <Link
                                            key={fabric}
                                            href={`/products?fabric=${fabric.toLowerCase()}`}
                                            className="nav-dropdown-item"
                                        >
                                            {fabric}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/products?category=scarves" className="nav-link">SCARVES</Link>
                        <Link href="/products?category=instant" className="nav-link">INSTANT HIJABS</Link>
                        <Link href="/products?category=underscarves" className="nav-link">UNDERSCARVES</Link>
                        <Link href="/products?category=shawls" className="nav-link">SHAWLS</Link>
                        <Link href="/products?category=accessories" className="nav-link">ACCESSORIES</Link>
                        <Link href="/products?sale=true" className="nav-link sale" style={{ color: '#b74b4b' }}>SALE</Link>
                    </div>

                    <div className="nav-actions">
                        <button className="nav-icon-btn">
                            <SearchIcon />
                        </button>

                        <Link href="/wishlist" className="nav-icon-btn">
                            <HeartIcon />
                        </Link>

                        {/* User Dropdown */}
                        <div ref={userDropdownRef} style={{ position: 'relative' }}>
                            <button
                                className="nav-icon-btn"
                                onClick={() => setUserDropdown(!userDropdown)}
                            >
                                <UserIcon />
                            </button>

                            {userDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}>
                                    {user ? (
                                        <>
                                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                    {user.displayName || 'User'}
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {user.email}
                                                </div>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setUserDropdown(false)}
                                                style={{ display: 'block', padding: '12px 20px', fontSize: '14px', color: 'var(--text-primary)' }}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/profile/orders"
                                                onClick={() => setUserDropdown(false)}
                                                style={{ display: 'block', padding: '12px 20px', fontSize: '14px', color: 'var(--text-primary)' }}
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 20px',
                                                    background: 'none',
                                                    border: 'none',
                                                    borderTop: '1px solid var(--border)',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: '#dc2626',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <LogoutIcon /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Welcome</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    Sign in for the best experience
                                                </div>
                                            </div>
                                            <div style={{ padding: '12px 20px', display: 'flex', gap: '8px' }}>
                                                <Link
                                                    href="/auth/login"
                                                    onClick={() => setUserDropdown(false)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        fontSize: '13px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Sign In
                                                </Link>
                                                <Link
                                                    href="/auth/register"
                                                    onClick={() => setUserDropdown(false)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        fontSize: '13px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    Register
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/cart" className="nav-icon-btn" style={{ position: 'relative' }}>
                            <CartIcon />
                            {itemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
