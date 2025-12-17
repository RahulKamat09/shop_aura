import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { products } from '../../data/products';
import { useCart } from '../context/CartContext';
import { Star, Heart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id)) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} x ${product.name} added to your cart.`);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const images = [product.image, product.hoverImage];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <Link to="/category">Shop</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <section style={{ padding: '3rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <div className="product-details-grid">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="product-main-image">
                <img src={selectedImage} alt={product.name} />
              </div>
              <div className="product-thumbnails">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`product-thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="product-details-info">
              {product.badge && (
                <span className={`product-badge badge-${product.badge}`} style={{ position: 'static', marginBottom: '1rem', display: 'inline-block' }}>
                  {product.badge.toUpperCase()}
                </span>
              )}

              <h1>{product.name}</h1>

              <div className="product-rating" style={{ marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < product.rating ? 'star' : 'star-empty'}
                    fill={i < product.rating ? 'currentColor' : 'none'}
                  />
                ))}
                <span style={{ marginLeft: '0.5rem', color: 'var(--muted-foreground)' }}>
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="product-details-price">
                <span className="price-current">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="price-old">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="product-description">{product.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '3rem', textAlign: 'center' }}>{quantity}</span>
                  <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{ flex: 1, opacity: product.inStock ? 1 : 0.5 }}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  className="btn-outline"
                  onClick={handleWishlist}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} style={{ color: isInWishlist(product.id) ? 'var(--sale)' : 'inherit' }} />
                </button>
              </div>

              <div className="product-meta">
                <div className="product-meta-item">
                  <Truck size={20} />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="product-meta-item">
                  <Shield size={20} />
                  <span>2 year warranty</span>
                </div>
                <div className="product-meta-item">
                  <RotateCcw size={20} />
                  <span>30 days return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {/* ------------------------------------
     PRODUCT DESCRIPTION SECTION
------------------------------------- */}
        <div className="pd-section-block">
          <h2 className="pd-title">Product Description</h2>
          <p className="pd-text">
            {product.fullDescription ||
              `This ${product.name} is crafted with premium materials and designed for 
      comfort, durability, and modern style. Suitable for daily wear or 
      special occasions, it offers a premium feel and long-lasting quality.`}
          </p>
        </div>

        {/* ------------------------------------
        CUSTOMER REVIEWS SECTION
------------------------------------- */}
        <div className="pd-section-block">
          <h2 className="pd-title">Customer Reviews</h2>

          <div className="pd-rating-summary">
            <span className="pd-rating-score">{product.rating}.0</span>
            <div className="pd-rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < product.rating ? "star" : "star-empty"}
                  fill={i < product.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="pd-review-count">({product.reviews} reviews)</span>
          </div>

          {/* Example Reviews */}
          <div className="pd-review-card">
            <h4 className="pd-review-name">John Doe</h4>
            <div className="pd-review-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < product.rating ? "star" : "star-empty"}
                  fill={i < product.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <p className="pd-review-text">
              Great quality! Exceeded my expectations, definitely worth the price.
            </p>
          </div>

          <div className="pd-review-card">
            <h4 className="pd-review-name">Sarah Wilson</h4>
            <div className="pd-review-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < product.rating ? "star" : "star-empty"}
                  fill={i < product.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <p className="pd-review-text">
              Amazing comfort and superb craftsmanship. Highly recommended!
            </p>
          </div>
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '3rem 0', backgroundColor: 'var(--secondary)' }}>
          <div className="container-custom">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Related Products</h2>
            <div className="grid-4">
              {relatedProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetails;
