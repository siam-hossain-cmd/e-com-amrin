'use client';

import Link from 'next/link';
import { useState } from 'react';

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

const fabrics = ['Chiffon', 'Jersey', 'Satin', 'Modal', 'Cotton', 'Silk', 'Crepe', 'Voile'];

export default function Navbar({ cartCount = 0 }) {
    const [hijabDropdown, setHijabDropdown] = useState(false);

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

                        <Link href="/account" className="nav-icon-btn">
                            <UserIcon />
                        </Link>

                        <Link href="/cart" className="nav-icon-btn">
                            <CartIcon />
                            {cartCount > 0 && (
                                <span className="nav-cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
