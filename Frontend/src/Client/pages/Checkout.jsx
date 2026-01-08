import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, Check } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const userId = localStorage.getItem("userId");

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    if (!userId || cartItems.length === 0) return;

    try {
      // 1️⃣ Fetch user
      const userRes = await fetch(`https://shop-aura.onrender.com/customers/${userId}`);
      const user = await userRes.json();

      if (user?.status !== "Active") {
        alert("Your account is inactive. You cannot place orders.");
        return;
      }

      const newOrder = {
        id: "ORD_" + Date.now(),
        userId,

        customer: {
          name: user.name,
          email: user.email,
          phone: formData.phone
        },

        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },

        payment: {
          method: paymentMethod,
          status: paymentMethod === "cod" ? "Pending" : "Paid"
        },

        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          image: item.image
        })),

        total: cartItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),

        status: "Pending",
        date: new Date().toISOString().split("T")[0]
      };

      // 3️⃣ Save order
      await fetch("https://shop-aura.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });

      // 4️⃣ Update customer stats
      await fetch(`https://shop-aura.onrender.com/customers/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orders: (user.orders || 0) + 1,
          totalSpent: (user.totalSpent || 0) + newOrder.total
        })
      });


    } catch (error) {
      console.error("Order placement failed:", error);
    }
  };

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shipping = getCartTotal() > 50 ? 0 : 10;
  const total = getCartTotal() + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Layout>
        <div className="container-custom" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h1>Your cart is empty</h1>
          <Link to="/category" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }
  return (

    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>Checkout</span>
          </nav>
        </div>
      </div>

      <section style={{ padding: '3rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>

          {/* Steps */}
          <div className="checkout-steps">
            <div className="checkout-step active">
              <div className="checkout-step-number">1</div>
              <span>Shipping</span>
            </div>
            <div className="checkout-step active">
              <div className="checkout-step-number">2</div>
              <span>Payment</span>
            </div>
            <div className="checkout-step">
              <div className="checkout-step-number">3</div>
              <span>Confirm</span>
            </div>
          </div>

          {!orderSuccess && (
            <form onSubmit={handleSubmit}>
              <div className='checkout-layout'>
                {/* Form Sections */}
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {/* Shipping Info */}
                  <div style={{ backgroundColor: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                      <Truck size={20} style={{ color: 'var(--primary)' }} />
                      Shipping Information
                    </h3>
                    <div className="form-grid form-grid-2">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input type="text" name="firstName" className="input-field" value={formData.firstName} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input type="text" name="lastName" className="input-field" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="input-field" value={formData.email} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input type="text" name="address" className="input-field" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="form-grid form-grid-2">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" name="city" className="input-field" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input type="text" name="state" className="input-field" value={formData.state} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ZIP Code</label>
                        <input type="text" name="zip" className="input-field" value={formData.zip} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <select name="country" className="input-field" value={formData.country} onChange={handleInputChange}>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div
                    style={{
                      backgroundColor: 'var(--card)',
                      padding: '1.5rem',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h3
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        fontWeight: '600',
                      }}
                    >
                      <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                      Payment Information
                    </h3>

                    {/* 🔹 Payment Method Buttons */}
                    <div className="payment-methods">
                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        💳 Card
                      </button>

                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        📱 UPI
                      </button>

                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('wallet')}
                      >
                        👛 Wallet
                      </button>

                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        🚚 COD
                      </button>
                    </div>

                    {/* 🔹 CARD PAYMENT */}
                    {paymentMethod === 'card' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Name on Card</label>
                          <input type="text" className="input-field" required />
                        </div>

                        <div className="form-grid form-grid-2">
                          <div className="form-group">
                            <label className="form-label">Expiry</label>
                            <input type="text" className="input-field" placeholder="MM/YY" required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input type="password" className="input-field" placeholder="123" required />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 🔹 UPI */}
                    {paymentMethod === 'upi' && (
                      <div className="form-group">
                        <label className="form-label">UPI ID</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="example@upi"
                          required
                        />
                      </div>
                    )}

                    {/* 🔹 WALLET */}
                    {paymentMethod === 'wallet' && (
                      <div className="form-group">
                        <label className="form-label">Select Wallet</label>
                        <select className="input-field">
                          <option>Paytm</option>
                          <option>PhonePe</option>
                          <option>Amazon Pay</option>
                        </select>
                      </div>
                    )}

                    {/* 🔹 COD */}
                    {paymentMethod === 'cod' && (
                      <p className="text-muted">
                        Pay with cash when your order is delivered.
                      </p>
                    )}
                  </div>

                </div>

                {/* Order Summary */}
                <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                  <div className="cart-summary">
                    <h3>Order Summary</h3>
                    {cartItems.map(item => (
                      <div key={item.id} className="summary-item">
                        <div className="summary-item-left">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="summary-item-image"
                          />
                          <div>
                            <p className="summary-item-name">{item.name}</p>
                            <p className="summary-item-qty">Qty: {item.quantity}</p>
                          </div>
                        </div>

                        <span className="summary-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="cart-summary-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
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
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                      disabled={isProcessing}
                      onClick={placeOrder}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                      {!isProcessing && <Check size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {orderSuccess && (
        <div className="order-modal-backdrop">
          <div className="order-modal animate-scale-in">

            <div className="success-icon">
              <Check size={36} />
            </div>

            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your purchase. Your order has been confirmed and will be
              delivered soon.
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate('/category')}
            >
              Continue Shopping
            </button>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default Checkout;
