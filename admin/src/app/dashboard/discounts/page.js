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

// Sample discounts data
const discountsData = [
    {
        id: 1,
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        minOrder: 1000,
        maxUses: 100,
        usedCount: 45,
        expiryDate: '2024-12-31',
        status: 'active'
    },
    {
        id: 2,
        code: 'FLAT500',
        type: 'fixed',
        value: 500,
        minOrder: 3000,
        maxUses: 50,
        usedCount: 12,
        expiryDate: '2024-12-25',
        status: 'active'
    },
    {
        id: 3,
        code: 'BOGO',
        type: 'bogo',
        value: 0,
        minOrder: 0,
        maxUses: null,
        usedCount: 23,
        expiryDate: '2024-12-24',
        status: 'active'
    },
    {
        id: 4,
        code: 'NEWYEAR25',
        type: 'percentage',
        value: 25,
        minOrder: 2000,
        maxUses: 200,
        usedCount: 0,
        expiryDate: '2025-01-15',
        status: 'scheduled'
    }
];

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState(discountsData);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '',
        maxUses: '',
        expiryDate: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDiscount = {
            id: Date.now(),
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: parseInt(formData.value) || 0,
            minOrder: parseInt(formData.minOrder) || 0,
            maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
            usedCount: 0,
            expiryDate: formData.expiryDate,
            status: 'active'
        };
        setDiscounts(prev => [...prev, newDiscount]);
        setShowModal(false);
        setFormData({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiryDate: '' });
    };

    const deleteDiscount = (id) => {
        if (confirm('Delete this discount code?')) {
            setDiscounts(prev => prev.filter(d => d.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setDiscounts(prev => prev.map(d =>
            d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
        ));
    };

    return (
        <>
            <Header
                title="Discounts"
                subtitle="Manage promotional codes and offers"
            />

            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="stat-card">
                        <div className="stat-card-value">{discounts.length}</div>
                        <div className="stat-card-label">Total Discounts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value" style={{ color: 'var(--success)' }}>
                            {discounts.filter(d => d.status === 'active').length}
                        </div>
                        <div className="stat-card-label">Active</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value">
                            {discounts.reduce((sum, d) => sum + d.usedCount, 0)}
                        </div>
                        <div className="stat-card-label">Total Uses</div>
                    </div>
                </div>

                {/* Add Button */}
                <div style={{ marginBottom: '24px' }}>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <PlusIcon /> Create Discount
                    </button>
                </div>

                {/* Discounts Cards */}
                <div className="grid-2">
                    {discounts.map(discount => (
                        <div key={discount.id} className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            color: 'var(--accent)',
                                            letterSpacing: '1px'
                                        }}>
                                            {discount.code}
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            {discount.type === 'percentage' && `${discount.value}% off`}
                                            {discount.type === 'fixed' && `RM${discount.value} off`}
                                            {discount.type === 'bogo' && 'Buy 1 Get 1 Free'}
                                        </div>
                                    </div>
                                    <span className={`badge badge-${discount.status === 'active' ? 'success' : discount.status === 'scheduled' ? 'info' : 'warning'}`}>
                                        {discount.status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Min Order</div>
                                        <div style={{ fontWeight: '600' }}>RM {discount.minOrder.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Uses</div>
                                        <div style={{ fontWeight: '600' }}>
                                            {discount.usedCount}{discount.maxUses ? ` / ${discount.maxUses}` : ''}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires</div>
                                        <div style={{ fontWeight: '600' }}>{new Date(discount.expiryDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        style={{ flex: 1 }}
                                        onClick={() => toggleStatus(discount.id)}
                                    >
                                        {discount.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={() => deleteDiscount(discount.id)}
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
                                <h3 className="modal-title">Create Discount</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Discount Code *</label>
                                        <input
                                            type="text"
                                            name="code"
                                            className="form-input"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            placeholder="e.g., SUMMER25"
                                            style={{ textTransform: 'uppercase' }}
                                            required
                                        />
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Discount Type *</label>
                                            <select
                                                name="type"
                                                className="form-select"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (৳)</option>
                                                <option value="bogo">Buy 1 Get 1</option>
                                            </select>
                                        </div>
                                        {formData.type !== 'bogo' && (
                                            <div className="form-group">
                                                <label className="form-label">Value *</label>
                                                <input
                                                    type="number"
                                                    name="value"
                                                    className="form-input"
                                                    value={formData.value}
                                                    onChange={handleInputChange}
                                                    placeholder={formData.type === 'percentage' ? '20' : '500'}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Min Order (৳)</label>
                                            <input
                                                type="number"
                                                name="minOrder"
                                                className="form-input"
                                                value={formData.minOrder}
                                                onChange={handleInputChange}
                                                placeholder="1000"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Max Uses</label>
                                            <input
                                                type="number"
                                                name="maxUses"
                                                className="form-input"
                                                value={formData.maxUses}
                                                onChange={handleInputChange}
                                                placeholder="Unlimited"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Expiry Date *</label>
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            className="form-input"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Discount
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
