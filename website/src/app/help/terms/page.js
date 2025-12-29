'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <h1>Terms of Service</h1>
                        <p>Last updated: December 2024</p>
                    </div>

                    {/* Content */}
                    <div className="help-content legal-content">
                        <section>
                            <h2>1. Agreement to Terms</h2>
                            <p>By accessing or using the AMRIN website (www.amrin.my), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                        </section>

                        <section>
                            <h2>2. Use License</h2>
                            <p>Permission is granted to temporarily download one copy of the materials (information or software) on AMRIN's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                            <ul>
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose</li>
                                <li>Attempt to decompile or reverse engineer any software</li>
                                <li>Remove any copyright or proprietary notations</li>
                                <li>Transfer the materials to another person</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Products and Pricing</h2>
                            <h3>Product Descriptions</h3>
                            <p>We strive to display our products as accurately as possible. However, we do not warrant that product descriptions, colors, or other content is accurate, complete, reliable, or error-free. Actual colors may vary depending on your device's display settings.</p>

                            <h3>Pricing</h3>
                            <p>All prices are listed in Malaysian Ringgit (MYR) unless otherwise stated. We reserve the right to change prices at any time without notice. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.</p>

                            <h3>Availability</h3>
                            <p>All products are subject to availability. We reserve the right to limit quantities and to discontinue products at any time.</p>
                        </section>

                        <section>
                            <h2>4. Orders and Payment</h2>
                            <h3>Order Acceptance</h3>
                            <p>Your placement of an order constitutes an offer to purchase. All orders are subject to acceptance by us. We may refuse or cancel any order for any reason, including product availability, errors in pricing or product information, or suspected fraud.</p>

                            <h3>Payment</h3>
                            <p>Payment must be made at the time of purchase. We accept major credit/debit cards, online banking, and e-wallets. All payment information is processed securely through our payment providers.</p>
                        </section>

                        <section>
                            <h2>5. Shipping and Delivery</h2>
                            <p>Shipping times and costs are estimated and may vary. We are not responsible for delays caused by shipping carriers, customs, or events beyond our control. Risk of loss and title for items pass to you upon delivery to the carrier.</p>
                        </section>

                        <section>
                            <h2>6. Returns and Refunds</h2>
                            <p>Our return policy allows for returns within 14 days of delivery. Items must be in original condition with tags attached. Some items may be final sale and not eligible for return. Please refer to our Returns & Exchange policy for complete details.</p>
                        </section>

                        <section>
                            <h2>7. Intellectual Property</h2>
                            <p>All content on this website, including text, graphics, logos, images, and software, is the property of AMRIN and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.</p>
                        </section>

                        <section>
                            <h2>8. User Accounts</h2>
                            <p>When you create an account, you are responsible for:</p>
                            <ul>
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Providing accurate and current information</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                            <p>We reserve the right to terminate accounts at our discretion.</p>
                        </section>

                        <section>
                            <h2>9. Prohibited Activities</h2>
                            <p>You agree not to:</p>
                            <ul>
                                <li>Use the website for any unlawful purpose</li>
                                <li>Harass, abuse, or harm others</li>
                                <li>Submit false or misleading information</li>
                                <li>Interfere with the website's operation</li>
                                <li>Attempt to gain unauthorized access</li>
                                <li>Use automated systems to access the website</li>
                            </ul>
                        </section>

                        <section>
                            <h2>10. Disclaimer</h2>
                            <p>The materials on AMRIN's website are provided on an 'as is' basis. AMRIN makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                        </section>

                        <section>
                            <h2>11. Limitation of Liability</h2>
                            <p>In no event shall AMRIN or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on AMRIN's website.</p>
                        </section>

                        <section>
                            <h2>12. Governing Law</h2>
                            <p>These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Kuala Lumpur, Malaysia.</p>
                        </section>

                        <section>
                            <h2>13. Changes to Terms</h2>
                            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the modified terms.</p>
                        </section>

                        <section>
                            <h2>14. Contact Information</h2>
                            <p>For questions about these Terms, please contact us:</p>
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
