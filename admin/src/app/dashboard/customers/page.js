'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

// Icons
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
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
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [expandedAddresses, setExpandedAddresses] = useState({});

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    const totalCustomers = customers.length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const newCustomers = customers.filter(c => c.status === 'new').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

    const toggleAddresses = (customerId) => {
        setExpandedAddresses(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }));
    };

    const formatAddress = (addr) => {
        if (!addr) return 'No address';
        const parts = [addr.street, addr.city, addr.state, addr.postcode, addr.country].filter(Boolean);
        return parts.join(', ') || 'No address';
    };

    if (loading) {
        return (
            <>
                <Header title="Customers" subtitle="Manage your customer base" />
                <div className="page-content"><LoadingSpinner /></div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Customers"
                subtitle="Manage your customer base"
            />

            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-value">{totalCustomers}</div>
                        <div className="stat-card-label">Total Customers</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{vipCustomers}</div>
                        <div className="stat-card-label">VIP Customers</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value" style={{ color: 'var(--success)' }}>{newCustomers}</div>
                        <div className="stat-card-label">New Customers</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-value">RM {totalRevenue.toLocaleString()}</div>
                        <div className="stat-card-label">Total Revenue</div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">All Customers</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '240px' }}
                                placeholder="Search customers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="btn btn-secondary" onClick={fetchCustomers}>
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="table-container">
                        {customers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                <p>No customers found.</p>
                                <p style={{ fontSize: '14px' }}>Customers will appear here when they sign up on your website.</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Orders</th>
                                        <th>Total Spent</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: customer.status === 'vip'
                                                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                            : 'linear-gradient(135deg, var(--accent), #ec4899)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: '600',
                                                        fontSize: '14px'
                                                    }}>
                                                        {customer.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{customer.name || 'Unknown'}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{customer.phone || '-'}</td>
                                            <td style={{ maxWidth: '200px' }}>
                                                {customer.addresses?.length > 0 ? (
                                                    <div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <LocationIcon />
                                                            <span style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: '150px',
                                                                display: 'inline-block'
                                                            }}>
                                                                {formatAddress(customer.primaryAddress)}
                                                            </span>
                                                        </div>
                                                        {customer.addresses.length > 1 && (
                                                            <button
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: 'var(--accent)',
                                                                    fontSize: '12px',
                                                                    cursor: 'pointer',
                                                                    padding: '2px 0',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                                onClick={() => toggleAddresses(customer._id)}
                                                            >
                                                                +{customer.addresses.length - 1} more
                                                                <ChevronDownIcon />
                                                            </button>
                                                        )}
                                                        {expandedAddresses[customer._id] && (
                                                            <div style={{
                                                                marginTop: '8px',
                                                                padding: '8px',
                                                                background: 'var(--bg-main)',
                                                                borderRadius: '6px',
                                                                fontSize: '12px'
                                                            }}>
                                                                {customer.addresses.map((addr, idx) => (
                                                                    <div key={idx} style={{
                                                                        padding: '4px 0',
                                                                        borderBottom: idx < customer.addresses.length - 1 ? '1px solid var(--border)' : 'none'
                                                                    }}>
                                                                        {addr.label && <strong>{addr.label}: </strong>}
                                                                        {formatAddress(addr)}
                                                                        {addr.isDefault && (
                                                                            <span style={{
                                                                                marginLeft: '6px',
                                                                                padding: '1px 6px',
                                                                                background: 'var(--accent)',
                                                                                color: 'white',
                                                                                borderRadius: '4px',
                                                                                fontSize: '10px'
                                                                            }}>Default</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No address</span>
                                                )}
                                            </td>
                                            <td>{customer.totalOrders}</td>
                                            <td><strong>RM {(customer.totalSpent || 0).toLocaleString()}</strong></td>
                                            <td>
                                                <span className={`badge ${customer.status === 'vip' ? 'badge-warning' :
                                                    customer.status === 'new' ? 'badge-info' : 'badge-success'
                                                    }`}>
                                                    {customer.status === 'vip' ? '⭐ VIP' : customer.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary btn-icon"
                                                    onClick={() => setSelectedCustomer(customer)}
                                                >
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Customer Detail Modal */}
                {selectedCustomer && (
                    <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <div className="modal-header">
                                <h3 className="modal-title">Customer Details</h3>
                                <button className="modal-close" onClick={() => setSelectedCustomer(null)}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Customer Info Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '24px',
                                    padding: '16px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: selectedCustomer.status === 'vip'
                                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                            : 'linear-gradient(135deg, var(--accent), #ec4899)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '20px'
                                    }}>
                                        {selectedCustomer.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                            {selectedCustomer.name}
                                            {selectedCustomer.status === 'vip' && ' ⭐'}
                                        </h3>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            Customer since {selectedCustomer.createdAt
                                                ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                                                : 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</div>
                                        <div style={{ fontWeight: '500' }}>{selectedCustomer.email}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone</div>
                                        <div style={{ fontWeight: '500' }}>{selectedCustomer.phone || 'Not provided'}</div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                                    <div style={{
                                        padding: '16px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>
                                            {selectedCustomer.totalOrders}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Orders</div>
                                    </div>
                                    <div style={{
                                        padding: '16px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--success)' }}>
                                            RM {(selectedCustomer.totalSpent || 0).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Spent</div>
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div>
                                    <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LocationIcon /> Saved Addresses ({selectedCustomer.addresses?.length || 0})
                                    </h4>
                                    {selectedCustomer.addresses?.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {selectedCustomer.addresses.map((addr, idx) => (
                                                <div key={idx} style={{
                                                    padding: '12px',
                                                    background: 'var(--bg-main)',
                                                    borderRadius: '8px',
                                                    border: addr.isDefault ? '2px solid var(--accent)' : '1px solid var(--border)'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '4px'
                                                    }}>
                                                        <strong>{addr.label || `Address ${idx + 1}`}</strong>
                                                        {addr.isDefault && (
                                                            <span style={{
                                                                padding: '2px 8px',
                                                                background: 'var(--accent)',
                                                                color: 'white',
                                                                borderRadius: '4px',
                                                                fontSize: '11px'
                                                            }}>Default</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                        {addr.name && <div>{addr.name}</div>}
                                                        {addr.phone && <div>{addr.phone}</div>}
                                                        <div>{formatAddress(addr)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: 'var(--text-secondary)',
                                            background: 'var(--bg-main)',
                                            borderRadius: '8px'
                                        }}>
                                            No saved addresses
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
