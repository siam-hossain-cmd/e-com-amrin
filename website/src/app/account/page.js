'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Icons
const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const OrderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const AddressIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

// Sample user data
const userData = {
    name: 'Siam Hossain',
    email: 'siamhossain00300@gmail.com',
    phone: '+60 12-345 6789',
    birthday: '15 March 1995',
    addresses: [
        {
            id: 1,
            name: 'Siam Hossain',
            type: 'Billing Address',
            address: 'Pearl Point Condominium, Jalan Sepadu 3, 1A-21-1, WP Kuala Lumpur, 58200',
            phone: '0112350120',
            isDefault: true
        },
        {
            id: 2,
            name: 'Siam Hossain',
            type: 'Shipping Address',
            address: 'Pearl Point Condominium, Jalan Sepadu 3, 1A-21-1, WP Kuala Lumpur, 58200',
            phone: '0112350120',
            isDefault: false
        }
    ],
    orders: [
        { id: 'ORD-2024001', date: '2024-12-20', status: 'Delivered', total: 189, items: 3 },
        { id: 'ORD-2024002', date: '2024-12-15', status: 'Shipped', total: 95, items: 2 },
        { id: 'ORD-2024003', date: '2024-12-10', status: 'Processing', total: 245, items: 4 }
    ]
};

const menuItems = [
    { id: 'account', label: 'Account Information', icon: UserIcon },
    { id: 'orders', label: 'Orders & Tracking', icon: OrderIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', label: 'Saved Addresses', icon: AddressIcon },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
];

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('account');

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div>
                        {/* Personal Details */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid #e8e4df'
                            }}>
                                <h2 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <UserIcon /> Personal Details
                                </h2>
                                <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#c4a77d',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}>
                                    Edit
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Email Address</div>
                                    <div style={{ fontSize: '14px' }}>{userData.email}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Name</div>
                                    <div style={{ fontSize: '14px' }}>{userData.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Phone</div>
                                    <div style={{ fontSize: '14px' }}>{userData.phone}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Birthday</div>
                                    <div style={{ fontSize: '14px' }}>{userData.birthday}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Password</div>
                                    <div style={{ fontSize: '14px' }}>••••••••</div>
                                </div>
                            </div>
                        </div>

                        {/* Saved Addresses */}
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid #e8e4df'
                            }}>
                                <h2 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <AddressIcon /> Saved Addresses ({userData.addresses.length})
                                </h2>
                                <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#c4a77d',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}>
                                    Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {userData.addresses.map(addr => (
                                    <div key={addr.id} style={{
                                        padding: '20px',
                                        border: '1px solid #e8e4df',
                                        position: 'relative'
                                    }}>
                                        <button style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#999'
                                        }}>
                                            <EditIcon />
                                        </button>
                                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{addr.name}</div>
                                        <div style={{
                                            display: 'inline-block',
                                            fontSize: '11px',
                                            color: '#c4a77d',
                                            marginBottom: '12px'
                                        }}>
                                            {addr.type}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                            {addr.address}<br />
                                            Phone: {addr.phone}
                                        </div>
                                        {!addr.isDefault && (
                                            <button style={{
                                                marginTop: '12px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#1a1a1a',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}>
                                                Set as Shipping Address
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div>
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e8e4df',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <OrderIcon /> Orders & Tracking
                        </h2>

                        {userData.orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {userData.orders.map(order => (
                                    <div key={order.id} style={{
                                        padding: '20px',
                                        border: '1px solid #e8e4df',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{order.id}</div>
                                            <div style={{ fontSize: '13px', color: '#666' }}>
                                                {order.items} items • {order.date}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                background: order.status === 'Delivered' ? '#e8f5e9' :
                                                    order.status === 'Shipped' ? '#e3f2fd' : '#fff3e0',
                                                color: order.status === 'Delivered' ? '#2e7d32' :
                                                    order.status === 'Shipped' ? '#1565c0' : '#ef6c00',
                                                marginBottom: '4px'
                                            }}>
                                                {order.status}
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: '600' }}>
                                                RM {order.total}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                <OrderIcon />
                                <p style={{ marginTop: '16px' }}>No orders yet</p>
                                <Link href="/products" style={{
                                    display: 'inline-block',
                                    marginTop: '16px',
                                    padding: '12px 24px',
                                    background: '#1a1a1a',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    letterSpacing: '1px'
                                }}>
                                    START SHOPPING
                                </Link>
                            </div>
                        )}
                    </div>
                );

            case 'wishlist':
                return (
                    <div>
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e8e4df',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <HeartIcon /> Wishlist
                        </h2>
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                            <HeartIcon />
                            <p style={{ marginTop: '16px' }}>Your wishlist is empty</p>
                            <Link href="/products" style={{
                                display: 'inline-block',
                                marginTop: '16px',
                                padding: '12px 24px',
                                background: '#1a1a1a',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500',
                                letterSpacing: '1px'
                            }}>
                                BROWSE PRODUCTS
                            </Link>
                        </div>
                    </div>
                );

            case 'addresses':
                return (
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e8e4df'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <AddressIcon /> Saved Addresses
                            </h2>
                            <button style={{
                                padding: '10px 20px',
                                background: '#1a1a1a',
                                color: 'white',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: '500',
                                letterSpacing: '1px',
                                cursor: 'pointer'
                            }}>
                                ADD NEW
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {userData.addresses.map(addr => (
                                <div key={addr.id} style={{
                                    padding: '20px',
                                    border: '1px solid #e8e4df',
                                    position: 'relative'
                                }}>
                                    <button style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#999'
                                    }}>
                                        <EditIcon />
                                    </button>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{addr.name}</div>
                                    <div style={{
                                        display: 'inline-block',
                                        fontSize: '11px',
                                        color: '#c4a77d',
                                        marginBottom: '12px'
                                    }}>
                                        {addr.type}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                        {addr.address}<br />
                                        Phone: {addr.phone}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'preferences':
                return (
                    <div>
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e8e4df',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <SettingsIcon /> Preferences
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 0',
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Email Notifications</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Receive updates about new arrivals and sales</div>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 0',
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>SMS Notifications</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Get order updates via SMS</div>
                                </div>
                                <input type="checkbox" style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 0',
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>Language</div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>Choose your preferred language</div>
                                </div>
                                <select style={{ padding: '8px 16px', border: '1px solid #e0e0e0' }}>
                                    <option>English</option>
                                    <option>Bahasa Malaysia</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Navbar />

            <div style={{
                background: 'var(--bg-cream)',
                minHeight: '80vh',
                padding: '40px 0'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '280px 1fr',
                        gap: '40px'
                    }}>
                        {/* Sidebar */}
                        <aside>
                            <div style={{
                                background: 'white',
                                padding: '24px'
                            }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    marginBottom: '20px',
                                    color: '#1a1a1a'
                                }}>
                                    MY ACCOUNT
                                </h3>

                                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {menuItems.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '14px 16px',
                                                background: activeTab === item.id ? '#1a1a1a' : 'transparent',
                                                color: activeTab === item.id ? 'white' : '#666',
                                                border: 'none',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <item.icon />
                                            {item.label}
                                        </button>
                                    ))}

                                    <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #e8e4df' }} />

                                    <button
                                        onClick={() => {
                                            alert('Logged out!');
                                            window.location.href = '/';
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '14px 16px',
                                            background: 'transparent',
                                            color: '#999',
                                            border: 'none',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <LogoutIcon />
                                        Logout
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main style={{ background: 'white', padding: '32px' }}>
                            {renderContent()}
                        </main>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
