'use client';

import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';

// Icons
const RevenueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);

const OrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const ProductsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const CustomersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

// Sample data
const recentOrders = [
    { id: 'ORD-2024001', customer: 'Sarah Ahmed', items: 3, total: 4500, status: 'delivered', date: '2024-12-23' },
    { id: 'ORD-2024002', customer: 'Rahman Khan', items: 1, total: 1200, status: 'shipped', date: '2024-12-23' },
    { id: 'ORD-2024003', customer: 'Fatima Islam', items: 2, total: 3200, status: 'processing', date: '2024-12-23' },
    { id: 'ORD-2024004', customer: 'Karim Hossain', items: 4, total: 6800, status: 'pending', date: '2024-12-22' },
    { id: 'ORD-2024005', customer: 'Nadia Begum', items: 1, total: 890, status: 'confirmed', date: '2024-12-22' },
];

const topProducts = [
    { name: 'Classic White T-Shirt', sold: 124, stock: 45, revenue: 148800 },
    { name: 'Denim Jacket Premium', sold: 89, stock: 23, revenue: 445000 },
    { name: 'Summer Floral Dress', sold: 76, stock: 12, revenue: 228000 },
    { name: 'Cotton Polo Shirt', sold: 65, stock: 78, revenue: 97500 },
];

const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
};

export default function DashboardPage() {
    return (
        <>
            <Header
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening with your store."
            />

            <div className="page-content">
                {/* Stats Grid */}
                <div className="stats-grid">
                    <StatsCard
                        icon={<RevenueIcon />}
                        iconColor="pink"
                        value="RM 2,45,890"
                        label="Total Revenue"
                        trend="12.5%"
                        trendUp={true}
                    />
                    <StatsCard
                        icon={<OrdersIcon />}
                        iconColor="blue"
                        value="1,234"
                        label="Total Orders"
                        trend="8.2%"
                        trendUp={true}
                    />
                    <StatsCard
                        icon={<ProductsIcon />}
                        iconColor="green"
                        value="456"
                        label="Total Products"
                        trend="3.1%"
                        trendUp={true}
                    />
                    <StatsCard
                        icon={<CustomersIcon />}
                        iconColor="orange"
                        value="2,891"
                        label="Total Customers"
                        trend="15.3%"
                        trendUp={true}
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid-2">
                    {/* Recent Orders */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Orders</h3>
                            <button className="btn btn-secondary btn-sm">View All</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td><strong>{order.id}</strong></td>
                                            <td>{order.customer}</td>
                                            <td>RM {order.total.toLocaleString()}</td>
                                            <td>
                                                <span className={`badge badge-${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Top Selling Products</h3>
                            <button className="btn btn-secondary btn-sm">View All</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Sold</th>
                                        <th>Stock</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td><strong>{product.name}</strong></td>
                                            <td>{product.sold}</td>
                                            <td>
                                                <span className={`badge ${product.stock < 20 ? 'badge-warning' : 'badge-success'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>RM {product.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
