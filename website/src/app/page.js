import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Icons
const TruckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// Sample products - Hijab & Scarf Collection
const featuredProducts = [
  { id: 1, name: 'Premium Chiffon Hijab', brand: 'Amrin Essentials', price: 45, originalPrice: 59, image: null, isNew: false },
  { id: 2, name: 'Luxury Satin Silk Shawl', brand: 'Amrin Luxe', price: 89, originalPrice: null, image: null, isNew: true },
  { id: 3, name: 'Jersey Instant Hijab', brand: 'Amrin Easy Wear', price: 35, originalPrice: 45, image: null, isNew: false },
  { id: 4, name: 'Modal Cotton Underscarf', brand: 'Amrin Basics', price: 18, originalPrice: null, image: null, isNew: true },
  { id: 5, name: 'Pashmina Cashmere Scarf', brand: 'Amrin Premium', price: 120, originalPrice: 150, image: null, isNew: false },
  { id: 6, name: 'Pleated Chiffon Hijab', brand: 'Amrin Essentials', price: 55, originalPrice: null, image: null, isNew: true },
  { id: 7, name: 'Printed Voile Square Scarf', brand: 'Amrin Prints', price: 42, originalPrice: 55, image: null, isNew: false },
  { id: 8, name: 'Crepe Premium Hijab', brand: 'Amrin Luxe', price: 65, originalPrice: null, image: null, isNew: true },
];

const categories = [
  { name: 'Hijabs', count: 156, gradient: 'linear-gradient(135deg, #d4c4b5, #c4a77d)' },
  { name: 'Scarves', count: 98, gradient: 'linear-gradient(135deg, #c9b8a5, #b09567)' },
  { name: 'Instant Hijabs', count: 67, gradient: 'linear-gradient(135deg, #e8dfd4, #d4cec6)' },
  { name: 'Underscarves', count: 45, gradient: 'linear-gradient(135deg, #ece5dc, #d4c4b5)' },
];

export default function HomePage() {
  return (
    <>
      <Navbar cartCount={2} />

      {/* Hero Section - Full Width Background */}
      <section className="hero" style={{
        backgroundImage: 'url(/images/hero-model.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">NEW COLLECTION 2024</span>
          <h1 className="hero-title">
            Grace in Every<span>Wrap</span>
          </h1>
          <p className="hero-text">
            Discover our curated collection of premium hijabs and scarves.
            Elegant fabrics, timeless styles, designed for the modern Muslimah.
          </p>
          <div className="hero-buttons">
            <Link href="/products" className="btn btn-gold">
              Shop Hijabs <ArrowIcon />
            </Link>
            <Link href="/products?collection=lookbook" className="btn btn-outline-dark">
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find your perfect style</p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                key={category.name}
                className="category-card"
              >
                <div
                  className="category-card-bg"
                  style={{ background: category.gradient }}
                />
                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name}</h3>
                  <p className="category-card-count">{category.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--bg-cream)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Handpicked just for you</p>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/products" className="btn btn-dark">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <TruckIcon />
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-text">Complimentary delivery on orders over RM80</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <RefreshIcon />
              </div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-text">7-day hassle-free returns & exchanges</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <ShieldIcon />
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-text">100% secure checkout with encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <HeadphonesIcon />
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-text">Dedicated customer care team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter">
        <div className="container">
          <h2 className="newsletter-title">Join Our Newsletter</h2>
          <p className="newsletter-text">Subscribe for exclusive offers, new arrivals, and modest fashion tips.</p>
          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email"
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
