const express = require('express');
const Stripe = require('stripe');

const router = express.Router();

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('STRIPE_SECRET_KEY is not configured');
    error.statusCode = 500;
    throw error;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post('/create-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Checkout requires at least one cart item' });
    }

    const lineItems = items.map((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (!item.name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 1) {
        const error = new Error('Checkout contains an invalid item');
        error.statusCode = 400;
        throw error;
      }

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${String(item.name).trim()}${item.selectedSize ? ` - ${item.selectedSize}` : ''}`,
            images: item.image ? [item.image] : []
          },
          unit_amount: Math.round(price * 100)
        },
        quantity
      };
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/?checkout=cancelled`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Unable to start Stripe checkout',
      error: error.message
    });
  }
});

module.exports = router;
