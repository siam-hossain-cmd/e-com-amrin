'use client';

import { useState, useEffect } from 'react';

// Icons
const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22,2 15,22 11,13 2,9" />
    </svg>
);

// Email Templates
const emailTemplates = {
    news: {
        name: 'News / Announcement',
        subject: '[AMRIN EXCLUSIVE] Latest News & Updates',
        style: { headerBg: '#1a1a1a', headerColor: '#ffffff', accentColor: '#c4a77d' },
        previewText: 'Stay updated with our latest news'
    },
    offer: {
        name: 'Special Offer',
        subject: '🎉 [AMRIN EXCLUSIVE] Special Offer Just For You!',
        style: { headerBg: '#b74b4b', headerColor: '#ffffff', accentColor: '#b74b4b' },
        previewText: 'Limited time offer - Don\'t miss out!'
    },
    promo: {
        name: 'New Collection / Promo',
        subject: '✨ [AMRIN EXCLUSIVE] New Collection Has Arrived!',
        style: { headerBg: '#c4a77d', headerColor: '#1a1a1a', accentColor: '#c4a77d' },
        previewText: 'Discover our latest collection'
    }
};

export default function NewsletterPage() {
    const [activeTab, setActiveTab] = useState('subscribers');
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Email composer state
    const [selectedTemplate, setSelectedTemplate] = useState('news');
    const [emailSubject, setEmailSubject] = useState(emailTemplates.news.subject);
    const [emailContent, setEmailContent] = useState('');

    // Fetch subscribers
    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/newsletter/subscribers');
            if (res.ok) {
                const data = await res.json();
                setSubscribers(data.subscribers || []);
            }
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateChange = (templateKey) => {
        setSelectedTemplate(templateKey);
        setEmailSubject(emailTemplates[templateKey].subject);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();

        if (!emailContent.trim()) {
            setMessage({ type: 'error', text: 'Please enter email content' });
            return;
        }

        if (subscribers.length === 0) {
            setMessage({ type: 'error', text: 'No subscribers to send to' });
            return;
        }

        setSending(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: emailSubject,
                    content: emailContent,
                    template: selectedTemplate,
                    templateStyle: emailTemplates[selectedTemplate].style
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Email sent successfully to ${data.sentCount} subscribers!` });
                setEmailContent('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send email' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to send email. Please try again.' });
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Newsletter</h1>
                    <p className="page-subtitle">Manage subscribers and send email campaigns</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="newsletter-stats">
                <div className="stat-card">
                    <div className="stat-icon subscribers">
                        <UsersIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{subscribers.length}</span>
                        <span className="stat-label">Total Subscribers</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon emails">
                        <MailIcon />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">3</span>
                        <span className="stat-label">Email Templates</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="newsletter-tabs">
                <button
                    className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subscribers')}
                >
                    <UsersIcon /> Subscribers
                </button>
                <button
                    className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
                    onClick={() => setActiveTab('compose')}
                >
                    <MailIcon /> Compose Email
                </button>
            </div>

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
                <div className="card">
                    <div className="card-header">
                        <h3>Email Subscribers</h3>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                Loading subscribers...
                            </p>
                        ) : subscribers.length === 0 ? (
                            <div className="empty-state">
                                <UsersIcon />
                                <h4>No subscribers yet</h4>
                                <p>Subscribers will appear here when people sign up via the newsletter form.</p>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Email Address</th>
                                        <th>Subscribed Date</th>
                                        <th>Source</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribers.map((sub, index) => (
                                        <tr key={sub._id || index}>
                                            <td>{index + 1}</td>
                                            <td><strong>{sub.email}</strong></td>
                                            <td>{formatDate(sub.subscribedAt)}</td>
                                            <td>{sub.source || 'website'}</td>
                                            <td>
                                                <span className={`status-badge ${sub.status}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="card">
                    <div className="card-header">
                        <h3>Compose Email Campaign</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSendEmail} className="email-form">
                            {/* Template Selection */}
                            <div className="form-group">
                                <label>Email Template</label>
                                <div className="template-selector">
                                    {Object.entries(emailTemplates).map(([key, template]) => (
                                        <button
                                            type="button"
                                            key={key}
                                            className={`template-btn ${selectedTemplate === key ? 'active' : ''}`}
                                            onClick={() => handleTemplateChange(key)}
                                            style={{
                                                '--template-color': template.style.headerBg
                                            }}
                                        >
                                            <span className="template-indicator" style={{ background: template.style.headerBg }}></span>
                                            {template.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="form-group">
                                <label>Subject Line</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div className="form-group">
                                <label>Email Content</label>
                                <textarea
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    placeholder="Write your email content here...

You can include:
• New product announcements
• Special discount codes
• Upcoming sales or events
• Fashion tips and styling advice"
                                    rows={12}
                                    required
                                />
                            </div>

                            {/* Preview */}
                            <div className="email-preview">
                                <h4>Email Preview</h4>
                                <div className="preview-card" style={{
                                    borderTop: `4px solid ${emailTemplates[selectedTemplate].style.headerBg}`
                                }}>
                                    <div className="preview-header" style={{
                                        background: emailTemplates[selectedTemplate].style.headerBg,
                                        color: emailTemplates[selectedTemplate].style.headerColor
                                    }}>
                                        AMRIN EXCLUSIVE
                                    </div>
                                    <div className="preview-body">
                                        <h3>{emailSubject}</h3>
                                        <p style={{ whiteSpace: 'pre-wrap' }}>
                                            {emailContent || 'Your email content will appear here...'}
                                        </p>
                                    </div>
                                    <div className="preview-footer">
                                        ARS MULTIGROUP SDN BHD (1286095-V)<br />
                                        Unit 5-18, Plaza Prima, Old Jalan Klang Lama<br />
                                        Kuala Lumpur 58200, Malaysia
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            {message.text && (
                                <div className={`form-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Send Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={sending || subscribers.length === 0}
                                >
                                    {sending ? 'Sending...' : (
                                        <>
                                            <SendIcon /> Send to {subscribers.length} Subscribers
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
