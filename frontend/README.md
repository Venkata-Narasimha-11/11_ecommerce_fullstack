# Day 12: Tailwind CSS, Shadcn/ui, Forms & Validation Fullstack Hub

Modern, enterprise-grade Single-Page Application (SPA) built with **React 18**, **Vite**, **Tailwind CSS**, **Shadcn/ui**, **React Hook Form**, **Zod V4**, **react-dropzone**, and **WebSockets**, connected to the FastAPI E-Commerce Backend.

---

## 🌟 Day 12 Core Architecture & Highlights

| Topic | Learning & Implementation | Architectural Outcome |
| :--- | :--- | :--- |
| **Tailwind CSS** | Utility-first styling, responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`), and persistent Dark Mode class strategy | Clean, responsive, maintainable frontend layouts with seamless theme switching |
| **Shadcn/ui Suite** | Radix-powered accessible `Button`, `Dialog`, `Table`, `Toast` (Sonner), `DropdownMenu`, `Tabs`, `Input`, `Card`, `Badge` | Accessible, unified, production-standard UI component system |
| **React Forms** | `react-hook-form` state management, `useForm`, `Controller`, field state tracking | Re-render optimized, performant client-side forms |
| **Zod Validation** | Strict type-coerced schemas, regex email/phone patterns, positive bounds, password match refinement | Reliable client-side runtime validation contract |
| **Dynamic Forms** | `useFieldArray` for dynamic specifications and line items with add/remove/reorder | Scalable handling of unbounded form fields |
| **Multi-Step Workflows** | 4-step Checkout Wizard and 4-step Product Creation Wizard with step validation gates | Frictionless user flows with persistent state across steps |
| **File Uploads & Preview** | Drag & drop via `react-dropzone`, client image preview (`URL.createObjectURL`), file type/size validation | Smooth drag-and-drop media experience connected to FastAPI + Pillow services |
| **Form Accessibility** | `aria-invalid`, `aria-describedby`, accessible `<label htmlFor>`, `role="alert"`, keyboard focus rings | WCAG 2.1 AA accessible forms usable by assistive technologies |

---

## 📁 Project Folder Structure

```
ecommerce-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Dark mode switcher, Shadcn Dropdown, live cart badge
│   │   │   ├── Layout.jsx          # Shell with global Sonner Toaster & responsive container
│   │   │   ├── LoadingSpinner.jsx  # Reusable animated spinner
│   │   │   └── Modal.jsx           # Accessible dialog modal
│   │   ├── product/
│   │   │   └── ProductCard.jsx     # Responsive product card with Add-to-Cart
│   │   └── ui/                     # Shadcn/ui Core Component Suite
│   │       ├── button.jsx          # CVA button variants, sizes & loading states
│   │       ├── input.jsx           # Accessible input with focus-visible ring
│   │       ├── label.jsx           # Accessible label with required asterisk
│   │       ├── textarea.jsx        # Auto-resizing textarea
│   │       ├── card.jsx            # Card, Header, Title, Content, Footer
│   │       ├── badge.jsx           # Semantic badge variants (success, warning, etc.)
│   │       ├── dialog.jsx          # Radix accessible modal with focus trap & Esc close
│   │       ├── dropdown-menu.jsx   # Radix dropdown menu with items & separators
│   │       ├── table.jsx           # Responsive data table with header & cells
│   │       ├── tabs.jsx            # Accessible tab panels and triggers
│   │       ├── form.jsx            # React Hook Form + ARIA context primitives
│   │       ├── sonner.jsx          # Sonner toast provider & toast helper
│   │       └── image-dropzone.jsx  # react-dropzone with live preview & validation
│   ├── context/
│   │   ├── AuthContext.jsx         # User identity & JWT session persistence
│   │   ├── CartContext.jsx         # Redis shopping cart synchronization
│   │   └── ThemeContext.jsx        # Dark / Light / System theme strategy
│   ├── lib/
│   │   └── utils.js                # cn() class merging utility (clsx + twMerge)
│   ├── schemas/
│   │   ├── authSchemas.js          # Zod login & registration schemas with match refinement
│   │   ├── productSchemas.js       # Zod product & dynamic specification schemas
│   │   └── checkoutSchemas.js      # Multi-step checkout step schemas (shipping, delivery, payment)
│   ├── pages/
│   │   ├── Day12LabPage.jsx        # Interactive Day 12 Showcase Lab (6 dedicated testbeds)
│   │   ├── ProductsPage.jsx        # Responsive catalog with category filter & search
│   │   ├── ProductDetailPage.jsx   # Detailed product view
│   │   ├── LoginPage.jsx           # RHF + Zod validated login with 1-click demo fill
│   │   ├── RegisterPage.jsx        # RHF + Zod validated register with password check
│   │   ├── CartPage.jsx            # Real-time cart editor
│   │   ├── CheckoutPage.jsx        # 4-Step Multi-Step Checkout Wizard
│   │   ├── OrdersPage.jsx          # Past customer orders
│   │   ├── OrderTrackingPage.jsx   # Live order tracking with WebSocket status
│   │   └── AdminPage.jsx           # Shadcn Table, Dialog, Dropdown & 4-Step Product Wizard
│   ├── App.jsx                     # Route definitions & Context providers
│   ├── index.css                   # Tailwind directives & Shadcn HSL theme variables
│   └── main.jsx                    # Application entrypoint
├── postcss.config.js               # PostCSS tailwindcss & autoprefixer config
├── tailwind.config.js              # Tailwind tokens, dark mode & animation plugins
└── vite.config.js                  # Proxy rules for /api and /ws
```

---

## 🚀 How to Run & Verify

### 1. Launch FastAPI Backend (Port 8000)
```powershell
cd ecommerce-backend
python scripts/seed_data.py
python run.py
```

### 2. Launch React 18 Storefront & Day 12 Lab (Port 5173)
```powershell
cd ecommerce-frontend
npm.cmd install
npm.cmd run dev
```

Open your browser at:
- **Storefront & Catalog**: [http://localhost:5173/](http://localhost:5173/)
- **Day 12 Interactive Mastery Lab**: [http://localhost:5173/day12-lab](http://localhost:5173/day12-lab)
- **Multi-Step Checkout**: [http://localhost:5173/checkout](http://localhost:5173/checkout)
- **Admin Control Hub**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **FastAPI Interactive Swagger**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
