'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';

// Pre-designed hero templates
const heroTemplates = [
    {
        id: 'new-collection',
        name: 'New Collection',
        preview: '🆕',
        badge: 'NEW COLLECTION 2025',
        title: 'Grace in Every',
        titleHighlight: 'Wrap',
        subtitle: 'Discover our curated collection of premium hijabs and scarves. Elegant fabrics, timeless styles, designed for the modern Muslimah.',
        primaryButtonText: 'Shop Hijabs',
        primaryButtonLink: '/products',
        secondaryButtonText: 'VIEW LOOKBOOK',
        secondaryButtonLink: '/products?collection=lookbook'
    },
    {
        id: 'sale',
        name: 'Big Sale',
        preview: '🏷️',
        badge: 'LIMITED TIME OFFER',
        title: 'Up to 50%',
        titleHighlight: 'OFF',
        subtitle: 'Don\'t miss our biggest sale of the season. Premium hijabs and accessories at unbeatable prices. Shop now before they\'re gone!',
        primaryButtonText: 'Shop Sale',
        primaryButtonLink: '/products?sort=sale',
        secondaryButtonText: 'VIEW ALL DEALS',
        secondaryButtonLink: '/products?filter=sale'
    },
    {
        id: 'ramadan',
        name: 'Ramadan Collection',
        preview: '🌙',
        badge: 'RAMADAN SPECIAL',
        title: 'Blessed',
        titleHighlight: 'Elegance',
        subtitle: 'Celebrate the holy month with our exclusive Ramadan collection. Premium fabrics, modest designs, and spiritual elegance.',
        primaryButtonText: 'Shop Ramadan',
        primaryButtonLink: '/products?collection=ramadan',
        secondaryButtonText: 'VIEW COLLECTION',
        secondaryButtonLink: '/products?collection=ramadan'
    },
    {
        id: 'eid',
        name: 'Eid Special',
        preview: '✨',
        badge: 'EID MUBARAK',
        title: 'Celebrate in',
        titleHighlight: 'Style',
        subtitle: 'Make your Eid unforgettable with our stunning collection. Luxurious hijabs, elegant shawls, and festive accessories.',
        primaryButtonText: 'Shop Eid Collection',
        primaryButtonLink: '/products?collection=eid',
        secondaryButtonText: 'EXPLORE',
        secondaryButtonLink: '/products'
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        preview: '◽',
        badge: 'ESSENTIALS',
        title: 'Simple.',
        titleHighlight: 'Elegant.',
        subtitle: 'Less is more. Discover our minimalist collection featuring timeless pieces that complement any wardrobe.',
        primaryButtonText: 'Shop Now',
        primaryButtonLink: '/products',
        secondaryButtonText: '',
        secondaryButtonLink: ''
    },
    {
        id: 'premium',
        name: 'Premium Luxury',
        preview: '👑',
        badge: 'LUXURY COLLECTION',
        title: 'Indulge in',
        titleHighlight: 'Luxury',
        subtitle: 'Experience the finest fabrics and exquisite craftsmanship. Our premium collection redefines modest fashion.',
        primaryButtonText: 'Explore Luxury',
        primaryButtonLink: '/products?collection=premium',
        secondaryButtonText: 'VIEW CATALOG',
        secondaryButtonLink: '/products'
    }
];

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export default function HeroSettingsPage() {
    const [settings, setSettings] = useState({
        badge: '',
        title: '',
        titleHighlight: '',
        subtitle: '',
        primaryButtonText: '',
        primaryButtonLink: '',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        backgroundImage: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/settings/hero');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch hero settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const applyTemplate = (template) => {
        setSettings(prev => ({
            ...prev,
            badge: template.badge,
            title: template.title,
            titleHighlight: template.titleHighlight,
            subtitle: template.subtitle,
            primaryButtonText: template.primaryButtonText,
            primaryButtonLink: template.primaryButtonLink,
            secondaryButtonText: template.secondaryButtonText,
            secondaryButtonLink: template.secondaryButtonLink
        }));
        setShowTemplates(false);
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);

        try {
            const res = await fetch('/api/settings/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save hero settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Hero Section" subtitle="Manage homepage hero banner" />
                <div className="page-content">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Hero Section"
                subtitle="Manage homepage hero banner"
            />

            <div className="page-content">
                {/* Template Selector */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title">Quick Templates</h3>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowTemplates(!showTemplates)}
                        >
                            {showTemplates ? 'Hide Templates' : 'Choose Template'}
                        </button>
                    </div>

                    {showTemplates && (
                        <div className="card-body">
                            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Click a template to apply it. Your background image will remain unchanged.
                            </p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '12px'
                            }}>
                                {heroTemplates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template)}
                                        style={{
                                            padding: '16px',
                                            border: '2px solid var(--border)',
                                            borderRadius: '12px',
                                            background: 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{template.preview}</div>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{template.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {template.badge}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Settings Form */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Hero Content</h3>
                        </div>
                        <div className="card-body">
                            <ImageUpload
                                value={settings.backgroundImage}
                                onChange={(img) => { setSettings(prev => ({ ...prev, backgroundImage: img })); setSaved(false); }}
                                folder="hero"
                                label="Background Image"
                            />

                            <div className="form-group">
                                <label className="form-label">Badge Text</label>
                                <input
                                    type="text"
                                    name="badge"
                                    className="form-input"
                                    value={settings.badge}
                                    onChange={handleInputChange}
                                    placeholder="e.g., NEW COLLECTION 2024"
                                />
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-input"
                                        value={settings.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Grace in Every"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Title Highlight</label>
                                    <input
                                        type="text"
                                        name="titleHighlight"
                                        className="form-input"
                                        value={settings.titleHighlight}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Wrap"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subtitle</label>
                                <textarea
                                    name="subtitle"
                                    className="form-textarea"
                                    value={settings.subtitle}
                                    onChange={handleInputChange}
                                    placeholder="Hero description text..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Primary Button Text</label>
                                    <input
                                        type="text"
                                        name="primaryButtonText"
                                        className="form-input"
                                        value={settings.primaryButtonText}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Shop Hijabs"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Primary Button Link</label>
                                    <input
                                        type="text"
                                        name="primaryButtonLink"
                                        className="form-input"
                                        value={settings.primaryButtonLink}
                                        onChange={handleInputChange}
                                        placeholder="/products"
                                    />
                                </div>
                            </div>

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Secondary Button Text</label>
                                    <input
                                        type="text"
                                        name="secondaryButtonText"
                                        className="form-input"
                                        value={settings.secondaryButtonText}
                                        onChange={handleInputChange}
                                        placeholder="e.g., VIEW LOOKBOOK"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Secondary Button Link</label>
                                    <input
                                        type="text"
                                        name="secondaryButtonLink"
                                        className="form-input"
                                        value={settings.secondaryButtonLink}
                                        onChange={handleInputChange}
                                        placeholder="/products?collection=lookbook"
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {saved && (
                                    <span style={{ color: 'var(--success)', fontSize: '14px' }}>
                                        ✓ Saved successfully
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Live Preview</h3>
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                            <div style={{
                                minHeight: '400px',
                                background: settings.backgroundImage?.url
                                    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${settings.backgroundImage.url}) center/cover`
                                    : 'linear-gradient(135deg, #1e293b, #334155)',
                                padding: '40px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                color: 'white',
                                borderRadius: '0 0 12px 12px'
                            }}>
                                {settings.badge && (
                                    <span style={{
                                        display: 'inline-block',
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        letterSpacing: '1px',
                                        marginBottom: '16px',
                                        width: 'fit-content'
                                    }}>
                                        {settings.badge}
                                    </span>
                                )}

                                <h1 style={{
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    marginBottom: '16px',
                                    lineHeight: 1.2
                                }}>
                                    {settings.title}
                                    {settings.titleHighlight && (
                                        <span style={{
                                            display: 'block',
                                            background: 'linear-gradient(135deg, #c4a77d, #d4c4b5)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            {settings.titleHighlight}
                                        </span>
                                    )}
                                </h1>

                                {settings.subtitle && (
                                    <p style={{
                                        fontSize: '14px',
                                        opacity: 0.9,
                                        marginBottom: '24px',
                                        maxWidth: '400px',
                                        lineHeight: 1.6
                                    }}>
                                        {settings.subtitle}
                                    </p>
                                )}

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {settings.primaryButtonText && (
                                        <button style={{
                                            background: 'linear-gradient(135deg, #c4a77d, #a08460)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}>
                                            {settings.primaryButtonText} →
                                        </button>
                                    )}
                                    {settings.secondaryButtonText && (
                                        <button style={{
                                            background: 'transparent',
                                            color: 'white',
                                            border: '2px solid white',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}>
                                            {settings.secondaryButtonText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
