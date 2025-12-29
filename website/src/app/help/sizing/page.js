'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SizingPage() {
    return (
        <>
            <Navbar />
            <main className="help-page">
                <div className="container">
                    {/* Hero Section */}
                    <div className="help-hero">
                        <h1>Size Guide</h1>
                        <p>Find your perfect fit with our comprehensive sizing chart</p>
                    </div>

                    {/* Size Tips */}
                    <div className="size-tips">
                        <div className="size-tip">
                            <span className="tip-icon">📏</span>
                            <h4>How to Measure</h4>
                            <p>Use a soft measuring tape and measure yourself while wearing minimal clothing for accuracy.</p>
                        </div>
                        <div className="size-tip">
                            <span className="tip-icon">💡</span>
                            <h4>Between Sizes?</h4>
                            <p>If you're between sizes, we recommend going up for a more comfortable fit.</p>
                        </div>
                        <div className="size-tip">
                            <span className="tip-icon">👗</span>
                            <h4>Coverage Style</h4>
                            <p>Our hijabs are designed for modest coverage with generous fabric allowance.</p>
                        </div>
                    </div>

                    {/* Size Charts */}
                    <div className="help-content">
                        <section>
                            <h2>Square Hijabs</h2>
                            <p>Our signature square hijabs come in versatile sizes for various styling options.</p>
                            <table className="size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Dimensions</th>
                                        <th>Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="size-badge">S</span> Small</td>
                                        <td>100cm × 100cm</td>
                                        <td>Petite frames, simple styles</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">M</span> Medium</td>
                                        <td>115cm × 115cm</td>
                                        <td>Most popular, versatile styling</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">L</span> Large</td>
                                        <td>130cm × 130cm</td>
                                        <td>Extra coverage, layered styles</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">XL</span> Extra Large</td>
                                        <td>145cm × 145cm</td>
                                        <td>Maximum coverage, tall frames</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>Instant Hijabs</h2>
                            <p>Pre-styled for easy wear. Size based on head circumference.</p>
                            <table className="size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Head Circumference</th>
                                        <th>Front Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="size-badge">S</span> Small</td>
                                        <td>52-54 cm</td>
                                        <td>70 cm</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">M</span> Medium</td>
                                        <td>55-57 cm</td>
                                        <td>75 cm</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">L</span> Large</td>
                                        <td>58-60 cm</td>
                                        <td>80 cm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>Shawls & Pashminas</h2>
                            <p>Rectangular hijabs for elegant draping and versatile styling.</p>
                            <table className="size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Dimensions</th>
                                        <th>Style</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="size-badge">R</span> Regular</td>
                                        <td>175cm × 70cm</td>
                                        <td>Classic shawl style</td>
                                    </tr>
                                    <tr>
                                        <td><span className="size-badge">W</span> Wide</td>
                                        <td>200cm × 85cm</td>
                                        <td>Extra coverage, pleated styles</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2>Underscarves & Inner Caps</h2>
                            <table className="size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Head Circumference</th>
                                        <th>Stretch Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="size-badge">OS</span> One Size</td>
                                        <td>50-60 cm</td>
                                        <td>High stretch fabric</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="size-note">Our underscarves feature stretchy fabric that accommodates most head sizes comfortably.</p>
                        </section>

                        <section>
                            <h2>How to Measure Your Head</h2>
                            <div className="measure-guide">
                                <div className="measure-step">
                                    <div className="measure-icon">1</div>
                                    <p>Wrap a soft measuring tape around your head, just above your ears and eyebrows.</p>
                                </div>
                                <div className="measure-step">
                                    <div className="measure-icon">2</div>
                                    <p>Keep the tape snug but not tight. Make sure it's level all the way around.</p>
                                </div>
                                <div className="measure-step">
                                    <div className="measure-icon">3</div>
                                    <p>Note the measurement in centimeters and refer to our size charts above.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Contact CTA */}
                    <div className="help-cta">
                        <h3>Still Unsure About Your Size?</h3>
                        <p>Our styling team is happy to help you find the perfect fit!</p>
                        <a href="mailto:info@amrinexclussive.com" className="btn btn-primary">Get Sizing Help</a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
