import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Client/context/CartContext";
import Index from "./Client/pages/Index";
import About from "./Client/pages/About";
import Category from "./Client/pages/Category";
import ProductDetails from "./Client/pages/ProductDetails";
import Cart from "./Client/pages/Cart";
import Checkout from "./Client/pages/Checkout";
import Contact from "./Client/pages/Contact";
import Wishlist from "./Client/pages/Wishlist";
import Profile from "./Client/pages/Profile";
import NotFound from "./Client/pages/NotFound";
import AdminApp from "./Admin/AdminApp";
import AuthPage from "./Client/components/auth/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicAuthRoute from "./routes/PublicAuthRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import OrderProductPage from "./Client/pages/OrderProductPage";
import ScrollToTop from "./Client/components/ScrollToTop";
import { Toaster } from "react-hot-toast";

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#1f2933',
            color: '#fff',
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/*" element={<AdminProtectedRoute><AdminApp /></AdminProtectedRoute>} />
        <Route path="/auth" element={<PublicAuthRoute><AuthPage /></PublicAuthRoute>} />
        <Route path="/order/:orderId" element={<OrderProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

export default App;
