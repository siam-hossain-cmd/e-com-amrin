'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate login/register
        if (isLogin) {
            alert('Login successful! Redirecting to account...');
            window.location.href = '/account';
        } else {
            alert('Account created! Please login.');
            setIsLogin(true);
        }
    };

    return (
        <>
            <Navbar />

            <div style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-cream)',
                padding: '60px 20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'white',
                    padding: '48px 40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    {/* Toggle */}
                    <div style={{
                        display: 'flex',
                        marginBottom: '32px',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                background: 'none',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                borderBottom: isLogin ? '2px solid #c4a77d' : '2px solid transparent',
                                color: isLogin ? '#1a1a1a' : '#999'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                background: 'none',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                borderBottom: !isLogin ? '2px solid #c4a77d' : '2px solid transparent',
                                color: !isLogin ? '#1a1a1a' : '#999'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    marginBottom: '8px',
                                    color: '#666'
                                }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                        transition: 'border-color 0.2s'
                                    }}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: '#666'
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: '#666'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '14px'
                                }}
                                placeholder="Enter your password"
                            />
                        </div>

                        {!isLogin && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    marginBottom: '8px',
                                    color: '#666'
                                }}>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px'
                                    }}
                                    placeholder="Confirm your password"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div style={{
                                textAlign: 'right',
                                marginBottom: '24px'
                            }}>
                                <Link href="/forgot-password" style={{
                                    fontSize: '13px',
                                    color: '#c4a77d'
                                }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#1a1a1a',
                                color: 'white',
                                border: 'none',
                                fontSize: '13px',
                                fontWeight: '600',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                marginBottom: '24px'
                            }}
                        >
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>

                        <div style={{
                            textAlign: 'center',
                            color: '#999',
                            fontSize: '13px'
                        }}>
                            {isLogin ? (
                                <>
                                    Don&apos;t have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#c4a77d',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#c4a77d',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
