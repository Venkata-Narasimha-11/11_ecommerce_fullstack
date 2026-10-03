# Day 11: React Fundamentals, Hooks & Router Integration

Welcome to **Day 11** of the intensive fullstack roadmap!

This folder contains the complete, pure implementation of **Day 11**: **React 18 Fundamentals**, **Core Hooks (`useState`, `useEffect`, `useRef`)**, **Custom Hooks (`useAuth`, `useCart`, `useOrderWebSocket`)**, **React Router v6 Nested Routing & Protected Routes**, and **Axios Service Layer with Silent Refresh Token Interceptors**, connected to the FastAPI E-Commerce Backend Hub.

---

## 📁 Day 11 Project Structure

```
11_ecommerce_fullstack/
├── README.md                           # Day 11 Architecture Guide
├── frontend/                           # React 18 + Vite SPA (Pure Day 11)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx          # Live cart badge, user session state & logout
│   │   │   │   ├── Layout.jsx          # Application Shell layout with <Outlet />
│   │   │   │   ├── FormInput.jsx       # Controlled input component with validation
│   │   │   │   ├── Modal.jsx           # Accessible dialog modal
│   │   │   │   └── LoadingSpinner.jsx  # Reusable animated SVG spinner
│   │   │   └── product/
│   │   │       └── ProductCard.jsx     # Product presentation card with Add-to-Cart
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User identity, token persistence & login/logout
│   │   │   └── CartContext.jsx         # Redis shopping cart synchronization
│   │   ├── hooks/
│   │   │   ├── useAuth.js              # AuthContext consumer hook
│   │   │   ├── useCart.js              # CartContext consumer hook
│   │   │   └── useOrderWebSocket.js    # WebSocket hook managing live /ws/orders/:id
│   │   ├── pages/
│   │   │   ├── ProductsPage.jsx        # Catalog with search, filters & pagination
│   │   │   ├── ProductDetailPage.jsx   # Detailed product view & quantity selection
│   │   │   ├── LoginPage.jsx           # Controlled login form with useState
│   │   │   ├── RegisterPage.jsx        # Controlled signup form with validation
│   │   │   ├── CartPage.jsx            # Real-time Redis cart editor
│   │   │   ├── CheckoutPage.jsx        # Controlled shipping form & checkout
│   │   │   ├── OrdersPage.jsx          # Customer past order history
│   │   │   ├── OrderTrackingPage.jsx   # Live order tracking with WebSocket
│   │   │   └── AdminPage.jsx           # Admin orders & catalog management
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx      # Route guard redirecting to /login
│   │   ├── services/
│   │   │   ├── api.js                  # Centralized Axios with 401 interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── App.jsx                     # Route definitions & Context providers
│   │   ├── index.css                   # Custom CSS design system (Pure CSS)
│   │   └── main.jsx                    # React 18 DOM mount point
│   ├── package.json                    # Pure dependencies: react, react-router-dom, axios, lucide-react
│   └── vite.config.js                  # Proxy rules for /api and /ws to port 8000
└── backend/                            # FastAPI E-Commerce Hub
    ├── app/                            # Routers, models, schemas, redis & celery
    ├── scripts/seed_data.py            # Database seeder (Admin, Customer, Catalog)
    └── run.py                          # Uvicorn runner on port 8000
```

---

## 🚀 How to Run Day 11

### Terminal 1: Launch Day 11 Backend
```powershell
cd 11_ecommerce_fullstack/backend
python scripts/seed_data.py
python run.py
```

### Terminal 2: Launch Day 11 Frontend
```powershell
cd 11_ecommerce_fullstack/frontend
npm.cmd run dev
```

### Open in Browser:
- **Day 11 Storefront**: [http://localhost:5173/](http://localhost:5173/)
- **Day 11 Login**: [http://localhost:5173/login](http://localhost:5173/login)
- **Day 11 Admin Hub**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **FastAPI Swagger**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
