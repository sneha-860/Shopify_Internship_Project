import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import api from '../api';
import './CartDrawer.css';

const PAYMENT_OPTIONS = ['UPI', 'Credit/Debit Card', 'Cash on Delivery'];

const CartDrawer = ({ isOpen, onClose, onToast }) => {
  const { cart, increaseQty, decreaseQty, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    line: ''
  });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0]);
  const [checkoutError, setCheckoutError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal >= 4000 ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal >= 2500 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + deliveryFee;
  const phoneValid = /^[6-9]\d{9}$/.test(address.phone.trim());
  const pincodeValid = /^\d{6}$/.test(address.pincode.trim());
  const canDeliver = Boolean(address.name.trim() && phoneValid && pincodeValid && address.line.trim());

  const handleCheckout = () => {
    setCheckoutStep('address');
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setCheckoutError('');
      const response = await api.post('/orders', {
        items: cart,
        address,
        paymentMethod
      });

      clearCart();
      setCheckoutStep('cart');
      setAddress({ name: '', phone: '', pincode: '', line: '' });
      onToast(`Order ${response.data.orderNumber} placed successfully`);
      onClose();
    } catch (error) {
      setCheckoutError(error.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const updateAddress = (key, value) => {
    setCheckoutError('');
    setAddress(current => ({ ...current, [key]: value }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Your Cart</h2>
            {cart.length > 0 && <p className="drawer-subtitle">{cart.length} item{cart.length > 1 ? 's' : ''} ready for checkout</p>}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <p>Your cart is empty</p>
              <button className="drawer-continue-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="checkout-steps">
                <button className={checkoutStep === 'cart' ? 'active' : ''} onClick={() => setCheckoutStep('cart')}>Cart</button>
                <button className={checkoutStep === 'address' ? 'active' : ''} onClick={() => setCheckoutStep('address')}>Address</button>
                <button className={checkoutStep === 'payment' ? 'active' : ''} disabled={!canDeliver} onClick={() => setCheckoutStep('payment')}>Payment</button>
              </div>

              {checkoutStep === 'cart' && (
                <ul className="cart-items-list">
                  {cart.map(item => (
                    <li key={`${item.productId}-${item.selectedSize}`} className="cart-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-size">{item.selectedSize}</p>
                        <p className="cart-item-price">₹{item.price}</p>
                        <p className="cart-item-delivery">Delivery by tomorrow</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => decreaseQty(item.productId, item.selectedSize)}
                          >−</button>
                          <span className="qty-count">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => increaseQty(item.productId, item.selectedSize)}
                          >+</button>
                        </div>
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeItem(item.productId, item.selectedSize)}
                          aria-label="Remove item"
                        >✕</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {checkoutStep === 'address' && (
                <div className="checkout-panel">
                  <label>
                    Full Name
                    <input value={address.name} onChange={(e) => updateAddress('name', e.target.value)} placeholder="Enter recipient name" />
                  </label>
                  <label>
                    Phone Number
                    <input value={address.phone} onChange={(e) => updateAddress('phone', e.target.value)} placeholder="10-digit mobile number" />
                    {address.phone && !phoneValid && <span className="checkout-error">Enter a valid 10-digit Indian mobile number</span>}
                  </label>
                  <label>
                    Pincode
                    <input value={address.pincode} onChange={(e) => updateAddress('pincode', e.target.value)} placeholder="Delivery pincode" />
                    {address.pincode && !pincodeValid && <span className="checkout-error">Enter a valid 6-digit pincode</span>}
                  </label>
                  <label>
                    Address
                    <textarea value={address.line} onChange={(e) => updateAddress('line', e.target.value)} placeholder="House no, street, city" />
                  </label>
                  <button className="checkout-btn secondary" disabled={!canDeliver} onClick={() => setCheckoutStep('payment')}>
                    Deliver Here
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="checkout-panel">
                  <p className="payment-heading">Choose Payment Method</p>
                  {PAYMENT_OPTIONS.map(option => (
                    <label className="payment-option" key={option}>
                      <input
                        type="radio"
                        checked={paymentMethod === option}
                        onChange={() => setPaymentMethod(option)}
                      />
                      {option}
                    </label>
                  ))}
                  <div className="order-summary-note">
                    Order will be delivered to {address.pincode}. Payment selected: {paymentMethod}.
                  </div>
                  {checkoutError && <p className="checkout-error panel-error">{checkoutError}</p>}
                  <button className="checkout-btn" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              )}

              <div className="cart-footer">
                <div className="price-breakdown">
                  <div><span>Price</span><span>₹{subtotal.toLocaleString()}</span></div>
                  <div><span>Discount</span><span className="saving">− ₹{discount.toLocaleString()}</span></div>
                  <div><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span></div>
                  <div className="cart-subtotal">
                    <span>Total</span>
                    <span className="subtotal-amount">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button className="checkout-btn" onClick={handleCheckout} disabled={checkoutStep !== 'cart'}>
                  Checkout
                </button>
                {discount > 0 && <p className="cart-saving">You saved ₹{discount.toLocaleString()} on this order</p>}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
