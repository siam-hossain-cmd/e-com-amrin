'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Inner component that uses useSearchParams
function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push(redirect);
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            router.push(redirect);
        } catch (err) {
            setError(err.message || 'Failed to login with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '40px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Sign in to access your account
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
                        Email
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

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontWeight: '500', fontSize: '14px' }}>Password</label>
                        <Link href="/auth/forgot-password" style={{ fontSize: '14px', color: 'var(--primary)' }}>
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '15px',
                            outline: 'none'
                        }}
                        placeholder="••••••••"
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
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '24px 0',
                gap: '12px'
            }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: 'white',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    Sign up
                </Link>
            </p>
        </div>
    );
}

// Loading fallback
function LoginFormFallback() {
    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '40px',
            textAlign: 'center'
        }}>
            <p>Loading...</p>
        </div>
    );
}

// Main page component with Suspense boundary
export default function LoginPage() {
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
                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>
            </div>
            <Footer />
        </>
    );
}
