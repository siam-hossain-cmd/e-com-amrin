'use client';

import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }

        // Reset status after 5 seconds
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 5000);
    };

    return (
        <section className="section newsletter">
            <div className="container">
                <h2 className="newsletter-title">Join Our Newsletter</h2>
                <p className="newsletter-text">Subscribe for exclusive offers, new arrivals, and modest fashion tips.</p>

                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="newsletter-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>

                {message && (
                    <div className={`newsletter-message ${status}`}>
                        {status === 'success' && '✓ '}
                        {status === 'error' && '✗ '}
                        {message}
                    </div>
                )}
            </div>
        </section>
    );
}
