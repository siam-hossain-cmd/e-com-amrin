'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoBanner() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const res = await fetch('/api/banners');
                if (res.ok) {
                    const data = await res.json();
                    // Only show Promo Strip banners at the top
                    const promoBanners = data.filter(b =>
                        b.position === 'promo' || b.position === 'Promo Strip'
                    );
                    setBanners(promoBanners);
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            }
        }
        fetchBanners();
    }, []);

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    const banner = banners[currentIndex];

    return (
        <div style={{
            background: banner.bgColor || '#1a1a2e',
            color: 'white',
            padding: '14px 20px',
            textAlign: 'center',
            position: 'relative'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <span style={{
                    fontWeight: '700',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    {banner.title}
                </span>
                {banner.subtitle && (
                    <span style={{
                        marginLeft: '12px',
                        fontSize: '13px',
                        opacity: 0.9
                    }}>
                        {banner.subtitle}
                    </span>
                )}
                {banner.link && (
                    <Link
                        href={banner.link}
                        style={{
                            marginLeft: '16px',
                            padding: '6px 16px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        SHOP NOW →
                    </Link>
                )}
            </div>

            {/* Dots indicator */}
            {banners.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px'
                }}>
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                border: 'none',
                                background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
