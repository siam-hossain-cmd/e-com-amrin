'use client';

import { useState } from 'react';
import Header from '@/components/Header';

// Icons
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const PrintIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Sample orders data
const ordersData = [
    {
        id: 'ORD-2024001',
        customer: { name: 'Sarah Ahmed', email: 'sarah@email.com', phone: '+60123456781' },
        items: [
            { name: 'Classic White T-Shirt', size: 'M', color: 'White', qty: 2, price: 1200 },
            { name: 'Cotton Polo Shirt', size: 'L', color: 'Navy', qty: 1, price: 1500 },
        ],
        total: 3900,
        status: 'delivered',
        paymentMethod: 'COD',
        shippingAddress: '123 Jalan Bukit Bintang, KL 50200',
        trackingNumber: 'TRACK123456',
        createdAt: '2024-12-23T10:30:00',
        updatedAt: '2024-12-23T15:45:00'
    },
    {
        id: 'ORD-2024002',
        customer: { name: 'Rahman Khan', email: 'rahman@email.com', phone: '+60123456782' },
        items: [
            { name: 'Denim Jacket Premium', size: 'L', color: 'Blue', qty: 1, price: 5000 },
        ],
        total: 5000,
        status: 'shipped',
        paymentMethod: 'bKash',
        shippingAddress: '45 Jalan Ampang, KL 50450',
        trackingNumber: 'TRACK123457',
        createdAt: '2024-12-23T09:15:00',
        updatedAt: '2024-12-23T14:30:00'
    },
    {
        id: 'ORD-2024003',
        customer: { name: 'Fatima Islam', email: 'fatima@email.com', phone: '+60123456783' },
        items: [
            { name: 'Summer Floral Dress', size: 'S', color: 'Floral', qty: 1, price: 3000 },
            { name: 'Classic White T-Shirt', size: 'S', color: 'White', qty: 1, price: 1200 },
        ],
        total: 4200,
        status: 'processing',
        paymentMethod: 'Card',
        shippingAddress: '78 Bangsar South, KL 59200',
        trackingNumber: null,
        createdAt: '2024-12-23T08:00:00',
        updatedAt: '2024-12-23T08:00:00'
    },
    {
        id: 'ORD-2024004',
        customer: { name: 'Karim Hossain', email: 'karim@email.com', phone: '+60123456784' },
        items: [
            { name: 'Cotton Polo Shirt', size: 'XL', color: 'White', qty: 3, price: 1500 },
            { name: 'Denim Jacket Premium', size: 'XL', color: 'Blue', qty: 1, price: 5000 },
        ],
        total: 9500,
        status: 'pending',
        paymentMethod: 'COD',
        shippingAddress: '99 Mont Kiara, KL 50480',
        trackingNumber: null,
        createdAt: '2024-12-22T16:45:00',
        updatedAt: '2024-12-22T16:45:00'
    },
    {
        id: 'ORD-2024005',
        customer: { name: 'Nadia Begum', email: 'nadia@email.com', phone: '+60123456785' },
        items: [
            { name: 'Summer Floral Dress', size: 'M', color: 'Floral', qty: 2, price: 3000 },
        ],
        total: 6000,
        status: 'confirmed',
        paymentMethod: 'Nagad',
        shippingAddress: '55 Petaling Jaya, Selangor 47800',
        trackingNumber: null,
        createdAt: '2024-12-22T14:20:00',
        updatedAt: '2024-12-22T14:35:00'
    },
];

const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
};

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
    const [orders, setOrders] = useState(ordersData);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    const filteredOrders = filterStatus
        ? orders.filter(o => o.status === filterStatus)
        : orders;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                : order
        ));
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
    };

    const getNextStatus = (currentStatus) => {
        const currentIndex = statusFlow.indexOf(currentStatus);
        if (currentIndex < statusFlow.length - 1) {
            return statusFlow[currentIndex + 1];
        }
        return null;
    };

    return (
        <>
            <Header
                title="Orders"
                subtitle="Manage customer orders and fulfillment"
            />

            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: '24px' }}>
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => {
                        const count = orders.filter(o => o.status === status).length;
                        return (
                            <div
                                key={status}
                                className="stat-card"
                                style={{ cursor: 'pointer', padding: '16px' }}
                                onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`badge badge-${statusColors[status]}`}>{status}</span>
                                    <span style={{ fontSize: '24px', fontWeight: '700' }}>{count}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Orders Table */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Orders` : 'All Orders'}
                        </h3>
                        {filterStatus && (
                            <button className="btn btn-secondary btn-sm" onClick={() => setFilterStatus('')}>
                                Clear Filter
                            </button>
                        )}
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>
                                            <div>{order.customer.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.customer.phone}</div>
                                        </td>
                                        <td>{order.items.length} items</td>
                                        <td><strong>RM {order.total.toLocaleString()}</strong></td>
                                        <td>{order.paymentMethod}</td>
                                        <td>
                                            <span className={`badge badge-${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-secondary btn-icon"
                                                    onClick={() => setSelectedOrder(order)}
                                                    title="View Details"
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-icon"
                                                    title="Print Invoice"
                                                >
                                                    <PrintIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Detail Modal */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                            <div className="modal-header">
                                <h3 className="modal-title">Order {selectedOrder.id}</h3>
                                <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Order Status */}
                                <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Status</div>
                                            <span className={`badge badge-${statusColors[selectedOrder.status]}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        {getNextStatus(selectedOrder.status) && (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status))}
                                            >
                                                Mark as {getNextStatus(selectedOrder.status)}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="grid-2" style={{ marginBottom: '24px' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Customer</h4>
                                        <div style={{ fontSize: '14px' }}>
                                            <p><strong>{selectedOrder.customer.name}</strong></p>
                                            <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customer.email}</p>
                                            <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customer.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Shipping Address</h4>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{selectedOrder.shippingAddress}</p>
                                        {selectedOrder.trackingNumber && (
                                            <p style={{ marginTop: '8px', fontSize: '12px' }}>
                                                <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Order Items</h4>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Size/Color</th>
                                                <th>Qty</th>
                                                <th style={{ textAlign: 'right' }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.size} / {item.color}</td>
                                                    <td>{item.qty}</td>
                                                    <td style={{ textAlign: 'right' }}>৳ {(item.price * item.qty).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: 'right', fontWeight: '600' }}>Total</td>
                                                <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '16px', color: 'var(--accent)' }}>
                                                    ৳ {selectedOrder.total.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </button>
                                <button className="btn btn-primary">
                                    <PrintIcon /> Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
