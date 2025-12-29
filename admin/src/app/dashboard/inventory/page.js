'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

// Icons
const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

export default function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, low, out
    const [editingSku, setEditingSku] = useState(null);
    const [editStock, setEditStock] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch inventory from API
    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/inventory');
            if (res.ok) {
                const data = await res.json();
                setInventory(data);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item => {
        if (filter === 'low') return item.stock > 0 && item.stock < item.minStock;
        if (filter === 'out') return item.stock === 0;
        return true;
    });

    const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock < i.minStock).length;
    const outOfStockCount = inventory.filter(i => i.stock === 0).length;
    const totalItems = inventory.reduce((sum, i) => sum + (i.stock || 0), 0);
    const totalValue = inventory.reduce((sum, i) => sum + ((i.stock || 0) * (i.price || 0)), 0);

    const startEdit = (sku, currentStock) => {
        setEditingSku(sku);
        setEditStock(currentStock.toString());
    };

    const saveStock = async (item) => {
        setSaving(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: item.productId,
                    variantId: item._id !== item.productId ? item._id : null,
                    sku: item.sku,
                    stock: parseInt(editStock) || 0
                })
            });

            if (res.ok) {
                // Update local state
                setInventory(prev => prev.map(inv =>
                    inv.sku === item.sku ? { ...inv, stock: parseInt(editStock) || 0 } : inv
                ));
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        } finally {
            setSaving(false);
            setEditingSku(null);
            setEditStock('');
        }
    };

    const cancelEdit = () => {
        setEditingSku(null);
        setEditStock('');
    };

    if (loading) {
        return (
            <>
                <Header title="Inventory" subtitle="Track and manage stock levels" />
                <div className="page-content">
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#c4a77d', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading inventory...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Inventory"
                subtitle="Track and manage stock levels"
            />

            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-value">{inventory.length}</div>
                        <div className="stat-card-label">Total SKUs</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value">{totalItems.toLocaleString()}</div>
                        <div className="stat-card-label">Total Items in Stock</div>
                    </div>
                    <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}>
                        <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{lowStockCount}</div>
                        <div className="stat-card-label">Low Stock Alerts</div>
                    </div>
                    <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(filter === 'out' ? 'all' : 'out')}>
                        <div className="stat-card-value" style={{ color: 'var(--danger)' }}>{outOfStockCount}</div>
                        <div className="stat-card-label">Out of Stock</div>
                    </div>
                </div>

                {/* Inventory Value */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Inventory Value</div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--accent)' }}>RM {totalValue.toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {filter !== 'all' && (
                                <button className="btn btn-secondary" onClick={() => setFilter('all')}>
                                    Show All
                                </button>
                            )}
                            <button className="btn btn-secondary" onClick={fetchInventory}>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            {filter === 'low' ? 'Low Stock Items' : filter === 'out' ? 'Out of Stock Items' : 'All Inventory'}
                        </h3>
                    </div>
                    <div className="table-container">
                        {inventory.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                <p>No inventory items found.</p>
                                <p style={{ fontSize: '14px' }}>Add products with variants to see them here.</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Product</th>
                                        <th>Size</th>
                                        <th>Color</th>
                                        <th>Stock</th>
                                        <th>Min Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item) => (
                                        <tr key={item.sku || item._id}>
                                            <td><code style={{ fontSize: '12px' }}>{item.sku}</code></td>
                                            <td><strong>{item.product}</strong></td>
                                            <td>{item.size}</td>
                                            <td>{item.color}</td>
                                            <td>
                                                {editingSku === item.sku ? (
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        style={{ width: '80px', padding: '6px 10px' }}
                                                        value={editStock}
                                                        onChange={(e) => setEditStock(e.target.value)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <strong>{item.stock}</strong>
                                                )}
                                            </td>
                                            <td>{item.minStock}</td>
                                            <td>
                                                {item.stock === 0 ? (
                                                    <span className="badge badge-danger">
                                                        <AlertIcon /> Out of Stock
                                                    </span>
                                                ) : item.stock < item.minStock ? (
                                                    <span className="badge badge-warning">
                                                        <AlertIcon /> Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-success">In Stock</span>
                                                )}
                                            </td>
                                            <td>
                                                {editingSku === item.sku ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => saveStock(item)}
                                                            disabled={saving}
                                                        >
                                                            {saving ? '...' : 'Save'}
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-secondary btn-icon"
                                                        onClick={() => startEdit(item.sku, item.stock)}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
