# MedEx App

A Next.js application for medical service exploration, cart checkout, and appointment booking.

---

## 🖥️ Node.js Version

This project requires **Node.js v18.18.0 or later** (v20+ recommended).

> Developed and tested with **Node.js v24.21.0**.

You can verify your Node version with:

```bash
node --version
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### 3. Other available commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (with Turbopack) |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server (run after build) |
| `npm run lint` | Run ESLint to check for code issues |

---

## 📁 Folder Structure

```
medex_app/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout (global fonts, metadata)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles (Tailwind CSS)
│   ├── types.ts                  # Shared TypeScript types
│   ├── utils.ts                  # Shared utility functions
│   ├── serviceExplorer.tsx       # Service Explorer component
│   │
│   ├── booking/                  # Appointment Booking feature
│   │   ├── page.tsx              # Booking page
│   │   ├── bookingTimeZones.tsx  # Time zone UI component
│   │   ├── booking-time-zones.css
│   │   ├── types.ts              # Booking-specific types
│   │   └── utils.ts              # Booking utility functions
│   │
│   ├── checkout/                 # Cart & Checkout feature
│   │   ├── page.tsx              # Checkout page
│   │   ├── cartCheckout.tsx      # Cart UI component
│   │   ├── cart-checkout.css
│   │   ├── types.ts              # Checkout-specific types
│   │   └── utils.ts              # Checkout utility functions
│   │
│   └── api/                      # Next.js API Routes (mock data endpoints)
│       ├── booking/
│       │   ├── bookedSlots/route.ts   # GET /api/booking/bookedSlots
│       │   ├── closures/route.ts      # GET /api/booking/closures
│       │   └── providers/route.ts     # GET /api/booking/providers
│       ├── checkout/
│       │   ├── catalog/route.ts       # GET /api/checkout/catalog
│       │   ├── guestCart/route.ts     # GET /api/checkout/guestCart
│       │   └── serverCart/route.ts    # GET /api/checkout/serverCart
│       └── serviceExplorer/
│           ├── categories/route.ts    # GET /api/serviceExplorer/categories
│           ├── providers/route.ts     # GET /api/serviceExplorer/providers
│           └── services/route.ts      # GET /api/serviceExplorer/services
│
├── data/                         # Mock JSON data files
│   ├── task1-service-explorer.json   # Data for Service Explorer
│   ├── task2-cart.json               # Data for Cart & Checkout
│   └── task3-booking.json            # Data for Appointment Booking
│
├── public/                       # Static assets (SVGs, images)
│
├── utils/
│   └── urls.js                   # Shared URL constants/helpers
│
├── next.config.ts                # Next.js configuration (Turbopack, caching)
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
└── package.json                  # Project dependencies and scripts
```

---

## 🛠️ Tech Stack

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16.4.3 |
| [React](https://react.dev) | 19.3.0 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| Node.js | v18.18+ (v20+ recommended) |

---

## 📡 API Endpoints

All API routes serve mock data from the `/data` directory.

### Service Explorer
- `GET /api/serviceExplorer/categories`
- `GET /api/serviceExplorer/providers`
- `GET /api/serviceExplorer/services`

### Checkout
- `GET /api/checkout/catalog`
- `GET /api/checkout/guestCart`
- `GET /api/checkout/serverCart`

### Booking
- `GET /api/booking/bookedSlots`
- `GET /api/booking/closures`
- `GET /api/booking/providers`

---

## 📦 Deployment

The easiest way to deploy this app is with the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
