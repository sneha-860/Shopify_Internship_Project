import React, { useState } from 'react';
import Toast from '../components/Toast';
import './ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email';
    if (form.message.trim().length < 10) nextErrors.message = 'Message should be at least 10 characters';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setToastMessage("Message sent! We'll get back to you soon ✨");
    setToastVisible(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setToastVisible(false), 3200);
  };

  return (
    <div className="contact-page fade-in">
      <div className="contact-hero">
        <h1 className="contact-heading">Get in Touch</h1>
        <p className="contact-subtext">We'd love to hear from you</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              className="form-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              className="form-input form-textarea"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us how we can help..."
              required
            />
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>

          <button className="contact-submit-btn" type="submit">
            Send Message
          </button>
        </form>
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};

export default ContactPage;
