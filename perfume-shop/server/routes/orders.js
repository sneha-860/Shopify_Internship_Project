const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const PAYMENT_OPTIONS = ['UPI', 'Credit/Debit Card', 'Cash on Delivery'];

const isValidAddress = (address = {}) => {
  const phoneOk = /^[6-9]\d{9}$/.test(address.phone || '');
  const pincodeOk = /^\d{6}$/.test(address.pincode || '');
  return Boolean(address.name?.trim() && address.line?.trim() && phoneOk && pincodeOk);
};

router.post('/', async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order requires at least one item' });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'Enter a valid name, 10-digit phone, 6-digit pincode, and address' });
    }

    if (!PAYMENT_OPTIONS.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      name: String(item.name || '').trim(),
      selectedSize: String(item.selectedSize || '').trim(),
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image
    }));

    const invalidItem = normalizedItems.find(item =>
      !item.productId ||
      !item.name ||
      !item.selectedSize ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    );

    if (invalidItem) {
      return res.status(400).json({ message: 'Order contains an invalid item' });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal >= 4000 ? Math.round(subtotal * 0.1) : 0;
    const deliveryFee = subtotal >= 2500 ? 0 : 99;
    const total = subtotal - discount + deliveryFee;

    const order = await Order.create({
      orderNumber: `LUM-${Date.now().toString().slice(-8)}`,
      items: normalizedItems,
      address: {
        name: address.name.trim(),
        phone: address.phone.trim(),
        pincode: address.pincode.trim(),
        line: address.line.trim()
      },
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
