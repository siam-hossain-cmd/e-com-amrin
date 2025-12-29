'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RefreshIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23,4 23,10 17,10" />
        <polyline points="1,20 1,14 7,14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
);

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12" />
    </svg>
);

const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function ReturnsPage() {
    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <div className="help-hero-icon">
                            <RefreshIcon />
                        </div>
                        <h1>Returns & Exchange</h1>
                        <p>Easy returns within 14 days of purchase</p>
                    </div>

                    {/* Return Policy Highlights */}
                    <div className="policy-highlights">
                        <div className="policy-card">
                            <span className="policy-number">14</span>
                            <span className="policy-label">Days Return Window</span>
                        </div>
                        <div className="policy-card">
                            <span className="policy-number">Free</span>
                            <span className="policy-label">Returns for Exchanges</span>
                        </div>
                        <div className="policy-card">
                            <span className="policy-number">5-7</span>
                            <span className="policy-label">Days Refund Processing</span>
                        </div>
                    </div>

                    {/* Return Details */}
                    <div className="help-content">
                        <section>
                            <h2>Return Policy</h2>
                            <p>We want you to love your AMRIN pieces! If you're not completely satisfied, you may return or exchange items within 14 days of delivery.</p>
                        </section>

                        <section>
                            <h2>What Can Be Returned?</h2>
                            <div className="return-conditions">
                                <div className="condition eligible">
                                    <h4><CheckIcon /> Eligible for Return</h4>
                                    <ul>
                                        <li>Items in original condition with tags attached</li>
                                        <li>Unworn, unwashed, and unaltered items</li>
                                        <li>Items in original packaging</li>
                                        <li>Items returned within 14 days of delivery</li>
                                    </ul>
                                </div>
                                <div className="condition not-eligible">
                                    <h4><XIcon /> Not Eligible for Return</h4>
                                    <ul>
                                        <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                                        <li>Items that have been worn, washed, or altered</li>
                                        <li>Items with removed tags or damaged packaging</li>
                                        <li>Items returned after 14 days</li>
                                        <li>Underscarves and inner caps (for hygiene reasons)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2>How to Return</h2>
                            <div className="return-steps">
                                <div className="step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h4>Start Your Return</h4>
                                        <p>Log in to your account and go to "My Orders". Select the item you wish to return and click "Request Return".</p>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h4>Pack Your Item</h4>
                                        <p>Place the item in its original packaging with all tags attached. Include a copy of your order confirmation.</p>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h4>Ship It Back</h4>
                                        <p>Use the prepaid shipping label (for exchanges) or ship using your preferred carrier.</p>
                                    </div>
                                </div>
                                <div className="step">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h4>Get Your Refund</h4>
                                        <p>Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2>Exchanges</h2>
                            <p>Want a different size or color? Exchanges are free! Simply select "Exchange" when initiating your return request and choose your preferred item. We'll ship the new item once we receive your return.</p>
                        </section>

                        <section>
                            <h2>Refund Information</h2>
                            <table className="shipping-table">
                                <thead>
                                    <tr>
                                        <th>Payment Method</th>
                                        <th>Refund Timeline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Credit/Debit Card</td>
                                        <td>5-7 business days</td>
                                    </tr>
                                    <tr>
                                        <td>Online Banking (FPX)</td>
                                        <td>3-5 business days</td>
                                    </tr>
                                    <tr>
                                        <td>e-Wallet (GrabPay, Touch'n Go)</td>
                                        <td>1-3 business days</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                                Note: Original shipping charges are non-refundable. Return shipping costs are the customer's responsibility unless returning for an exchange.
                            </p>
                        </section>
                    </div>

                    {/* Contact CTA */}
                    <div className="help-cta">
                        <h3>Need Help with a Return?</h3>
                        <p>Our customer service team is here to assist you!</p>
                        <a href="mailto:info@amrinexclussive.com" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
