const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const parseNumberQuery = (value, fieldName) => {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    const error = new Error(`${fieldName} must be a valid number`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

// Returns all products from the database
router.get('/', async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort
    } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') filter.category = category;

    const parsedMinPrice = parseNumberQuery(minPrice, 'minPrice');
    const parsedMaxPrice = parseNumberQuery(maxPrice, 'maxPrice');
    const parsedMinRating = parseNumberQuery(minRating, 'minRating');

    if (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice) {
      return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice' });
    }

    if (parsedMinRating !== null && (parsedMinRating < 0 || parsedMinRating > 5)) {
      return res.status(400).json({ message: 'minRating must be between 0 and 5' });
    }

    if (parsedMinPrice !== null || parsedMaxPrice !== null) {
      filter.price = {};
      if (parsedMinPrice !== null) filter.price.$gte = parsedMinPrice;
      if (parsedMaxPrice !== null) filter.price.$lte = parsedMaxPrice;
    }

    if (parsedMinRating !== null) filter.rating = { $gte: parsedMinRating };

    const sortMap = {
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { rating: -1, reviewCount: -1 },
      newest: { createdAt: -1 },
      popular: { reviewCount: -1, rating: -1 }
    };

    const products = await Product.find(filter).sort(sortMap[sort] || sortMap.popular);
    res.json(products);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.statusCode ? err.message : 'Server error', error: err.message });
  }
});

// Returns a single product by its MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Returns all reviews for a given product id
router.get('/:id/reviews', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const reviews = await Review.find({ productId: req.params.id }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Adds a new review for a product and updates product rating and reviewCount
router.post('/:id/reviews', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const { author, rating, title, body } = req.body;
    const parsedRating = Number(rating);

    if (!author?.trim() || !title?.trim() || !body?.trim() || !Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({
        message: 'Review requires author, title, body, and a rating from 1 to 5'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = new Review({
      productId: req.params.id,
      author: author.trim(),
      rating: parsedRating,
      title: title.trim(),
      body: body.trim()
    });

    const savedReview = await newReview.save();

    // Update product metrics
    const allReviews = await Review.find({ productId: req.params.id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.rating = avgRating;
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.statusCode ? err.message : 'Server error', error: err.message });
  }
});

module.exports = router;
