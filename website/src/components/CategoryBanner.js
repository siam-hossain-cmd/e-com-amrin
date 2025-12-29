'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Component for category page banners - horizontal full-width
export default function CategoryBanner() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const res = await fetch('/api/banners');
                if (res.ok) {
                    const data = await res.json();
                    // Only show Category Page banners
                    const categoryBanners = data.filter(b =>
                        b.position === 'category' || b.position === 'Category Page'
                    );
                    setBanners(categoryBanners);
                }
            } catch (error) {
                console.error('Failed to fetch category banners:', error);
            }
        }
        fetchBanners();
    }, []);

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    const banner = banners[currentIndex];

    return (
        <Link
            href={banner.link || '/products'}
            style={{
                display: 'block',
                background: banner.bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '32px 40px',
                borderRadius: '16px',
                textDecoration: 'none',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                }}>
                    {banner.title}
                </div>
                {banner.subtitle && (
                    <div style={{
                        fontSize: '16px',
                        opacity: 0.9,
                        maxWidth: '500px'
                    }}>
                        {banner.subtitle}
                    </div>
                )}
                <div style={{
                    marginTop: '16px',
                    padding: '10px 24px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-block'
                }}>
                    SHOP NOW →
                </div>
            </div>

            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                right: '100px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
            }} />

            {/* Dots indicator */}
            {banners.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 2
                }}>
                    {banners.map((_, i) => (
                        <span
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)'
                            }}
                        />
                    ))}
                </div>
            )}
        </Link>
    );
}
