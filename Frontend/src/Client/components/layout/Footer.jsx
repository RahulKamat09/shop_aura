import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Send, CreditCard, Truck, ShieldCheck, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      {/* Features Strip */}
      <div className="footer-features">
        <div className="container-custom">
          <div className="footer-features-grid">
            <div className="footer-feature">
              <div className="footer-feature-icon">
                <Truck size={24} />
              </div>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over $100</p>
              </div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure payment</p>
              </div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">
                <CreditCard size={24} />
              </div>
              <div>
                <h4>Money Back</h4>
                <p>30 days guarantee</p>
              </div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">
                <Headphones size={24} />
              </div>
              <div>
                <h4>24/7 Support</h4>
                <p>Online support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container-custom">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <h3>ShopAura</h3>
              <p>Your one-stop destination for all your shopping needs. Quality products, competitive prices, and exceptional service.</p>
              <div className="footer-social">
                <a href="#"><Facebook size={18} /></a>
                <a href="#"><Twitter size={18} /></a>
                <a href="#"><Instagram size={18} /></a>
                <a href="#"><Linkedin size={18} /></a>
                <a href="#"><Youtube size={18} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/category">Shop</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-links">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/checkout">Checkout</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h4>Newsletter</h4>
              <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container-custom footer-bottom-content">
          <p>©2026 ShopAura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
