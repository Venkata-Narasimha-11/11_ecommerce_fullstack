import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="card" style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <ShoppingBag size={28} color="var(--text-muted)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your temporary Redis cart has no active items. Browse the catalog to start shopping!
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Shopping Cart</h1>
        <button
          onClick={clearCart}
          disabled={loading}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--danger)' }}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Line Items (2 Cols) */}
        <div className="lg:grid-cols-2" style={{ gridColumn: 'span 2' }}>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item.product_id}
                className="card flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ padding: '1.25rem' }}
              >
                {/* Product thumbnail & Info */}
                <div className="flex items-center gap-4" style={{ width: '100%', maxWidth: '380px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-elevated)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.product_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No Image</span>
                    )}
                  </div>

                  <div>
                    <Link to={`/products/${item.product_id}`}>
                      <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {item.product_name}
                      </h4>
                    </Link>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Unit Price: ${Number(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.85rem' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 600 }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.available_stock}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.85rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Delete action */}
                <div className="flex items-center justify-between sm:justify-end gap-6" style={{ minWidth: '130px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem', borderRadius: '50%', color: 'var(--danger)' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (1 Col) */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Order Summary
            </h3>

            <div className="flex justify-between" style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Total Items:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cart.total_items}</span>
            </div>

            <div className="flex justify-between" style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Shipping:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                margin: '1.25rem 0',
              }}
            />

            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ${Number(cart.total_amount).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div
              className="flex items-center gap-2"
              style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={16} />
              <span>Atomic stock validation on order submit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
