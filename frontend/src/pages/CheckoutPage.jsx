import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import FormInput from '../components/common/FormInput';

export const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your shopping cart is empty. Add products before checking out.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      setError('Please provide a complete shipping address (min 5 characters).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const order = await orderService.checkout(shippingAddress.trim());
      // Refresh cart to show 0 items
      await refreshCart();
      // Redirect to Order Tracking page with live WebSocket
      navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.detail || 'Checkout failed due to insufficient stock or server error.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/cart" className="flex items-center gap-1" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      {error && (
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Shipping Details
          </h3>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Delivery Address"
              name="address"
              value={shippingAddress}
              onChange={(e) => {
                setShippingAddress(e.target.value);
                setError('');
              }}
              placeholder="123 Main St, Apartment 4B, City, Postal Code"
              helperText="Full delivery address for order fulfillment"
              required
            />

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
              >
                {loading ? 'Processing Order...' : `Place Order ($${cart.total_amount?.toFixed(2)})`}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Order Summary
          </h3>

          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            {cart.items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between"
                style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    x{item.quantity}
                  </span>
                </div>
                <span style={{ fontWeight: 600 }}>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>${cart.total_amount?.toFixed(2)}</span>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            🔒 Guaranteed Safe & Secure Checkout via Atomic Transaction Engine
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
