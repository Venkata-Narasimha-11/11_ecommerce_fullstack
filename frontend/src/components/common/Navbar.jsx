import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, User, LogOut, Store } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={20} color="white" />
          </div>
          <span>FastStore</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link to="/" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            Catalog
          </Link>

          {/* Cart Icon with Live Badge */}
          <Link
            to="/cart"
            className="flex items-center gap-2"
            style={{
              position: 'relative',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cart</span>
            {cart.total_items > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '2px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {cart.total_items}
              </span>
            )}
          </Link>

          {/* User Auth controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--warning-bg)',
                    color: 'var(--warning)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span>⚡ Admin Panel</span>
                </Link>
              )}

              <Link
                to="/orders"
                className="flex items-center gap-1"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
              >
                <Package size={16} />
                <span>Orders</span>
              </Link>

              <div className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <User size={16} />
                <span>{user?.username}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
