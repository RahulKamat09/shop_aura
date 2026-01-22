import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, CircleCheckBig } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.id === product.id);


  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.inStock || isInCart) return;

    addToCart({ ...product, quantity: 1 });
  };


  const handleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getBadgeClass = () => {
    switch (product.badge) {
      case 'new': return 'badge-new';
      case 'sale': return 'badge-sale';
      case 'soldout': return 'badge-soldout';
      default: return '';
    }
  };

  // Helper For Reviews

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ SINGLE LINK */}
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-card-image">
          {product.badge && (
            <span className={`product-badge ${getBadgeClass()}`}>
              {product.badge.toUpperCase()}
            </span>
          )}

          <img
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < product.rating ? 'star' : 'star-empty'}
                fill={i < product.rating ? 'currentColor' : 'none'}
              />
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginLeft: '0.25rem' }}>
              ({product.reviews})
            </span>
          </div>

          <h3 className="product-name">{product.name}</h3>

          <div className="product-price">
            <span className="price-current">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="price-old">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* ✅ ACTIONS OUTSIDE LINK */}
      <div className="product-actions">
        <button
          className={`product-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={handleWishlist}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>

        <button
          className={`product-action-btn cart-btn ${isInCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || isInCart}
          title={isInCart ? 'Added to cart' : 'Add to cart'}
        >
          {isInCart ? (
            <CircleCheckBig size={18} />
          ) : (
            <ShoppingCart size={18} />
          )}
        </button>


        <button
          className="product-action-btn"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
