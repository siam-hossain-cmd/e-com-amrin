'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <h1>Privacy Policy</h1>
                        <p>Last updated: December 2024</p>
                    </div>

                    {/* Content */}
                    <div className="help-content legal-content">
                        <section>
                            <h2>1. Introduction</h2>
                            <p>Welcome to AMRIN ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.</p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <h3>Personal Information</h3>
                            <p>We collect personal information that you voluntarily provide when you:</p>
                            <ul>
                                <li>Register for an account</li>
                                <li>Make a purchase</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Contact our customer service</li>
                                <li>Participate in promotions or surveys</li>
                            </ul>
                            <p>This information may include:</p>
                            <ul>
                                <li>Name, email address, and phone number</li>
                                <li>Billing and shipping addresses</li>
                                <li>Payment information (processed securely through our payment providers)</li>
                                <li>Order history and preferences</li>
                            </ul>

                            <h3>Automatically Collected Information</h3>
                            <p>When you visit our website, we automatically collect certain information including:</p>
                            <ul>
                                <li>Device information (browser type, operating system)</li>
                                <li>IP address and location data</li>
                                <li>Pages visited and time spent on our site</li>
                                <li>Referring website or source</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <p>We use your information to:</p>
                            <ul>
                                <li>Process and fulfill your orders</li>
                                <li>Send order confirmations and shipping updates</li>
                                <li>Communicate about products, promotions, and sales</li>
                                <li>Improve our website and customer experience</li>
                                <li>Prevent fraud and maintain security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Information Sharing</h2>
                            <p>We do not sell your personal information. We may share your information with:</p>
                            <ul>
                                <li><strong>Service Providers:</strong> Companies that help us operate our business (shipping carriers, payment processors, email services)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Cookies and Tracking</h2>
                            <p>We use cookies and similar technologies to:</p>
                            <ul>
                                <li>Remember your preferences and shopping cart</li>
                                <li>Analyze website traffic and usage patterns</li>
                                <li>Personalize content and advertisements</li>
                            </ul>
                            <p>You can manage cookie preferences through your browser settings.</p>
                        </section>

                        <section>
                            <h2>6. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                            <ul>
                                <li>SSL encryption for all data transmission</li>
                                <li>Secure payment processing through certified providers</li>
                                <li>Regular security assessments and updates</li>
                                <li>Limited employee access to personal data</li>
                            </ul>
                        </section>

                        <section>
                            <h2>7. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                            <p>To exercise these rights, please contact us at info@amrinexclussive.com.</p>
                        </section>

                        <section>
                            <h2>8. Data Retention</h2>
                            <p>We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain information as required by law or for legitimate business purposes.</p>
                        </section>

                        <section>
                            <h2>9. Children's Privacy</h2>
                            <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.</p>
                        </section>

                        <section>
                            <h2>10. Changes to This Policy</h2>
                            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                        </section>

                        <section>
                            <h2>11. Contact Us</h2>
                            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                            <ul>
                                <li>Email: <a href="mailto:info@amrinexclussive.com">info@amrinexclussive.com</a></li>
                                <li>Phone: 03-7972 6456</li>
                                <li>Address: Unit 5-18, Plaza Prima, Old Jalan Klang Lama, Kuala Lumpur 58200, Malaysia</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
