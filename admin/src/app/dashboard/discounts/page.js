'use client';

import { useState, useEffect } from 'react';
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

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div style={{
            width: '40px', height: '40px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
);

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '',
        maxUses: '',
        expiryDate: '',
        onePerUser: false
    });

    // Fetch discounts from API
    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/discounts');
            if (res.ok) {
                const data = await res.json();
                setDiscounts(data);
            }
        } catch (error) {
            console.error('Failed to fetch discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/discounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setDiscounts(prev => [{
                    _id: data._id,
                    code: formData.code.toUpperCase(),
                    type: formData.type,
                    value: parseInt(formData.value) || 0,
                    minOrder: parseInt(formData.minOrder) || 0,
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                    usedCount: 0,
                    onePerUser: formData.onePerUser,
                    expiryDate: formData.expiryDate,
                    status: 'active'
                }, ...prev]);
                setShowModal(false);
                setFormData({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiryDate: '', onePerUser: false });
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to create discount');
            }
        } catch (error) {
            console.error('Failed to create discount:', error);
            alert('Failed to create discount');
        } finally {
            setSaving(false);
        }
    };

    const deleteDiscount = async (id) => {
        if (!confirm('Delete this discount code?')) return;

        try {
            const res = await fetch('/api/discounts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id })
            });

            if (res.ok) {
                setDiscounts(prev => prev.filter(d => d._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete discount:', error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const res = await fetch('/api/discounts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id, status: newStatus })
            });

            if (res.ok) {
                setDiscounts(prev => prev.map(d =>
                    d._id === id ? { ...d, status: newStatus } : d
                ));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
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
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid-2">
                        {discounts.map(discount => (
                            <div key={discount._id} className="card">
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
                                            {discount.onePerUser && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <span style={{ padding: '2px 8px', background: '#fee2e2', color: '#dc2626', fontSize: '10px', borderRadius: '4px', fontWeight: '600' }}>
                                                        One per user
                                                    </span>
                                                </div>
                                            )}
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
                                            onClick={() => toggleStatus(discount._id, discount.status)}
                                        >
                                            {discount.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-icon"
                                            onClick={() => deleteDiscount(discount._id)}
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

                                    <div className="form-group">
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}>
                                            <input
                                                type="checkbox"
                                                name="onePerUser"
                                                checked={formData.onePerUser}
                                                onChange={handleInputChange}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span>One Per User (each user can only use this code once)</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Creating...' : 'Create Discount'}
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
