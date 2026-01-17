import api from "../../api/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Profile.css";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Camera,
  ChevronRight,
  ShoppingCart,
  X,
  Bell,
  Mail,
  Shield,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import Layout from "../components/layout/Layout";

/* ---------------- TABS ---------------- */
const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];


const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { wishlistItems, addToCart, removeFromWishlist } = useCart();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const [toggleStates, setToggleStates] = useState({
    emailNotifications: true,
    newsletter: true,
    twoFactor: false,
  });

  const ORDERS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);


  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/customers/${userId}`);
        const [firstName, lastName = ""] = (data?.name || "").split(" ");

        setProfile({
          firstName,
          lastName,
          email: data?.email || "",
          phone: data?.phone || "",
          avatar:
            data?.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        });
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [userId]);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get(`/orders?userId=${userId}`);
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [userId]);

  if (!profile) {
    return <p className="loading">Loading profile...</p>;
  }

  /* ---------------- STATS ---------------- */
  const stats = {
    orders: orders.length,
    wishlist: wishlistItems.length,
  };

  /* ---------------- HANDLERS ---------------- */
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/customers/${userId}`, {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
        phone: profile.phone,
      });

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const handleToggle = (key) => {
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ---------------- WISHLIST HANDLERS ---------------- */
  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };


  const getStatusClass = (status = "") => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "status-completed";
      case "shipped":
        return "status-shipped";
      case "processing":
      case "pending":
        return "status-processing";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-processing";
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>My Account</span>
          </nav>
        </div>
      </div>

      <div className="profile-page">
        {/* Main Grid */}
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="sidebar-header">
              <div className="avatar-wrapper">
                <img
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="avatar-image"
                />
                <button className="avatar-edit-btn">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="user-name">{profile.firstName} {profile.lastName}</h3>
              <p className="user-email">{profile.email}</p>
            </div>

            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.orders}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.wishlist}</span>
                <span className="stat-label">Wishlist</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <button onClick={handleLogout} className="nav-item nav-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="content-section">
                <h2 className="section-title">
                  <User size={20} />
                  Personal Information
                </h2>

                <form onSubmit={handleSaveProfile} className="profile-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button type="button" className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="content-section">
                <h2 className="section-title">
                  <Package size={20} />
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag className="empty-icon" size={48} />
                    <h3 className="empty-title">No orders yet</h3>
                    <p className="empty-description">When you make your first purchase, it will appear here.</p>
                    <Link to="/category" className="btn btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {paginatedOrders.map((order) => (
                      <Link key={order.id} to={`/order/${order.id}`} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <span className="order-id">Order #{order.id.slice(0, 12)}</span>
                            <span className="order-date">{order.date}</span>
                          </div>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-footer">
                          <div className="order-items-count">
                            <Package size={14} />
                            <span>{order.items.length} items</span>
                          </div>
                          <div className="order-total">
                            <span className="total-amount">${order.total.toFixed(2)}</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="content-section">
                <h2 className="section-title">
                  <Heart size={20} />
                  My Wishlist
                  <span className="section-count">{wishlistItems.length}</span>
                </h2>

                {wishlistItems.length === 0 ? (
                  <div className="empty-state">
                    <Heart className="empty-icon" size={48} />
                    <h3 className="empty-title">Your wishlist is empty</h3>
                    <p className="empty-description">Save items you love to your wishlist and shop them later.</p>
                    <Link to="/category" className="btn btn-primary">Browse Products</Link>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="wishlist-card">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="wishlist-remove-btn"
                        >
                          <X size={14} />
                        </button>

                        <img src={item.image} alt={item.name} className="wishlist-image" />

                        <h4 className="wishlist-name">{item.name}</h4>
                        <p className="wishlist-price">${item.price.toFixed(2)}</p>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="btn btn-primary wishlist-add-btn"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="content-section">
                <h2 className="section-title">
                  <Settings size={20} />
                  Account Settings
                </h2>

                <div className="settings-list">
                  <div className="settings-item">
                    <div className="settings-info">
                      <div className="settings-icon">
                        <Bell size={18} />
                      </div>
                      <div className="settings-text">
                        <h4 className="settings-title">Email Notifications</h4>
                        <p className="settings-description">Receive email updates about your orders and account</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("emailNotifications")}
                      className={`toggle-btn ${toggleStates.emailNotifications ? "active" : ""}`}
                    >
                      <span className="toggle-dot"></span>
                    </button>
                  </div>

                  <div className="settings-item">
                    <div className="settings-info">
                      <div className="settings-icon">
                        <Mail size={18} />
                      </div>
                      <div className="settings-text">
                        <h4 className="settings-title">Newsletter</h4>
                        <p className="settings-description">Get updates on new products, sales, and promotions</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("newsletter")}
                      className={`toggle-btn ${toggleStates.newsletter ? "active" : ""}`}
                    >
                      <span className="toggle-dot"></span>
                    </button>
                  </div>

                  <div className="settings-item">
                    <div className="settings-info">
                      <div className="settings-icon">
                        <Shield size={18} />
                      </div>
                      <div className="settings-text">
                        <h4 className="settings-title">Two-Factor Authentication</h4>
                        <p className="settings-description">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("twoFactor")}
                      className={`toggle-btn ${toggleStates.twoFactor ? "active" : ""}`}
                    >
                      <span className="toggle-dot"></span>
                    </button>
                  </div>

                  <div className="danger-zone">
                    <h4 className="danger-title">Danger Zone</h4>
                    <p className="danger-description">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="btn btn-danger">
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
