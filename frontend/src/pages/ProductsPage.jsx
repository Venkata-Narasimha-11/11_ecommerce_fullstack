import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Zap, Tag } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Amazon Great Tech Festival 2026',
    subtitle: 'Up to 60% Off on Top Audio Gear, Smartwatches & Ultra-Wide Monitors',
    badge: 'LIMITED TIME MEGA SALE',
    coupon: 'SAVE20',
    color: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
    accent: '#38bdf8',
  },
  {
    id: 2,
    title: '⚡ Prime Super Saver Week',
    subtitle: 'Free One-Day Delivery on All Orders + Extra $50 OFF with coupon AMAZON50',
    badge: 'PRIME EXCLUSIVE',
    coupon: 'AMAZON50',
    color: 'linear-gradient(135deg, #701a75 0%, #0f172a 100%)',
    accent: '#f472b6',
  },
  {
    id: 3,
    title: 'Next-Gen Gaming & Peripherals',
    subtitle: 'Mechanical Keyboards, Curved Displays, Precision Mice & Audio Headsets',
    badge: 'TRENDING IN TECH',
    coupon: 'FESTIVE10',
    color: 'linear-gradient(135deg, #065f46 0%, #0f172a 100%)',
    accent: '#34d399',
  },
];

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);

  // Auto-rotate hero promo banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when page, category, or search changes
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProducts({
        page,
        size,
        category_id: selectedCategory,
        search: searchQuery,
      });
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load product catalog. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setPage(1);
  };

  const totalPages = Math.ceil(total / size);
  const curBanner = PROMO_BANNERS[activeBanner];

  return (
    <div>
      {/* Amazon Hero Banner Carousel */}
      <div
        style={{
          background: curBanner.color,
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          transition: 'background 0.8s ease',
        }}
      >
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: curBanner.accent,
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              {curBanner.badge}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#ffd814',
                color: '#000',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              <Tag size={12} /> Use Code: {curBanner.coupon}
            </span>
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '0.6rem',
              color: '#ffffff',
            }}
          >
            {curBanner.title}
          </h1>

          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.25rem' }}>
            {curBanner.subtitle}
          </p>

          <button
            onClick={() => {
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="btn"
            style={{
              backgroundColor: '#ffa41c',
              color: '#000',
              fontWeight: 800,
              borderRadius: '25px',
              padding: '0.6rem 1.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Shop Deals Today &darr;
          </button>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex gap-2" style={{ position: 'absolute', right: '1.5rem', bottom: '1.5rem', zIndex: 3 }}>
          <button
            onClick={() => setActiveBanner((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Previous Banner"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setActiveBanner((prev) => (prev + 1) % PROMO_BANNERS.length)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Next Banner"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="card flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ marginBottom: '2rem', padding: '1rem 1.25rem' }}
      >
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
            <Filter size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Category:
          </span>
          <button
            onClick={() => handleCategorySelect(null)}
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2" style={{ minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="card"
          style={{
            borderColor: 'var(--danger)',
            backgroundColor: 'var(--danger-bg)',
            marginBottom: '2rem',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>
          <button onClick={fetchProducts} className="btn btn-secondary">
            <RefreshCw size={14} /> Retry Loading Catalog
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div style={{ padding: '6rem 0', textAlign: 'center' }}>
          <LoadingSpinner size={40} text="Loading Amazon store catalog..." />
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your search criteria or selecting a different category.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2" style={{ marginTop: '3rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 1rem' }}>
                Page {page} of {totalPages} ({total} Total Items)
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
