import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';
import Toast from './Toast';
import { useAuth } from '../context/useAuth';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { totalCount } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCollectionsClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('collection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            ✦ LUMIÈRE
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <NavLink 
              to="/"
              end
              className={({ isActive }) => isActive ? 'nav-active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>

            <a href="#collection" onClick={handleCollectionsClick}>Collections</a>

            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                if (location.pathname === '/') scrollToAbout();
                else setTimeout(scrollToAbout, 400);
               }}
            >About</Link>

             <NavLink 
              to="/contact"
              className={({ isActive }) => isActive ? 'nav-active' : ''}
              onClick={() => setMobileMenuOpen(false)}
           >
              Contact
            </NavLink>

            {isAuthenticated ? (
              <button className="nav-account-btn" onClick={logout}>
                Logout {user?.name ? `(${user.name.split(' ')[0]})` : ''}
              </button>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) => isActive ? 'nav-active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>

          <div className="nav-icons">
            <button
              className="icon-btn"
              id="search-icon-btn"
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              aria-label="Open search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            <button
              className={`icon-btn wishlist-btn${wishlist.length > 0 ? ' has-items' : ''}`}
              id="wishlist-icon-btn"
              onClick={() => { setWishlistOpen(true); setMobileMenuOpen(false); }}
              aria-label="Open wishlist"
            >
              {wishlist.length > 0 ? '♥' : '♡'}
              {wishlist.length > 0 && (
                <span className="wishlist-badge">{wishlist.length}</span>
              )}
            </button>

            <button
              className="icon-btn cart-btn"
              id="cart-icon-btn"
              onClick={() => { setCartOpen(true); setMobileMenuOpen(false); }}
              aria-label="Open cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalCount > 0 && (
                <span className="cart-badge">{totalCount}</span>
              )}
            </button>

            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} onToast={showToast} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} onToast={showToast} />
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
};

export default Navbar;
