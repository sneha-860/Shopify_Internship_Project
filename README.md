# Lumiere Perfume Shop

A full-stack luxury perfume e-commerce app built with React, Vite, Express, MongoDB, and Mongoose. It includes a product catalog, product details, image galleries, reviews, cart and wishlist drawers, search, responsive pages, and seeded sample data.

## Features

### Frontend
- Responsive React single-page app with React Router
- Product catalog with loading skeletons
- Product detail pages with image gallery, size selection, reviews, and share links
- Cart drawer with quantity controls and localStorage persistence
- Wishlist drawer with localStorage persistence
- Search overlay backed by the products API
- Toast notifications and polished responsive styling

### Backend
- Express REST API
- MongoDB models for products and reviews
- Product list/detail endpoints
- Review submission with automatic rating and review count recalculation
- Database seeding script
- Health check endpoint
- CORS and environment variable support

## Tech Stack

### Client
- React 19
- Vite
- React Router
- Axios
- CSS3

### Server
- Node.js
- Express 5
- MongoDB
- Mongoose
- CORS
- dotenv

## Project Structure

```text
perfume-shop/
  client/
    src/
      api.js
      App.jsx
      main.jsx
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

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

Install dependencies for both apps:

```bash
cd perfume-shop/server
npm install

cd ../client
npm install
```

Create backend environment file:

```bash
cd ../server
cp .env.example .env
```

Default backend environment:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/perfume_shop
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
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

## Scripts

### Server
- `npm start` - start the Express server
- `npm run dev` - start the Express server with nodemon
- `npm run seed` - reset and seed products/reviews

### Client
- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

## API Endpoints

- `GET /api/health` - server health check
- `GET /api/products` - list all products
- `GET /api/products/:id` - get one product
- `GET /api/products/:id/reviews` - list product reviews
- `POST /api/products/:id/reviews` - create a product review
- `POST /api/orders` - create a checkout order

## Notes

- The Vite dev server proxies `/api` requests to `http://localhost:5000`.
- Cart and wishlist data are stored in browser localStorage.
- Product and review data are stored in MongoDB.
- The frontend can use `VITE_API_BASE_URL` if the API is deployed separately.

## Verification

The client currently passes:

```bash
npm run lint
npm run build
```

---

Lumiere Perfume Shop - a polished full-stack e-commerce project for a resume or portfolio.
