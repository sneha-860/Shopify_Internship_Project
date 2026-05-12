const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  selectedSize: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  line: { type: String, required: true, trim: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: { type: [orderItemSchema], required: true },
  address: { type: addressSchema, required: true },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit/Debit Card', 'Cash on Delivery'],
    required: true
  },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'Placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
