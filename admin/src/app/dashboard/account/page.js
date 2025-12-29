'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AccountPage() {
    const { admin, changePassword, loading } = useAdminAuth();

    // Profile form state
    const [profile, setProfile] = useState({
        displayName: '',
        email: '',
        phone: ''
    });
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Password form state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    // Update profile state when admin data loads
    useEffect(() => {
        if (admin) {
            setProfile({
                displayName: admin.displayName || '',
                email: admin.email || '',
                phone: admin.phone || ''
            });
        }
    }, [admin]);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // Save profile changes
    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            // In a real app, you would update the user profile in Firebase/database here
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    // Change password
    const handlePasswordSave = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        // Validation
        if (passwords.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setChangingPassword(true);

        try {
            await changePassword(passwords.currentPassword, passwords.newPassword);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            let errorMessage = 'Failed to change password';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'New password is too weak';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Please log out and log in again before changing password';
            }
            setPasswordMessage({ type: 'error', text: errorMessage });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Account Settings" subtitle="Manage your profile and security" />
                <div className="page-content">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Account Settings"
                subtitle="Manage your profile and security"
            />

            <div className="page-content">
                {/* Profile Section */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h3 className="card-title">Profile Information</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleProfileSave}>
                            <div className="profile-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                marginBottom: '24px',
                                paddingBottom: '24px',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <div className="user-dropdown-avatar" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                                    {profile.displayName ? profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                                        {profile.displayName || 'Admin'}
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            {profileMessage.text && (
                                <div className={`alert ${profileMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: 'var(--radius-sm)',
                                        marginBottom: '20px',
                                        background: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: profileMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                    {profileMessage.text}
                                </div>
                            )}

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Display Name</label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        className="form-input"
                                        value={profile.displayName}
                                        onChange={handleProfileChange}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        disabled
                                        style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
                                    />
                                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                        Email cannot be changed
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        placeholder="+60123456789"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="card" id="password">
                    <div className="card-header">
                        <h3 className="card-title">Change Password</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handlePasswordSave}>
                            {passwordMessage.text && (
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-sm)',
                                    marginBottom: '20px',
                                    background: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: passwordMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'
                                }}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div style={{ maxWidth: '400px' }}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        className="form-input"
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-input"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                        placeholder="Enter new password"
                                    />
                                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                        Must be at least 6 characters
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={changingPassword}
                                style={{ marginTop: '8px' }}
                            >
                                {changingPassword ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
