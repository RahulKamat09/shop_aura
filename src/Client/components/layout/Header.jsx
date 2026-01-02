import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Phone, Truck, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const location = useLocation();
  const { getCartCount, wishlistItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/category', label: 'Category' },
    { path: '/product/1', label: 'Product Details' },
    { path: '/cart', label: 'Cart' },
    { path: '/checkout', label: 'Checkout' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-topbar">
        <div className="container-custom header-topbar-content">
          <div className="header-contact">
            <Phone size={16} />
            <span>Need help? Call us:</span>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </div>
          <div className="header-shipping">
            <Truck size={16} style={{ color: 'var(--primary)' }} />
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="header-options">
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              EN <ChevronDown size={12} />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              $ USD <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container-custom header-main-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            ShopAura
          </Link>

          {/* Search Bar */}
          <div className="header-search">
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>
              <Search size={20} />
            </button>
          </div>

          {/* Icons */}
          <div className="header-icons">
            <Link to="/auth" className="header-icon-btn hidden-mobile">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="header-icon-btn">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="header-badge">{wishlistItems.length}</span>
              )}
            </Link>
            <Link to="/cart" className="header-icon-btn">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="header-badge">{getCartCount()}</span>
              )}
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container-custom">
          {/* Desktop Navigation */}
          <div className="header-nav-desktop">
            <ul>
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={isActive(link.path) ? 'nav-link-active' : 'nav-link'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="header-nav-mobile">
              <ul>
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={isActive(link.path) ? 'nav-link-active' : 'nav-link'}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
