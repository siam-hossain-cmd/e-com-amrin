'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TruckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16,8 20,8 23,11 23,16 16,16" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const ClockIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    </svg>
);

const GlobeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
);

export default function ShippingPage() {
    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <h1>Shipping Information</h1>
                        <p>Fast, reliable delivery across Malaysia and worldwide</p>
                    </div>

                    {/* Shipping Options */}
                    <div className="shipping-options">
                        <div className="shipping-card">
                            <div className="shipping-card-icon">
                                <TruckIcon />
                            </div>
                            <h3>Standard Delivery</h3>
                            <p className="shipping-time">3-5 Business Days</p>
                            <p className="shipping-price">RM 8.00</p>
                            <p className="shipping-note">Free for orders over RM 80</p>
                        </div>

                        <div className="shipping-card featured">
                            <div className="shipping-card-icon">
                                <ClockIcon />
                            </div>
                            <h3>Express Delivery</h3>
                            <p className="shipping-time">1-2 Business Days</p>
                            <p className="shipping-price">RM 15.00</p>
                            <p className="shipping-note">Free for orders over RM 150</p>
                        </div>

                        <div className="shipping-card">
                            <div className="shipping-card-icon">
                                <GlobeIcon />
                            </div>
                            <h3>International</h3>
                            <p className="shipping-time">7-14 Business Days</p>
                            <p className="shipping-price">From RM 35.00</p>
                            <p className="shipping-note">Available to 50+ countries</p>
                        </div>
                    </div>

                    {/* Shipping Details */}
                    <div className="help-content">
                        <section>
                            <h2>Domestic Shipping (Malaysia)</h2>
                            <p>We ship to all states in Malaysia including Sabah and Sarawak. Orders are processed within 1-2 business days.</p>

                            <table className="shipping-table">
                                <thead>
                                    <tr>
                                        <th>Region</th>
                                        <th>Standard (3-5 days)</th>
                                        <th>Express (1-2 days)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Peninsular Malaysia</td>
                                        <td>RM 8.00</td>
                                        <td>RM 15.00</td>
                                    </tr>
                                    <tr>
                                        <td>Sabah & Sarawak</td>
                                        <td>RM 12.00</td>
                                        <td>RM 25.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>International Shipping</h2>
                            <p>We ship worldwide! International shipping rates vary based on destination and package weight.</p>

                            <table className="shipping-table">
                                <thead>
                                    <tr>
                                        <th>Region</th>
                                        <th>Estimated Time</th>
                                        <th>Starting Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Singapore, Brunei</td>
                                        <td>3-5 days</td>
                                        <td>RM 25.00</td>
                                    </tr>
                                    <tr>
                                        <td>Southeast Asia</td>
                                        <td>5-7 days</td>
                                        <td>RM 35.00</td>
                                    </tr>
                                    <tr>
                                        <td>Middle East</td>
                                        <td>7-10 days</td>
                                        <td>RM 45.00</td>
                                    </tr>
                                    <tr>
                                        <td>Europe, USA, Australia</td>
                                        <td>10-14 days</td>
                                        <td>RM 55.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>Order Tracking</h2>
                            <p>Once your order ships, you will receive a confirmation email with a tracking number. You can track your package using:</p>
                            <ul>
                                <li>Your order confirmation email</li>
                                <li>Your account dashboard under "My Orders"</li>
                                <li>The carrier's tracking website</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Important Notes</h2>
                            <ul>
                                <li>Delivery times are estimates and may vary during peak seasons or holidays</li>
                                <li>Orders placed after 2 PM will be processed the next business day</li>
                                <li>We do not ship on weekends or public holidays</li>
                                <li>International orders may be subject to customs duties and taxes</li>
                            </ul>
                        </section>
                    </div>

                    {/* Contact CTA */}
                    <div className="help-cta">
                        <h3>Have Questions About Shipping?</h3>
                        <p>Our customer service team is here to help!</p>
                        <a href="mailto:info@amrinexclussive.com" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
