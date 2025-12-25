'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccountSettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Check if user signed in with Google (no password method)
    const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com' ||
        auth.currentUser?.providerData?.some(p => p.providerId === 'google.com');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setPasswordLoading(true);

        try {
            // Re-authenticate user first
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Update password
            await updatePassword(auth.currentUser, newPassword);

            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
            } else {
                setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password' });
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteError('');
        setDeleteLoading(true);

        try {
            // For email/password users, re-authenticate first
            if (!isGoogleUser && deletePassword) {
                const credential = EmailAuthProvider.credential(user.email, deletePassword);
                await reauthenticateWithCredential(auth.currentUser, credential);
            }

            // Delete data from MongoDB first
            await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            });

            // Delete Firebase account
            await deleteUser(auth.currentUser);

            // Redirect to home
            router.push('/');
        } catch (err) {
            console.error('Delete error:', err);
            if (err.code === 'auth/wrong-password') {
                setDeleteError('Password is incorrect');
            } else if (err.code === 'auth/requires-recent-login') {
                setDeleteError('Please logout and login again before deleting your account');
            } else {
                setDeleteError(err.message || 'Failed to delete account');
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    if (!user) {
        router.push('/auth/login?redirect=/profile/settings');
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto' }}>
                {/* Back Button */}
                <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ← Back to Profile
                </Link>

                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>Account Settings</h1>

                {/* Account Info */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Account Information</h2>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {user.displayName || 'Not set'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {user.email}</p>
                        <p><strong>Sign-in method:</strong> {isGoogleUser ? 'Google' : 'Email/Password'}</p>
                    </div>
                </div>

                {/* Change Password - Only for email/password users */}
                {!isGoogleUser && (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Change Password</h2>

                        {passwordMessage.text && (
                            <div style={{
                                padding: '12px 16px',
                                background: passwordMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: passwordMessage.type === 'error' ? '#dc2626' : '#059669',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '14px'
                            }}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Minimum 6 characters"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                                    opacity: passwordLoading ? 0.7 : 1
                                }}
                            >
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Delete Account */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #fecaca', padding: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>Delete Account</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Delete My Account
                        </button>
                    ) : (
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '8px' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '16px' }}>
                                ⚠️ Are you absolutely sure?
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                This will permanently delete:
                            </p>
                            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '20px' }}>
                                <li>Your account and login</li>
                                <li>Your shopping cart</li>
                                <li>Your wishlist</li>
                                <li>Your saved addresses</li>
                            </ul>

                            {deleteError && (
                                <div style={{
                                    padding: '10px 14px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#dc2626',
                                    borderRadius: '6px',
                                    marginBottom: '16px',
                                    fontSize: '13px'
                                }}>
                                    {deleteError}
                                </div>
                            )}

                            {!isGoogleUser && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>
                                        Enter your password to confirm
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        placeholder="Your password"
                                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px' }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading || (!isGoogleUser && !deletePassword)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                        opacity: deleteLoading ? 0.7 : 1
                                    }}
                                >
                                    {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                                </button>
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); setDeletePassword(''); }}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'white',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
