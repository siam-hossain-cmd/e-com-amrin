'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Component for sidebar banners
export default function SidebarBanner() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const res = await fetch('/api/banners');
                if (res.ok) {
                    const data = await res.json();
                    // Only show Sidebar banners
                    const sidebarBanners = data.filter(b =>
                        b.position === 'sidebar' || b.position === 'Sidebar Banner'
                    );
                    setBanners(sidebarBanners);
                }
            } catch (error) {
                console.error('Failed to fetch sidebar banners:', error);
            }
        }
        fetchBanners();
    }, []);

    if (banners.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {banners.map((banner, i) => (
                <Link
                    key={banner._id || i}
                    href={banner.link || '/products'}
                    style={{
                        display: 'block',
                        background: banner.bgColor || '#2d3748',
                        color: 'white',
                        padding: '24px 20px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        transition: 'transform 0.2s'
                    }}
                >
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        letterSpacing: '0.5px'
                    }}>
                        {banner.title}
                    </div>
                    {banner.subtitle && (
                        <div style={{
                            fontSize: '13px',
                            opacity: 0.9
                        }}>
                            {banner.subtitle}
                        </div>
                    )}
                    <div style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                    }}>
                        SHOP NOW →
                    </div>
                </Link>
            ))}
        </div>
    );
}
