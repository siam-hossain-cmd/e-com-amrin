import Link from 'next/link';

// Icons
const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
);

const PinterestIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">AMRIN</div>
                        <p className="footer-about">
                            Your destination for elegant hijabs and modest fashion.
                            Premium fabrics, timeless designs, crafted for the modern Muslimah.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
                            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
                            <a href="#" aria-label="Twitter"><TwitterIcon /></a>
                            <a href="#" aria-label="Pinterest"><PinterestIcon /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Shop</h4>
                        <div className="footer-links">
                            <Link href="/products?category=hijabs">Hijabs</Link>
                            <Link href="/products?category=scarves">Scarves</Link>
                            <Link href="/products?category=instant">Instant Hijabs</Link>
                            <Link href="/products?category=underscarves">Underscarves</Link>
                            <Link href="/products?sale=true">Sale</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Help</h4>
                        <div className="footer-links">
                            <Link href="/help/shipping">Shipping Info</Link>
                            <Link href="/help/returns">Returns & Exchange</Link>
                            <Link href="/help/sizing">Size Guide</Link>
                            <Link href="/help/faq">FAQ</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Contact</h4>
                        <div className="footer-links">
                            <a href="mailto:hello@amrin.my">hello@amrin.my</a>
                            <a href="tel:+60123456789">+60 12-345 6789</a>
                            <span>Kuala Lumpur, Malaysia</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2024 AMRIN. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
