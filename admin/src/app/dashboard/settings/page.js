'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        storeName: 'Amrin',
        storeEmail: 'contact@amrin.my',
        storePhone: '+60123456789',
        currency: 'MYR',
        taxRate: '6',
        freeShippingThreshold: '80',
        lowStockAlert: '10'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    return (
        <>
            <Header
                title="Settings"
                subtitle="Configure your store settings"
            />

            <div className="page-content">
                <form onSubmit={handleSave}>
                    {/* Store Information */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Store Information</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        className="form-input"
                                        value={settings.storeName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Email</label>
                                    <input
                                        type="email"
                                        name="storeEmail"
                                        className="form-input"
                                        value={settings.storeEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Phone</label>
                                    <input
                                        type="tel"
                                        name="storePhone"
                                        className="form-input"
                                        value={settings.storePhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Currency</label>
                                    <select
                                        name="currency"
                                        className="form-select"
                                        value={settings.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="MYR">MYR (RM)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="SGD">SGD (S$)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Tax */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Pricing & Tax</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        className="form-input"
                                        value={settings.taxRate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Free Shipping Threshold (RM)</label>
                                    <input
                                        type="number"
                                        name="freeShippingThreshold"
                                        className="form-input"
                                        value={settings.freeShippingThreshold}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Inventory Settings</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label className="form-label">Low Stock Alert Threshold</label>
                                <input
                                    type="number"
                                    name="lowStockAlert"
                                    className="form-input"
                                    value={settings.lowStockAlert}
                                    onChange={handleChange}
                                />
                                <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                    Items below this quantity will show a low stock warning
                                </small>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save Settings
                    </button>
                </form>
            </div>
        </>
    );
}
