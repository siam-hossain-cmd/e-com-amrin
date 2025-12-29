import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import NewsletterSection from '@/components/NewsletterSection';
import PromoBanner from '@/components/PromoBanner';
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

// Fetch hero settings
async function getHeroSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/settings/hero`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
  }
  return null;
}

// Fetch featured products
async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/products?limit=8`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
  return [];
}

// Fetch categories from database
async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/catalog`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return data.categories || [];
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
}

// Get product counts per category
async function getCategoryCounts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/products?limit=1000`, { next: { revalidate: 60 } });
    if (res.ok) {
      const products = await res.json();
      const counts = {};
      products.forEach(p => {
        const cat = (p.category || '').toLowerCase();
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return counts;
    }
  } catch (error) {
    console.error('Failed to fetch product counts:', error);
  }
  return {};
}

// Default hero settings  
const defaultHero = {
  badge: 'NEW COLLECTION 2024',
  title: 'Grace in Every',
  titleHighlight: 'Wrap',
  subtitle: 'Discover our curated collection of premium hijabs and scarves. Elegant fabrics, timeless styles, designed for the modern Muslimah.',
  primaryButtonText: 'Shop Hijabs',
  primaryButtonLink: '/products',
  secondaryButtonText: 'VIEW LOOKBOOK',
  secondaryButtonLink: '/products?collection=lookbook',
  backgroundImage: null
};

// Fallback products
const fallbackProducts = [
  { _id: '1', name: 'Premium Chiffon Hijab', brand: 'Amrin Essentials', basePrice: 45, originalPrice: 59, image: null, isNew: false },
  { _id: '2', name: 'Luxury Satin Silk Shawl', brand: 'Amrin Luxe', basePrice: 89, originalPrice: null, image: null, isNew: true },
  { _id: '3', name: 'Jersey Instant Hijab', brand: 'Amrin Easy Wear', basePrice: 35, originalPrice: 45, image: null, isNew: false },
  { _id: '4', name: 'Modal Cotton Underscarf', brand: 'Amrin Basics', basePrice: 18, originalPrice: null, image: null, isNew: true },
];

// Category gradient colors for display
const categoryGradients = {
  'hijabs': 'linear-gradient(135deg, #d4c4b5, #c4a77d)',
  'scarves': 'linear-gradient(135deg, #c9b8a5, #b09567)',
  'instant-hijabs': 'linear-gradient(135deg, #e8dfd4, #d4cec6)',
  'underscarves': 'linear-gradient(135deg, #ece5dc, #d4c4b5)',
  'shawls': 'linear-gradient(135deg, #c9bfb5, #a89585)',
  'accessories': 'linear-gradient(135deg, #ddd5cc, #c4b8a8)',
};
const defaultGradient = 'linear-gradient(135deg, #e0d6cc, #c9b8a5)';

export default async function HomePage() {
  // Fetch data on server
  const [heroData, productsData, categoriesData, productCounts] = await Promise.all([
    getHeroSettings(),
    getFeaturedProducts(),
    getCategories(),
    getCategoryCounts()
  ]);

  const hero = heroData || defaultHero;
  const products = productsData.length > 0 ? productsData : fallbackProducts;

  // Transform products to match ProductCard expected format
  const featuredProducts = products.map(p => ({
    id: p._id,
    name: p.name,
    brand: p.brand,
    price: p.basePrice,
    originalPrice: p.originalPrice || null,
    image: p.image?.url || null,
    isNew: p.isNew || false
  }));

  return (
    <>
      <Navbar cartCount={0} />
      <PromoBanner />

      {/* Hero Section - Dynamic Content */}
      <section className="hero" style={{
        backgroundImage: hero.backgroundImage?.url
          ? `url(${hero.backgroundImage.url})`
          : 'url(/images/hero-model.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right'
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          {hero.badge && (
            <span className="hero-badge">{hero.badge}</span>
          )}
          <h1 className="hero-title">
            {hero.title}<span>{hero.titleHighlight}</span>
          </h1>
          {hero.subtitle && (
            <p className="hero-text">{hero.subtitle}</p>
          )}
          <div className="hero-buttons">
            {hero.primaryButtonText && (
              <Link href={hero.primaryButtonLink || '/products'} className="btn btn-gold">
                {hero.primaryButtonText} <ArrowIcon />
              </Link>
            )}
            {hero.secondaryButtonText && (
              <Link href={hero.secondaryButtonLink || '/products'} className="btn btn-outline-dark">
                {hero.secondaryButtonText}
              </Link>
            )}
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
            {categoriesData.map((category) => (
              <Link
                href={`/products?category=${category.slug || category.name.toLowerCase().replace(' ', '-')}`}
                key={category.id || category.name}
                className="category-card"
              >
                <div
                  className="category-card-bg"
                  style={{ background: categoryGradients[category.slug] || defaultGradient }}
                />
                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name}</h3>
                  <p className="category-card-count">
                    {productCounts[category.name.toLowerCase()] || 0} Products
                  </p>
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
      <NewsletterSection />

      <Footer />
    </>
  );
}
