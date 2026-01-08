import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-section bg-hero">
      <div className="container-custom">
        <div className="hero-grid">
          {/* Left Content */}
          <div className="animate-slide-up">
            <span className="hero-badge">
              New Collection 2025
            </span>
            <h1 className="hero-title">
              Discover Stylish{' '}
              <span style={{ color: 'var(--primary)' }}>Fashion</span> For Every Season
            </h1>
            <p className="hero-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <Link to="/category" className="btn-primary">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/category" className="btn-outline">
                View Collection
              </Link>
            </div>
            <div className="hero-features">
              <div className="hero-feature">
                <Truck size={20} />
                <span>Free Shipping</span>
              </div>
              <div className="hero-feature">
                <Shield size={20} />
                <span>Secure Payment</span>
              </div>
              <div className="hero-feature">
                <RotateCcw size={20} />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image-container animate-fade-in">
            <div className="discount-badge">
              <span>30%</span>
              <span>OFF</span>
            </div>
            <img
              src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-f-9.webp"
              alt="Hero Fashion"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
