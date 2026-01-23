import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, X, Eye, CircleCheckBig } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart({
      ...product,
      quantity:
        cartItems.find(item => item.id === product.id)?.quantity + 1 || 1
    });
  };


  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>Wishlist</span>
          </nav>
        </div>
      </div>

      <section style={{ padding: '3rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>
            <Heart size={32} style={{ color: 'var(--primary)' }} />
            My Wishlist ({wishlistItems.length})
          </h1>

          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Heart size={64} style={{ color: 'var(--muted-foreground)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>Your wishlist is empty</p>
              <Link to="/category" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid-4">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img src={item.image} alt={item.name} />

                    {/* Eye icon → Go to Product Details */}
                    <button
                      className="wishlist-eye-btn"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <Eye size={18} />
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="wishlist-remove-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="wishlist-item-info">
                    <h4 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{item.name}</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1.125rem' }}>${item.price.toFixed(2)}</p>
                    <div className="wishlist-item-actions">
                      {(() => {
                        const isInCart = cartItems.some(cart => cart.id === item.id);

                        return (
                          <button
                            className="wishlist-item-actions btn-primary"
                            style={{
                              flex: 1,
                              fontSize: '0.875rem',
                              padding: '0.5rem 1rem',
                              backgroundColor: isInCart ? '#22c55e' : undefined,
                              borderColor: isInCart ? '#22c55e' : undefined
                            }}
                            onClick={() => handleMoveToCart(item)}
                          >
                            {isInCart ? (
                              <>
                                <CircleCheckBig size={16} /> Added
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} /> Add to Cart
                              </>
                            )}
                          </button>
                        );
                      })()}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Wishlist;
