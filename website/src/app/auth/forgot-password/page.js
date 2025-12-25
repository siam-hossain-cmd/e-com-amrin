'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: 'calc(100vh - 200px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    padding: '40px'
                }}>
                    {!sent ? (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Forgot Password?</h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                                    Enter your email and we'll send you a reset link
                                </p>
                            </div>

                            {error && (
                                <div style={{
                                    padding: '12px 16px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#dc2626',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            outline: 'none'
                                        }}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Remember your password?{' '}
                                <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📧</div>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Check Your Email</h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                                We've sent a password reset link to<br />
                                <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                            </p>

                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                fontSize: '14px',
                                color: 'var(--text-secondary)'
                            }}>
                                <strong>Didn't receive the email?</strong><br />
                                Check your spam folder or{' '}
                                <button
                                    onClick={() => setSent(false)}
                                    style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    try again
                                </button>
                            </div>

                            <Link
                                href="/auth/login"
                                style={{
                                    display: 'inline-block',
                                    padding: '14px 32px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                }}
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
