import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const shipping = getCartTotal() > 100 ? 0 : 10;
  const total = getCartTotal() + shipping;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>Cart</span>
          </nav>
        </div>
      </div>

      <section style={{ padding: '3rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>Your cart is empty</p>
              <Link to="/category" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {/* Cart Items */}
              <div style={{ backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {/* Header */}
                <div className="cart-header">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {/* Items */}
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{item.category}</p>
                      </div>
                    </div>
                    <div style={{ fontWeight: '500' }}>${item.price.toFixed(2)}</div>
                    <div className="quantity-selector">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={{ width: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--muted-foreground)' }}>
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                <div className="cart-summary">
                  <h3>Order Summary</h3>
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    Proceed to Checkout <ArrowRight size={18} />
                  </Link>
                  <button onClick={clearCart} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
