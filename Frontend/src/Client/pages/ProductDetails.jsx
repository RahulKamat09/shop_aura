import api from "../../api/api";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { Star, Heart, Minus, Plus, Truck, Shield, RotateCcw, CircleCheckBig } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, updateQuantity, cartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);


  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const isLoggedIn = Boolean(token && userId);


  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: ""
  });


  const cartItem = product
    ? cartItems.find(item => item.id === product.id)
    : null;

  const displayQuantity = cartItem ? cartItem.quantity : quantity;

  /* ---------------- FETCH PRODUCT BY ID ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        /* 1️⃣ Fetch main product */
        const { data } = await api.get(`/products/${id}`);

        if (!data || !data.id) {
          toast.error("Product not found");
          setLoading(false);
          return;
        }

        setProduct(data);
        setSelectedImage(data.image);

        /* 2️⃣ Fetch related products */
        const { data: related } = await api.get(
          `/products?category=${data.category}&id_ne=${data.id}&_limit=4`
        );

        setRelatedProducts(related || []);

      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const handleAddToCart = () => {
    if (!product) return;

    if (cartItem) {
      // product already in cart → ADD ONE MORE
      addToCart({
        ...product,
        quantity: cartItem.quantity + 1
      });
    } else {
      // first time add → SET selected quantity
      addToCart({
        ...product,
        quantity
      });
    }
  };


  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Fetch Reviews 

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const { data } = await api.get(`/reviews?productId=${product.id}`);

      setReviews(data);
      calculateRatings(data); // 🔥 IMPORTANT
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setReviewLoading(false);
    }
  };


  useEffect(() => {
    if (product?.id) {
      fetchReviews();
    }
  }, [product]);

  // Handle Submit Review

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to submit a review");
      navigate("/auth");
      return;
    }

    try {
      await api.post("/reviews", {
        ...reviewForm,
        productId: product.id,
        userId,                // ✅ associate review with user
        createdAt: new Date().toISOString(),
        adminReply: ""
      });

      toast.success("Review submitted");
      setReviewForm({ name: "", rating: 5, comment: "" });
      fetchReviews();
    } catch {
      toast.error("Failed to submit review");
    }
  };


  // Count Reviews 

  const calculateRatings = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) {
      setAverageRating(0);
      setReviewCount(0);
      return;
    }

    const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / reviewsData.length;

    setAverageRating(Math.round(avg * 10) / 10); // 1 decimal
    setReviewCount(reviewsData.length);
  };

  // Get Users Name 

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      if (!isLoggedIn) return;

      try {
        const { data } = await api.get(`/customers/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setLoggedInUser(data);

        // auto-fill name in review form
        setReviewForm((prev) => ({
          ...prev,
          name: data.name
        }));

      } catch (error) {
        console.error("Failed to fetch user", error);
        toast.error("Failed to load user details");
      }
    };

    fetchLoggedInUser();
  }, [isLoggedIn, userId, token]);



  if (loading || !product) {
    return (
      <Layout>
        <p style={{ textAlign: "center", padding: "4rem 0" }}>
          Loading product details...
        </p>
      </Layout>
    );
  }


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
                    className={i < Math.round(averageRating) ? 'star' : 'star-empty'}
                    fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                  />
                ))}

                <span style={{ marginLeft: '0.5rem', color: 'var(--muted-foreground)' }}>
                  ({reviewCount} reviews)
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
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      if (cartItem) {
                        updateQuantity(product.id, cartItem.quantity - 1);
                      } else {
                        setQuantity(q => Math.max(1, q - 1));
                      }
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ width: '3rem', textAlign: 'center' }}>
                    {displayQuantity}
                  </span>

                  <button
                    className="quantity-btn"
                    onClick={() => {
                      if (cartItem) {
                        updateQuantity(product.id, cartItem.quantity + 1);
                      } else {
                        setQuantity(q => q + 1);
                      }
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  className={`btn-primary ${cartItem ? 'btn-added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{
                    flex: 1,
                    backgroundColor: cartItem ? '#22c55e' : undefined,
                    borderColor: cartItem ? '#22c55e' : undefined
                  }}
                >
                  {!product.inStock ? (
                    'Out of Stock'
                  ) : cartItem ? (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <CircleCheckBig size={20} />
                      Added To Cart
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
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

          {reviewLoading && <p>Loading reviews...</p>}

          {!reviewLoading && reviews.length === 0 && (
            <p>No reviews yet. Be the first to review this product.</p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="pd-review-card">
              <h4 className="pd-review-name">{review.name}</h4>

              <div className="pd-review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < review.rating ? "star" : "star-empty"}
                    fill={i < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="pd-review-text">{review.comment}</p>

              {review.adminReply && (
                <div className="pd-admin-reply">
                  <strong>Admin Reply:</strong>
                  <p>{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoggedIn ? (
          <button
            className="btn-primary btn-extra"
            onClick={() => setIsReviewModalOpen(true)}
          >
            Write a Review
          </button>
        ) : (
          <button
            className="btn-primary btn-extra"
            onClick={() => navigate("/auth")}
          >
            Login to write a review
          </button>
        )}


      </div>

      {/* Related Products */}
      {
        relatedProducts.length > 0 && (
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
        )
      }

      {isReviewModalOpen && (
        <div className="review-modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
          <div
            className="review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="review-modal-header">
              <h3>Write a Review</h3>
              <button
                className="review-modal-close"
                onClick={() => setIsReviewModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form className="pd-review-form" onSubmit={(e) => {
              handleReviewSubmit(e);
              setIsReviewModalOpen(false);
            }}>
              <input
                type="text"
                value={reviewForm.name}
                disabled
                className="review-name-disabled"
              />

              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>

              <textarea
                placeholder="Write your review..."
                required
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
              />

              <button className="btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      )}

    </Layout >
  );
};

export default ProductDetails;