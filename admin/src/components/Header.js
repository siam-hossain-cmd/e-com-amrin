'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';

// SVG Icons
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const KeyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6,9 12,15 18,9" />
    </svg>
);

export default function Header({ title, subtitle }) {
    const { admin, logout } = useAdminAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getInitials = () => {
        if (admin?.displayName) {
            return admin.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (admin?.email) {
            return admin.email[0].toUpperCase();
        }
        return 'AD';
    };

    return (
        <header className="header">
            <div className="header-left">
                <div>
                    <h1 className="header-title">{title}</h1>
                    {subtitle && <p className="header-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <span className="header-search-icon">
                        <SearchIcon />
                    </span>
                    <input type="text" placeholder="Search products, orders..." />
                </div>

                <button className="header-icon-btn">
                    <BellIcon />
                    <span className="notification-badge">3</span>
                </button>

                {/* User Avatar with Dropdown */}
                <div className="user-dropdown-container" ref={dropdownRef}>
                    <button
                        className="user-avatar-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="user-avatar">
                            {getInitials()}
                        </div>
                        <ChevronDownIcon />
                    </button>

                    {dropdownOpen && (
                        <div className="user-dropdown">
                            <div className="user-dropdown-header">
                                <div className="user-dropdown-avatar">
                                    {getInitials()}
                                </div>
                                <div className="user-dropdown-info">
                                    <span className="user-dropdown-name">
                                        {admin?.displayName || 'Admin'}
                                    </span>
                                    <span className="user-dropdown-email">
                                        {admin?.email || 'admin@amrin.my'}
                                    </span>
                                </div>
                            </div>

                            <div className="user-dropdown-divider"></div>

                            <Link
                                href="/dashboard/account"
                                className="user-dropdown-item"
                                onClick={() => setDropdownOpen(false)}
                            >
                                <UserIcon />
                                <span>Account Settings</span>
                            </Link>

                            <Link
                                href="/dashboard/account#password"
                                className="user-dropdown-item"
                                onClick={() => setDropdownOpen(false)}
                            >
                                <KeyIcon />
                                <span>Change Password</span>
                            </Link>

                            <div className="user-dropdown-divider"></div>

                            <button
                                className="user-dropdown-item logout"
                                onClick={handleLogout}
                            >
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
