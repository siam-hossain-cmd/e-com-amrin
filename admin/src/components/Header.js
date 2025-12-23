'use client';

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

export default function Header({ title, subtitle }) {
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

                <div className="user-avatar">
                    AD
                </div>
            </div>
        </header>
    );
}
