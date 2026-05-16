# Lumiere Perfume Shop

Lumiere is a full-stack luxury perfume ecommerce demo built for a portfolio or resume review. It shows a polished React storefront backed by an Express and MongoDB API, with product discovery, product detail pages, reviews, wishlist, cart, and checkout flow.

## Resume Highlights

- Built a responsive React 19 and Vite storefront with reusable product, review, cart, wishlist, search, toast, and gallery components.
- Implemented REST endpoints in Express for catalog filtering, product detail, review creation, order creation, health checks, and seed data.
- Added MongoDB and Mongoose models for products, reviews, and orders with validation and derived product rating updates.
- Designed ecommerce UX details including loading skeletons, empty states, localStorage cart/wishlist persistence, responsive navigation, and a multi-step checkout drawer.
- Hardened API inputs for invalid Mongo IDs, malformed numeric filters, unsafe search regex input, invalid reviews, and invalid order payloads.

## Features

### Storefront

- Luxury homepage with visual hero, offer strip, catalog filters, and responsive product grid
- Search by fragrance or brand
- Category, price, rating, and sort controls
- Product detail pages with image gallery, size selection, reviews, share links, cart, and wishlist actions
- Cart drawer with quantity controls, price breakdown, discount and delivery fee logic, address validation, and order placement
- Wishlist drawer with localStorage persistence
- Toasts, loading skeletons, retry states, and empty catalog feedback

### API

- `GET /api/health` server health check
- `GET /api/products` list products with search, category, price, rating, and sort filters
- `GET /api/products/:id` fetch one product
- `GET /api/products/:id/reviews` fetch product reviews
- `POST /api/products/:id/reviews` submit a review and recalculate product rating metrics
- `POST /api/orders` create a checkout order

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, CSS |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Tooling | ESLint, npm scripts, dotenv, nodemon |

## Project Structure

```text
perfume-shop/
  client/
    src/
      api.js
      App.jsx
      main.jsx
      assets/
      components/
      hooks/
      pages/
    .env.example
    package.json
  server/
    models/
    routes/
    .env.example
    seed.js
    server.js
    package.json
```

## Getting Started

Prerequisites:

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

Install dependencies:

```bash
cd perfume-shop/server
npm install

cd ../client
npm install
```

Create environment files:

```bash
cd ../server
cp .env.example .env

cd ../client
cp .env.example .env
```

Default server environment:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/perfume_shop
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Seed MongoDB:

```bash
cd perfume-shop/server
npm run seed
```

Run the backend:

```bash
npm run dev
```

Run the frontend in a second terminal:

```bash
cd perfume-shop/client
npm run dev
```

Open `http://localhost:3000`.

## Scripts

From the repository root:

```bash
npm run client:dev
npm run client:lint
npm run client:build
npm run server:dev
npm run server:seed
```

From each app folder:

| App | Script | Purpose |
| --- | --- | --- |
| Client | `npm run dev` | Start Vite on port 3000 |
| Client | `npm run lint` | Run ESLint |
| Client | `npm run build` | Create a production build |
| Client | `npm run preview` | Preview the production build |
| Server | `npm run dev` | Start Express with nodemon |
| Server | `npm start` | Start Express with Node |
| Server | `npm run seed` | Reset and seed products, reviews, and orders |

## Verification

Current verification:

```bash
cd perfume-shop/client
npm run lint
npm run build
```

Both commands pass.
