# MedEx App

A Next.js application for medical service exploration, cart checkout, and appointment booking.

---

## Node.js Version

This project requires **Node.js v18.18.0 or later** (v20+ recommended).

> Developed and tested with **Node.js v24.21.0**.

Verify your version:

```bash
node --version
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Available commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server (after build) |
| `npm run lint` | Run ESLint |

---

## Page Routes

These are the navigable pages of the app, accessible from the sticky navbar.

| Route | Page | Description |
|---|---|---|
| `/` | Service Explorer | Browse, filter, and search medical services by category, location, and price |
| `/checkout` | Cart Checkout | View cart items, apply discounts, and proceed to payment |
| `/booking` | Appointment Booking | Select a provider, pick a date and time slot, and book an appointment |

---

## API Routes

All API routes serve mock JSON data from the `/data` directory.

### Service Explorer — `/api/serviceExplorer`

| Method | Endpoint | Description | Data source |
|---|---|---|---|
| GET | `/api/serviceExplorer/categories` | List all service categories | `task1-service-explorer.json` |
| GET | `/api/serviceExplorer/providers` | List all providers | `task1-service-explorer.json` |
| GET | `/api/serviceExplorer/services` | List all services | `task1-service-explorer.json` |

### Checkout — `/api/checkout`

| Method | Endpoint | Description | Data source |
|---|---|---|---|
| GET | `/api/checkout/catalog` | Full service catalog for cart | `task2-cart.json` |
| GET | `/api/checkout/guestCart` | Guest (unauthenticated) cart | `task2-cart.json` |
| GET | `/api/checkout/serverCart` | Server-side cart | `task2-cart.json` |

### Booking — `/api/booking`

| Method | Endpoint | Description | Data source |
|---|---|---|---|
| GET | `/api/booking/providers` | Bookable providers | `task3-booking.json` |
| GET | `/api/booking/bookedSlots` | Already booked time slots | `task3-booking.json` |
| GET | `/api/booking/closures` | Provider closure periods | `task3-booking.json` |

---

## Folder Structure

```
medex_app/
|-- app/                              # Next.js App Router root
|   |-- layout.tsx                    # Root layout (fonts, metadata, Navbar)
|   |-- page.tsx                      # Home page  →  /
|   |-- globals.css                   # Global styles (Tailwind CSS + navbar)
|   |-- types.ts                      # Shared TypeScript types
|   |-- utils.ts                      # Shared utility functions
|   |-- serviceExplorer.tsx           # Service Explorer UI component
|   |
|   |-- booking/                      # Route: /booking
|   |   |-- page.tsx                  # Booking page entry
|   |   |-- bookingTimeZones.tsx      # Time zone picker component
|   |   |-- booking-time-zones.css    # Booking styles
|   |   |-- types.ts                  # Booking-specific types
|   |   +-- utils.ts                  # Booking utility functions
|   |
|   |-- checkout/                     # Route: /checkout
|   |   |-- page.tsx                  # Checkout page entry
|   |   |-- cartCheckout.tsx          # Cart UI component
|   |   |-- cart-checkout.css         # Checkout styles
|   |   |-- types.ts                  # Checkout-specific types
|   |   +-- utils.ts                  # Checkout utility functions
|   |
|   +-- api/                          # API Route handlers
|       |-- booking/
|       |   |-- bookedSlots/route.ts  # GET /api/booking/bookedSlots
|       |   |-- closures/route.ts     # GET /api/booking/closures
|       |   +-- providers/route.ts    # GET /api/booking/providers
|       |-- checkout/
|       |   |-- catalog/route.ts      # GET /api/checkout/catalog
|       |   |-- guestCart/route.ts    # GET /api/checkout/guestCart
|       |   +-- serverCart/route.ts   # GET /api/checkout/serverCart
|       +-- serviceExplorer/
|           |-- categories/route.ts   # GET /api/serviceExplorer/categories
|           |-- providers/route.ts    # GET /api/serviceExplorer/providers
|           +-- services/route.ts     # GET /api/serviceExplorer/services
|
|-- components/
|   +-- Navbar.tsx                    # Sticky nav bar (Services / Checkout / Booking)
|
|-- data/                             # Mock JSON data files
|   |-- task1-service-explorer.json   # Data for Service Explorer
|   |-- task2-cart.json               # Data for Cart & Checkout
|   +-- task3-booking.json            # Data for Appointment Booking
|
|-- public/                           # Static assets (SVGs, images)
|
|-- utils/
|   +-- urls.js                       # Shared URL constants/helpers
|
|-- next.config.ts                    # Next.js config (Turbopack, caching)
|-- tsconfig.json                     # TypeScript configuration
|-- eslint.config.mjs                 # ESLint configuration
+-- package.json                      # Dependencies and scripts
```

---

## Tech Stack

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16.4.3 |
| [React](https://react.dev) | 19.3.0 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| Node.js | v18.18+ (v20+ recommended) |

---

## Deployment

The easiest way to deploy is with the [Vercel Platform](https://vercel.com/new).

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
