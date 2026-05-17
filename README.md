# Lumiere Perfume Shop

Lumiere is a full-stack luxury perfume ecommerce project built for a portfolio-ready shopping experience. It includes a polished React storefront, an Express and MongoDB API, product filtering, product detail pages, cart and wishlist drawers, JWT authentication, and a Stripe Checkout test-mode integration.

## Screenshots

Add screenshots after deployment:

| Home | Collection | Product Detail |
| --- | --- | --- |
| `screenshots/home.png` | `screenshots/collection.png` | `screenshots/product-detail.png` |

| Cart / Checkout | Login / Signup | Mobile |
| --- | --- | --- |
| `screenshots/cart.png` | `screenshots/auth.png` | `screenshots/mobile.png` |

## Features

- Responsive luxury ecommerce storefront built with React and Vite
- Product catalog with search, category, rating, price range, and sort filters
- Filters combine together and work with both live API data and static fallback demo data
- Product detail pages with image gallery, size selection, reviews, sharing, cart, and wishlist actions
- Cart drawer with quantity controls, address validation, price summary, and checkout flow
- Stripe hosted Checkout Session integration for test-mode payments
- JWT login/signup flow with hashed passwords
- Wishlist and cart persistence with localStorage
- Reusable loading skeletons and app-level error boundary
- Express REST API with MongoDB and Mongoose models
- Seed script with 13 demo perfume products and reviews
- Vercel-ready frontend deployment config

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, CSS |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Stripe Checkout Sessions |
| Tooling | ESLint, dotenv, nodemon, npm |

## Project Structure

```text
perfume-shop/
  client/
    src/
      components/
      context/
      data/
      hooks/
      pages/
      api.js
      App.jsx
      main.jsx
    vercel.json
    package.json
  server/
    middleware/
    models/
    routes/
    seed.js
    server.js
    package.json
vercel.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Stripe test account for checkout testing

### Install Dependencies

```bash
cd perfume-shop/server
npm install

cd ../client
npm install
```

### Environment Variables

Create `perfume-shop/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/perfume_shop
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
STRIPE_SECRET_KEY=sk_test_replace_me
```

Create `perfume-shop/client/.env`:

```env
VITE_API_BASE_URL=/api
```

For deployed frontend + deployed backend, set:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Database Seed

```bash
cd perfume-shop/server
npm run seed
```

This resets products, reviews, and orders, then inserts the demo catalog.

## Run Locally

Start the backend:

```bash
cd perfume-shop/server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd perfume-shop/client
npm run dev
```

Open:

```text
http://localhost:3000
```

## Stripe Test Checkout

This project uses Stripe hosted Checkout Sessions. The server creates the Checkout Session and returns `session.url`; the client redirects with `window.location.href`.

1. Add your Stripe test secret key to `perfume-shop/server/.env`.
2. Add `Stripe Checkout` as the selected payment method in the cart.
3. Click `Place Order`.
4. Use Stripe test card `4242 4242 4242 4242`, any future expiry date, any CVC, and any ZIP/postal code.

Relevant files:

- `perfume-shop/server/routes/checkout.js`
- `perfume-shop/client/src/components/CartDrawer.jsx`

## Authentication

The app uses JWT auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Passwords are hashed with `bcryptjs`, and JWTs are stored client-side in localStorage for this portfolio demo.

Relevant files:

- `perfume-shop/server/models/User.js`
- `perfume-shop/server/routes/auth.js`
- `perfume-shop/client/src/context/AuthContext.jsx`
- `perfume-shop/client/src/pages/AuthPage.jsx`

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/products` | Product list with optional query filters |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/products/:id/reviews` | Product reviews |
| POST | `/api/products/:id/reviews` | Create review |
| POST | `/api/orders` | Create non-Stripe order |
| POST | `/api/checkout/create-session` | Create Stripe Checkout Session |
| POST | `/api/auth/signup` | Create user account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Fetch current user |

## Scripts

From the repository root:

```bash
npm run client:dev
npm run client:lint
npm run client:build
npm run server:dev
npm run server:seed
```

## Vercel Frontend Deployment

Recommended Vercel settings:

- Root Directory: `perfume-shop/client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

The frontend contains fallback demo data, so the UI can still render on Vercel before the Express backend is deployed.

## Verification

```bash
cd perfume-shop/client
npm run lint
npm run build
```

Both should pass before pushing.

## Future Improvements

- Deploy the Express API separately on Render, Railway, or another Node host
- Add Stripe webhook fulfillment for `checkout.session.completed`
- Add order history for authenticated users
- Add automated tests for filters, auth, checkout routes, and cart behavior
- Optimize hero image size for production performance
