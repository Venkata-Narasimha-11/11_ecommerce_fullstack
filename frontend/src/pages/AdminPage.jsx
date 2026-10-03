import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Package,
  PlusCircle,
  Truck,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Bell,
  Boxes,
  Plus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import FormInput from '../components/common/FormInput';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'new-product'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [liveAlerts, setLiveAlerts] = useState([]);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
  });
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
      if (cats.length > 0 && !newProduct.category_id) {
        setNewProduct((prev) => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProducts({ size: 100 });
      setProducts(res.items || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchCategories();
      fetchProducts();
    }
  }, [isAdmin]);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!isAdmin) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/admin`;
    let socket;

    try {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'NEW_ORDER') {
            const newAlert = {
              id: Date.now(),
              text: `🔔 New Order #${data.order_id} placed by ${data.customer} ($${data.total_amount})!`,
              time: new Date().toLocaleTimeString(),
            };
            setLiveAlerts((prev) => [newAlert, ...prev].slice(0, 10));
            fetchOrders();
            fetchProducts();
          }
        } catch (e) {
          console.error('WS message parse error', e);
        }
      };
    } catch (e) {
      console.error('Admin WS error', e);
    }

    return () => {
      if (socket) socket.close();
    };
  }, [isAdmin]);

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showNotification(`Order #${orderId} status updated to ${newStatus.toUpperCase()}!`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update order status');
    }
  };

  const handleQuickRestock = async (productId, currentStock, addUnits = 10, productName = '') => {
    try {
      const newStock = Math.max(0, currentStock) + addUnits;
      await productService.updateProduct(productId, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
      showNotification(`Restocked +${addUnits} for "${productName}"! Current: ${newStock}`);
    } catch (err) {
      alert('Failed to restock product.');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showNotification(`Product "${productName}" removed.`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete product.');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category_id) {
      setProductError('Please fill in all required fields.');
      return;
    }

    setProductLoading(true);
    setProductError('');
    setProductSuccess('');
    try {
      const created = await productService.createProduct({
        name: newProduct.name.trim(),
        description: newProduct.description.trim() || undefined,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        category_id: parseInt(newProduct.category_id, 10),
        image_url: newProduct.image_url.trim() || undefined,
      });

      setProductSuccess(`Product "${created.name}" created successfully!`);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        image_url: '',
      });
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.detail || 'Failed to create product.');
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Operations Hub</h1>
            <span className="badge badge-warning">Day 11 Panel</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Storefront order management, real-time inventory controls & catalog seeder
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchOrders();
              fetchProducts();
              showNotification('Refreshed data!');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {statusMessage && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {statusMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem' }}
        >
          <Package size={16} /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem' }}
        >
          <Boxes size={16} /> Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('new-product')}
          className={`btn ${activeTab === 'new-product' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem' }}
        >
          <PlusCircle size={16} /> New Product
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Order Management</h3>
          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <LoadingSpinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No orders recorded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Order #</th>
                    <th style={{ padding: '0.75rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem' }}>Total</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Set Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>#{ord.id}</td>
                      <td style={{ padding: '0.75rem' }}>{ord.user?.username || `User #${ord.user_id}`}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>${ord.total_amount?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="form-input"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Catalog Management</h3>
          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>Product</th>
                    <th style={{ padding: '0.75rem' }}>Price</th>
                    <th style={{ padding: '0.75rem' }}>Stock</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontWeight: 600 }}>{prod.name}</span>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>${prod.price?.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: prod.stock === 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleQuickRestock(prod.id, prod.stock, 10, prod.name)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                        >
                          +10 Stock
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New Product Tab */}
      {activeTab === 'new-product' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Product</h3>

          {productError && (
            <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {productError}
            </div>
          )}

          {productSuccess && (
            <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {productSuccess}
            </div>
          )}

          <form onSubmit={handleProductSubmit}>
            <FormInput
              label="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g. Wireless Mouse"
              required
            />

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Price ($ USD)"
                name="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="49.99"
                required
              />

              <FormInput
                label="Initial Stock"
                name="stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="20"
                required
              />
            </div>

            <FormInput
              label="Image URL (Optional)"
              name="image_url"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Detailed product description..."
              />
            </div>

            <button
              type="submit"
              disabled={productLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            >
              {productLoading ? 'Creating Product...' : 'Create Product'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
