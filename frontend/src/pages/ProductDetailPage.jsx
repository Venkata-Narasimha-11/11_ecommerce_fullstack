import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  AlertCircle,
  ShieldCheck,
  Star,
  MapPin,
  Truck,
  RotateCcw,
  Zap,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  // Pin Code State
  const [pincode, setPincode] = useState('500001');
  const [pincodeMsg, setPincodeMsg] = useState('FREE delivery Tomorrow, 2 PM to 500001');

  // Customer Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Rajesh K.',
      rating: 5,
      date: 'September 24, 2026',
      title: 'Exceeded my expectations!',
      comment: 'The build quality and performance are top tier. Delivery was super fast via Prime.',
      helpful: 28,
    },
    {
      id: 2,
      author: 'Priya Sharma',
      rating: 4,
      date: 'September 18, 2026',
      title: 'Great value for money',
      comment: 'Very solid product. Design is premium and works seamlessly right out of the box.',
      helpful: 14,
    },
  ]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product detail:', err);
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length >= 5) {
      setPincodeMsg(`✓ Delivery available! FREE delivery by Tomorrow, 2 PM to ${pincode}`);
    } else {
      setPincodeMsg('Please enter a valid 6-digit pin code.');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent('/checkout'));
      return;
    }
    setBuying(true);
    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to process purchase');
    } finally {
      setBuying(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const addedRev = {
      id: Date.now(),
      author: user?.username || 'Verified Customer',
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: 'Verified Customer Review',
      comment: newReviewText.trim(),
      helpful: 1,
    };

    setReviews([addedRev, ...reviews]);
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <LoadingSpinner size={36} text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {error || 'Product not found'}
        </p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const originalMrp = (Number(product.price) * 1.35).toFixed(2);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <Link
        to="/"
        className="flex items-center gap-1"
        style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-8" style={{ padding: '2.5rem' }}>
        {/* Product Media Column */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              border: '1px solid var(--border)',
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '420px',
                  objectFit: 'cover',
                  filter: isOutOfStock ? 'grayscale(80%)' : 'none',
                }}
              />
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No Image Provided</span>
            )}
          </div>

          {/* Delivery & Assurance Badges */}
          <div
            className="grid grid-cols-3 gap-2"
            style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
          >
            <div className="card" style={{ padding: '0.75rem 0.5rem' }}>
              <Truck size={20} color="#00a8e1" style={{ margin: '0 auto 4px auto' }} />
              <span>Fast Prime Delivery</span>
            </div>
            <div className="card" style={{ padding: '0.75rem 0.5rem' }}>
              <RotateCcw size={20} color="#10b981" style={{ margin: '0 auto 4px auto' }} />
              <span>7 Days Replacement</span>
            </div>
            <div className="card" style={{ padding: '0.75rem 0.5rem' }}>
              <ShieldCheck size={20} color="#f59e0b" style={{ margin: '0 auto 4px auto' }} />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>

        {/* Product Info & Buy Box Column */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              {product.category && (
                <span className="badge badge-primary">{product.category.name}</span>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#00a8e1',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                }}
              >
                <Zap size={14} fill="#00a8e1" /> prime
              </span>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Amazon Rating */}
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center" style={{ color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" opacity={0.4} />
              </div>
              <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600 }}>
                4.6 out of 5 stars
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                &bull; ({reviews.length + 140} verified ratings)
              </span>
            </div>

            {/* Price section */}
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
              }}
            >
              <div className="flex items-baseline gap-3">
                <span style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ${Number(product.price).toFixed(2)}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${originalMrp}
                </span>
                <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
                  26% Off
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Inclusive of all taxes &bull; Use code <strong style={{ color: '#ffd814' }}>SAVE20</strong> for 20% off at checkout
              </p>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description || 'Premium build quality designed for daily reliability and performance.'}
            </p>

            {/* Pin Code Delivery Estimator */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <MapPin size={16} color="var(--primary)" />
                <span>Check Delivery Speed & Availability:</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  className="input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter PIN Code"
                  style={{ maxWidth: '180px', padding: '0.45rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                  Check
                </button>
              </form>
              <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>
                {pincodeMsg}
              </p>
            </div>
          </div>

          {/* Amazon Buy Box */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
              {isOutOfStock ? (
                <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>
                  ❌ Currently Out of Stock
                </span>
              ) : isLowStock ? (
                <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem' }}>
                  ⚠️ Only {product.stock} units left!
                </span>
              ) : (
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                  ✓ In Stock ({product.stock} units)
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-3" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quantity:</label>
                <select
                  className="input"
                  style={{ width: '80px', padding: '0.45rem' }}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* Add to Cart (Yellow) */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding || buying}
                className="btn"
                style={{
                  backgroundColor: isOutOfStock ? '#475569' : '#ffd814',
                  color: isOutOfStock ? '#94a3b8' : '#0f1111',
                  fontWeight: 800,
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  borderRadius: '25px',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {adding ? (
                  <span>Adding to Cart...</span>
                ) : added ? (
                  <>
                    <Check size={18} color="#059669" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now (Orange) */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || adding || buying}
                className="btn"
                style={{
                  backgroundColor: isOutOfStock ? '#334155' : '#ffa41c',
                  color: isOutOfStock ? '#64748b' : '#0f1111',
                  fontWeight: 800,
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  borderRadius: '25px',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {buying ? (
                  <span>Processing Checkout...</span>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Buy Now (Instant Checkout)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="card" style={{ marginTop: '2rem', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={22} color="var(--primary)" />
          Customer Reviews & Ratings ({reviews.length})
        </h2>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Write a Customer Review
          </h3>

          {reviewSubmitted && (
            <div
              className="flex items-center gap-2"
              style={{
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
              }}
            >
              <Check size={16} />
              <span>Thank you! Your verified review has been published.</span>
            </div>
          )}

          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReviewRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star
                    size={20}
                    fill={star <= newReviewRating ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="input"
            rows="3"
            placeholder="What did you like or dislike? How was the performance?"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
            required
          />

          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.author}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    Verified Purchase
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
              </div>

              <div className="flex items-center gap-1" style={{ color: '#f59e0b', marginBottom: '0.4rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} />
                ))}
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginLeft: '6px' }}>
                  {rev.title}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
