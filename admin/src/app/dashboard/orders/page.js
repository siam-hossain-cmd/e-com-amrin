'use client';

import { useState, useEffect } from 'react';
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
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    // Fetch orders from API
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                // Update local state
                setOrders(prev => prev.map(order =>
                    (order.orderId === orderId || order._id === orderId)
                        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                        : order
                ));
                if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder._id === orderId)) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }

                // Send shipping update email if status is shipped or delivered
                if (newStatus === 'shipped' || newStatus === 'delivered') {
                    const order = orders.find(o => o.orderId === orderId || o._id === orderId);
                    if (order?.customer?.email) {
                        try {
                            await fetch('/api/email/shipping-update', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: order.customer.email,
                                    name: order.customer.firstName || order.customer.name,
                                    orderId: order.orderId,
                                    status: newStatus,
                                    trackingNumber: order.trackingNumber
                                })
                            });
                        } catch (emailError) {
                            console.error('Failed to send shipping email:', emailError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to update order:', error);
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={8}><LoadingSpinner /></td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                            No orders found
                                        </td>
                                    </tr>
                                ) : filteredOrders.map((order) => (
                                    <tr key={order.orderId || order._id}>
                                        <td><strong>{order.orderId || order._id}</strong></td>
                                        <td>
                                            <div>{order.customer?.name || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.customer?.phone}</div>
                                        </td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td><strong>RM {(order.total || 0).toLocaleString()}</strong></td>
                                        <td>{order.paymentMethod}</td>
                                        <td>
                                            <span className={`badge badge-${statusColors[order.status] || 'info'}`}>
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
                                <h3 className="modal-title">Order {selectedOrder.orderId || selectedOrder._id}</h3>
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
                                                onClick={() => updateOrderStatus(selectedOrder.orderId || selectedOrder._id, getNextStatus(selectedOrder.status))}
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
                                            <p><strong>{selectedOrder.customer?.name || `${selectedOrder.customer?.firstName || ''} ${selectedOrder.customer?.lastName || ''}`}</strong></p>
                                            <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customer?.email}</p>
                                            <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.customer?.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Shipping Address</h4>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            {typeof selectedOrder.shippingAddress === 'object'
                                                ? `${selectedOrder.shippingAddress?.address}, ${selectedOrder.shippingAddress?.city} ${selectedOrder.shippingAddress?.postcode}`
                                                : selectedOrder.shippingAddress}
                                        </p>
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
                                            {selectedOrder.items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.size}{item.color ? ` / ${item.color}` : ''}</td>
                                                    <td>{item.quantity || item.qty || 1}</td>
                                                    <td style={{ textAlign: 'right' }}>RM {((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: 'right', fontWeight: '600' }}>Total</td>
                                                <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '16px', color: 'var(--accent)' }}>
                                                    RM {(selectedOrder.total || 0).toLocaleString()}
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
