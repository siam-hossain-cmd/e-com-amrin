'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';

// Icons
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

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

const positions = [
    { value: 'hero', label: 'Hero Banner (Homepage)' },
    { value: 'promo', label: 'Promo Strip' },
    { value: 'sidebar', label: 'Sidebar Banner' },
    { value: 'category', label: 'Category Page' }
];

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        position: 'hero',
        link: '',
        startDate: '',
        endDate: '',
        image: null,
        bgColor: '#1e293b'
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/banners');
            if (res.ok) {
                const data = await res.json();
                setBanners(data);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newBanner = await res.json();
                setBanners(prev => [newBanner, ...prev]);
                setShowModal(false);
                setFormData({
                    title: '',
                    subtitle: '',
                    position: 'hero',
                    link: '',
                    startDate: '',
                    endDate: '',
                    image: null,
                    bgColor: '#1e293b'
                });
            }
        } catch (error) {
            console.error('Failed to create banner:', error);
            alert('Failed to create banner. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const deleteBanner = async (banner) => {
        if (!confirm('Delete this banner?')) return;

        try {
            const res = await fetch('/api/banners', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: banner._id, image: banner.image })
            });

            if (res.ok) {
                setBanners(prev => prev.filter(b => b._id !== banner._id));
            }
        } catch (error) {
            console.error('Failed to delete banner:', error);
            alert('Failed to delete banner. Please try again.');
        }
    };

    const toggleBanner = async (banner) => {
        try {
            const res = await fetch('/api/banners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: banner._id, isActive: !banner.isActive })
            });

            if (res.ok) {
                setBanners(prev => prev.map(b =>
                    b._id === banner._id ? { ...b, isActive: !b.isActive } : b
                ));
            }
        } catch (error) {
            console.error('Failed to toggle banner:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Banners & Posters" subtitle="Manage homepage banners and promotional content" />
                <div className="page-content">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Banners & Posters"
                subtitle="Manage homepage banners and promotional content"
            />

            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
                    <div className="stat-card">
                        <div className="stat-card-value">{banners.length}</div>
                        <div className="stat-card-label">Total Banners</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value" style={{ color: 'var(--success)' }}>
                            {banners.filter(b => b.isActive).length}
                        </div>
                        <div className="stat-card-label">Active</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
                            {banners.filter(b => b.position === 'hero').length}
                        </div>
                        <div className="stat-card-label">Hero Banners</div>
                    </div>
                </div>

                {/* Add Button */}
                <div style={{ marginBottom: '24px' }}>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <PlusIcon /> Add Banner
                    </button>
                </div>

                {/* Banners Grid */}
                {banners.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px'
                    }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            No banners yet. Add your first banner to get started.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <PlusIcon /> Add Banner
                        </button>
                    </div>
                ) : (
                    <div className="grid-2">
                        {banners.map(banner => (
                            <div key={banner._id} className="card" style={{ overflow: 'hidden' }}>
                                {/* Preview */}
                                <div style={{
                                    height: '160px',
                                    background: banner.image?.url
                                        ? `url(${banner.image.url}) center/cover`
                                        : banner.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    padding: '20px',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    {!banner.image?.url && (
                                        <div>
                                            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                                                {banner.title}
                                            </div>
                                            {banner.subtitle && (
                                                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                                    {banner.subtitle}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {banner.image?.url && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '16px',
                                            left: '16px',
                                            background: 'rgba(0,0,0,0.7)',
                                            padding: '8px 16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontWeight: '600' }}>{banner.title}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{banner.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                {positions.find(p => p.value === banner.position)?.label}
                                            </div>
                                        </div>
                                        <span className={`badge badge-${banner.isActive ? 'success' : 'warning'}`}>
                                            {banner.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        {banner.startDate && banner.endDate ? (
                                            `${new Date(banner.startDate).toLocaleDateString()} - ${new Date(banner.endDate).toLocaleDateString()}`
                                        ) : (
                                            'No date range set'
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{ flex: 1 }}
                                            onClick={() => toggleBanner(banner)}
                                        >
                                            {banner.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-icon"
                                            onClick={() => deleteBanner(banner)}
                                            style={{ color: 'var(--danger)' }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">Add Banner</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Image Upload */}
                                    <ImageUpload
                                        value={formData.image}
                                        onChange={(img) => setFormData(prev => ({ ...prev, image: img }))}
                                        folder="banners"
                                        label="Banner Image (optional - will use color if not set)"
                                    />

                                    <div className="form-group">
                                        <label className="form-label">Banner Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-input"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Summer Sale - 50% Off"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Subtitle</label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            className="form-input"
                                            value={formData.subtitle}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Limited time offer"
                                        />
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Position *</label>
                                            <select
                                                name="position"
                                                className="form-select"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                            >
                                                {positions.map(pos => (
                                                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Background Color (if no image)</label>
                                            <input
                                                type="color"
                                                name="bgColor"
                                                className="form-input"
                                                value={formData.bgColor}
                                                onChange={handleInputChange}
                                                style={{ height: '42px', padding: '4px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Link URL</label>
                                        <input
                                            type="text"
                                            name="link"
                                            className="form-input"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="/products?category=sale"
                                        />
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Start Date *</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="form-input"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Date *</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                className="form-input"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Adding...' : 'Add Banner'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
