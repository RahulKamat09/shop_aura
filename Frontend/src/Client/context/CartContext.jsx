import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {

  // ✅ LOAD FROM LOCAL STORAGE ON INIT
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // ✅ SAVE TO LOCAL STORAGE WHENEVER CART CHANGES
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ SAVE WISHLIST TOO
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /* ---------------- CART METHODS ---------------- */

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);

      const addQty = product.quantity ?? 1; // 👈 default to 1

      if (existing) {
        toast.success(`${product.name} quantity updated`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }

      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: addQty }];
    });
  };


  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const product = prev.find(item => item.id === productId);

      if (product) {
        toast.error(`${product.name} removed from your cart`);
      }

      return prev.filter(item => item.id !== productId);
    });
  };


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



  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems"); // ✅ clear storage
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  /* ---------------- WISHLIST METHODS ---------------- */

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev;
      }
      toast.success(`${product.name} has been added to your Wishlist.`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const product = prev.find(item => item.id === productId);

      if (product) {
        toast.error(`${product.name} removed from your wishlist`);
      }

      return prev.filter(item => item.id !== productId);
    });
  };



  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
