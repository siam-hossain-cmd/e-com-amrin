'use client';

import { useState } from 'react';
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

// Sample inventory data
const inventoryData = [
    { sku: 'CWT-S-WHT-001', product: 'Classic White T-Shirt', size: 'S', color: 'White', stock: 15, minStock: 10, price: 1200 },
    { sku: 'CWT-M-WHT-002', product: 'Classic White T-Shirt', size: 'M', color: 'White', stock: 25, minStock: 10, price: 1200 },
    { sku: 'CWT-L-WHT-003', product: 'Classic White T-Shirt', size: 'L', color: 'White', stock: 5, minStock: 10, price: 1200 },
    { sku: 'DJP-M-BLU-001', product: 'Denim Jacket Premium', size: 'M', color: 'Blue', stock: 8, minStock: 5, price: 5000 },
    { sku: 'DJP-L-BLU-002', product: 'Denim Jacket Premium', size: 'L', color: 'Blue', stock: 3, minStock: 5, price: 5000 },
    { sku: 'DJP-XL-BLU-003', product: 'Denim Jacket Premium', size: 'XL', color: 'Blue', stock: 0, minStock: 5, price: 5000 },
    { sku: 'SFD-S-FLR-001', product: 'Summer Floral Dress', size: 'S', color: 'Floral', stock: 12, minStock: 5, price: 3000 },
    { sku: 'SFD-M-FLR-002', product: 'Summer Floral Dress', size: 'M', color: 'Floral', stock: 0, minStock: 5, price: 3000 },
    { sku: 'CPS-M-NAV-001', product: 'Cotton Polo Shirt', size: 'M', color: 'Navy', stock: 20, minStock: 10, price: 1500 },
    { sku: 'CPS-L-NAV-002', product: 'Cotton Polo Shirt', size: 'L', color: 'Navy', stock: 18, minStock: 10, price: 1500 },
    { sku: 'CPS-M-WHT-003', product: 'Cotton Polo Shirt', size: 'M', color: 'White', stock: 22, minStock: 10, price: 1500 },
];

export default function InventoryPage() {
    const [inventory, setInventory] = useState(inventoryData);
    const [filter, setFilter] = useState('all'); // all, low, out
    const [editingSku, setEditingSku] = useState(null);
    const [editStock, setEditStock] = useState('');

    const filteredInventory = inventory.filter(item => {
        if (filter === 'low') return item.stock > 0 && item.stock < item.minStock;
        if (filter === 'out') return item.stock === 0;
        return true;
    });

    const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock < i.minStock).length;
    const outOfStockCount = inventory.filter(i => i.stock === 0).length;
    const totalItems = inventory.reduce((sum, i) => sum + i.stock, 0);
    const totalValue = inventory.reduce((sum, i) => sum + (i.stock * i.price), 0);

    const startEdit = (sku, currentStock) => {
        setEditingSku(sku);
        setEditStock(currentStock.toString());
    };

    const saveStock = (sku) => {
        setInventory(prev => prev.map(item =>
            item.sku === sku ? { ...item, stock: parseInt(editStock) || 0 } : item
        ));
        setEditingSku(null);
        setEditStock('');
    };

    const cancelEdit = () => {
        setEditingSku(null);
        setEditStock('');
    };

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
                        {filter !== 'all' && (
                            <button className="btn btn-secondary" onClick={() => setFilter('all')}>
                                Show All
                            </button>
                        )}
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
                                    <tr key={item.sku}>
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
                                                    <button className="btn btn-primary btn-sm" onClick={() => saveStock(item.sku)}>Save</button>
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
                    </div>
                </div>
            </div>
        </>
    );
}
