# 🛒 ShopKart — MERN Stack E-Commerce App

A complete full-stack e-commerce application built with the **MERN stack** — browse products, search and filter by category, manage a persistent per-user cart, check out, and track order history. It is the flagship project in my portfolio, alongside [TaskFlow](#) and [Expense Tracker](#).

> Screenshots coming soon — see the **Run locally** section to try it yourself.

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Database | MongoDB + Mongoose                           |
| Backend  | Node.js + Express (REST API)                 |
| Frontend | React (Vite) + React Router                  |
| Auth     | JWT (jsonwebtoken) + bcrypt password hashing |
| State    | React Context (auth + cart)                  |

## Features

- **Authentication** — register / login with hashed passwords (bcrypt) and JWT sessions; protected routes on both the API and the React app
- **Product catalogue** — product grid with **live search** and **category filters**, plus a product detail page
- **Persistent cart** — every user's cart is stored in MongoDB (add, change quantity, remove), with a live cart-count badge
- **Checkout & orders** — checkout converts the cart into an order with a price snapshot and shipping details; full order history per user
- **Seed data** — one command fills the store with 12 realistic products and a demo account
- **Responsive UI** — hand-written CSS (no framework), works on mobile and desktop

## Project Structure

```
shopkart-mern/
├── server/                 # Express + MongoDB API
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # User, Product, Cart, Order (Mongoose schemas)
│   ├── controllers/        # auth, product, cart, order logic
│   ├── routes/             # /api/auth, /api/products, /api/cart, /api/orders
│   ├── middleware/auth.js  # JWT verification for protected routes
│   ├── app.js              # Express app (exported for testing)
│   ├── server.js           # entry point
│   └── seed.js             # demo data seeder
└── client/                 # Vite + React frontend
    └── src/
        ├── api/            # fetch wrapper for the API
        ├── context/        # AuthContext, CartContext
        ├── components/     # Navbar, ProductCard, ProtectedRoute
        └── pages/          # Home, ProductDetail, Login, Register, Cart, Checkout, Orders
```

## Run Locally

**Prerequisites:** Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

### 1. Start the API server

```bash
cd server
cp .env.example .env        # set MONGO_URI and a JWT_SECRET
npm install
npm run seed                # loads 12 products + a demo user
npm start                   # API on http://localhost:5000
```

### 2. Start the React client

```bash
cd client
npm install
npm run dev                 # app on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so no CORS setup is needed in development. (To call the API directly instead, copy `client/.env.example` to `client/.env`.)

### Demo account

After seeding you can log in with:

- **Email:** `demo@shopkart.in`
- **Password:** `demo123`

…or simply register your own account from the Sign Up page.

## API Endpoints

| Method | Endpoint               | Auth | Description                              |
| ------ | ---------------------- | ---- | ---------------------------------------- |
| POST   | `/api/auth/register`   | —    | Create an account, returns JWT           |
| POST   | `/api/auth/login`      | —    | Log in, returns JWT                      |
| GET    | `/api/auth/me`         | ✅   | Current user's profile                   |
| GET    | `/api/products`        | —    | List products (`?search=`, `?category=`) |
| GET    | `/api/products/categories` | — | List all categories                      |
| GET    | `/api/products/:id`    | —    | Single product                           |
| GET    | `/api/cart`            | ✅   | Get my cart (with subtotal)              |
| POST   | `/api/cart`            | ✅   | Add an item `{ productId, qty }`         |
| PUT    | `/api/cart/:productId` | ✅   | Update quantity (`qty: 0` removes)       |
| DELETE | `/api/cart/:productId` | ✅   | Remove an item                           |
| POST   | `/api/orders`          | ✅   | Checkout — create order from cart        |
| GET    | `/api/orders`          | ✅   | My order history                         |
| GET    | `/api/orders/:id`      | ✅   | Single order                             |
| GET    | `/api/health`          | —    | Health check                             |

## What I Learned

- Designing a REST API with a clean **routes → controllers → models** separation
- JWT authentication end-to-end: signing, verification middleware, and token handling in React
- Modelling relationships in MongoDB (user → cart → products, order snapshots)
- Managing global state in React with Context instead of prop drilling
- Environment-based configuration for API URLs, secrets and CORS

## License

MIT © Tripti Karn
