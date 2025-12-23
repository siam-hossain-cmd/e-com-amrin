'use client';

import { useState } from 'react';
import Header from '@/components/Header';

// Icons
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

// Sample customers data
const customersData = [
    {
        id: 1,
        name: 'Sarah Ahmed',
        email: 'sarah@email.com',
        phone: '+60123456781',
        totalOrders: 8,
        totalSpent: 45000,
        lastOrder: '2024-12-23',
        status: 'active'
    },
    {
        id: 2,
        name: 'Rahman Khan',
        email: 'rahman@email.com',
        phone: '+60123456782',
        totalOrders: 3,
        totalSpent: 12500,
        lastOrder: '2024-12-23',
        status: 'active'
    },
    {
        id: 3,
        name: 'Fatima Islam',
        email: 'fatima@email.com',
        phone: '+60123456783',
        totalOrders: 5,
        totalSpent: 28000,
        lastOrder: '2024-12-23',
        status: 'active'
    },
    {
        id: 4,
        name: 'Karim Hossain',
        email: 'karim@email.com',
        phone: '+60123456784',
        totalOrders: 12,
        totalSpent: 78500,
        lastOrder: '2024-12-22',
        status: 'vip'
    },
    {
        id: 5,
        name: 'Nadia Begum',
        email: 'nadia@email.com',
        phone: '+60123456785',
        totalOrders: 1,
        totalSpent: 6000,
        lastOrder: '2024-12-22',
        status: 'new'
    },
];

export default function CustomersPage() {
    const [customers] = useState(customersData);
    const [search, setSearch] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const totalCustomers = customers.length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const newCustomers = customers.filter(c => c.status === 'new').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

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
                        <div className="stat-card-label">New This Month</div>
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
                        <input
                            type="text"
                            className="form-input"
                            style={{ width: '240px' }}
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Last Order</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--accent), #ec4899)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{customer.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.totalOrders}</td>
                                        <td><strong>RM {customer.totalSpent.toLocaleString()}</strong></td>
                                        <td>{new Date(customer.lastOrder).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${customer.status === 'vip' ? 'badge-warning' :
                                                customer.status === 'new' ? 'badge-info' : 'badge-success'
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-secondary btn-icon">
                                                <EyeIcon />
                                            </button>
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
