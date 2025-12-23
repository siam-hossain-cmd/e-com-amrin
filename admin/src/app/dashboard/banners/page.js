'use client';

import { useState } from 'react';
import Header from '@/components/Header';

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

// Sample banners data
const bannersData = [
    {
        id: 1,
        title: 'Winter Sale - Up to 50% Off',
        position: 'hero',
        link: '/products?sale=winter',
        startDate: '2024-12-20',
        endDate: '2024-12-31',
        isActive: true,
        bgColor: '#1e293b'
    },
    {
        id: 2,
        title: 'New Arrivals Collection',
        position: 'hero',
        link: '/products?new=true',
        startDate: '2024-12-15',
        endDate: '2025-01-15',
        isActive: true,
        bgColor: '#7c3aed'
    },
    {
        id: 3,
        title: 'Free Shipping Over ৳2000',
        position: 'promo',
        link: null,
        startDate: '2024-12-01',
        endDate: '2025-01-31',
        isActive: true,
        bgColor: '#059669'
    }
];

const positions = [
    { value: 'hero', label: 'Hero Banner (Homepage)' },
    { value: 'promo', label: 'Promo Strip' },
    { value: 'sidebar', label: 'Sidebar Banner' },
    { value: 'category', label: 'Category Page' }
];

export default function BannersPage() {
    const [banners, setBanners] = useState(bannersData);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        position: 'hero',
        link: '',
        startDate: '',
        endDate: '',
        bgColor: '#1e293b'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBanner = {
            id: Date.now(),
            ...formData,
            isActive: true
        };
        setBanners(prev => [...prev, newBanner]);
        setShowModal(false);
        setFormData({ title: '', position: 'hero', link: '', startDate: '', endDate: '', bgColor: '#1e293b' });
    };

    const deleteBanner = (id) => {
        if (confirm('Delete this banner?')) {
            setBanners(prev => prev.filter(b => b.id !== id));
        }
    };

    const toggleBanner = (id) => {
        setBanners(prev => prev.map(b =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
        ));
    };

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
                <div className="grid-2">
                    {banners.map(banner => (
                        <div key={banner.id} className="card" style={{ overflow: 'hidden' }}>
                            {/* Preview */}
                            <div style={{
                                height: '120px',
                                background: banner.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                {banner.title}
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
                                    {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1 }}
                                        onClick={() => toggleBanner(banner.id)}
                                    >
                                        {banner.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={() => deleteBanner(banner.id)}
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                            <label className="form-label">Background Color</label>
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
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Add Banner
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
