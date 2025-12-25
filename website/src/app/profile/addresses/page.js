'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

export default function AddressesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        isDefault: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchAddresses() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/addresses?userId=${user.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setAddresses(data.addresses || []);
                }
            } catch (error) {
                console.error('Failed to fetch addresses:', error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchAddresses();
        }
    }, [user, authLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, address: formData })
            });

            if (res.ok) {
                const data = await res.json();
                setAddresses([...addresses, { ...formData, _id: data.id }]);
                setShowForm(false);
                setFormData({ label: '', name: '', phone: '', address: '', city: '', state: '', postcode: '', isDefault: false });
            }
        } catch (error) {
            console.error('Failed to save address:', error);
        } finally {
            setSaving(false);
        }
    };

    const deleteAddress = async (index) => {
        try {
            await fetch('/api/addresses', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, index })
            });
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    if (authLoading || loading) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
                <Footer />
            </>
        );
    }

    if (!user) {
        router.push('/auth/login?redirect=/profile/addresses');
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '700px', margin: '0 auto' }}>
                <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ← Back to Profile
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700' }}>My Addresses</h1>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                            <PlusIcon /> Add Address
                        </button>
                    )}
                </div>

                {showForm && (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Add New Address</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Label</label>
                                    <input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Home, Office, etc." required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Recipient Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Phone Number</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Address</label>
                                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>City</label>
                                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>State</label>
                                    <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Postcode</label>
                                    <input type="text" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : 'Save Address'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {addresses.length === 0 && !showForm ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '60px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📍</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>No addresses saved</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add a delivery address for faster checkout</p>
                        <button onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                            <PlusIcon /> Add Address
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {addresses.map((addr, index) => (
                            <div key={index} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>{addr.label}</span>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{addr.name}</p>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{addr.phone}</p>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{addr.address}, {addr.city}, {addr.state} {addr.postcode}</p>
                                    </div>
                                    <button onClick={() => deleteAddress(index)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '8px' }}>
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
