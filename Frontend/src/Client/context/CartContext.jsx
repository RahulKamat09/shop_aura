import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Create Cart Context
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {

  /* ================= LOAD DATA FROM LOCAL STORAGE ================= */

  // Load cart items from localStorage (device-specific)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load wishlist items from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  /* ================= SYNC STATE TO LOCAL STORAGE ================= */

  // Save cart items whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist items whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /* ================= CART METHODS ================= */

  // Add product to cart or increase quantity
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const qty = product.quantity ?? 1;

      if (existing) {
        toast.success(`${product.name} quantity updated`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: qty }   // 🔥 SET, NOT ADD
            : item
        );
      }

      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: qty }];
    });
  };


  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const product = prev.find(item => item.id === productId);

      if (product) {
        toast.error(`${product.name} removed from your cart`);
      }

      return prev.filter(item => item.id !== productId);
    });
  };

  // Update quantity of a cart item
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart (used after order / logout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Get total cart price
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get total cart item count
  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };

  /* ================= WISHLIST METHODS ================= */

  // Add product to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      toast.success(`${product.name} has been added to your Wishlist.`);
      return [...prev, product];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const product = prev.find(item => item.id === productId);

      if (product) {
        toast.error(`${product.name} removed from your wishlist`);
      }

      return prev.filter(item => item.id !== productId);
    });
  };

  // Check if product exists in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  /* ================= CONTEXT PROVIDER ================= */

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
