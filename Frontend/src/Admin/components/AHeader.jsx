import api from "../../api/api";
import toast from "react-hot-toast";
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, Settings, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AHeader({ onToggleSidebar, sidebarOpen, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (adminToken !== "admin_logged_in") return;

    const fetchAdmin = async () => {
      try {
        const { data } = await api.get("/admin");

        setAdmin({
          name: data.name,
          email: data.email,
          avatar: data.avatar || null,
        });
      } catch (error) {
        console.error("Admin fetch failed:", error);
        toast.error("Failed to load admin profile");
      }
    };

    fetchAdmin();
  }, [adminToken]);



  const getInitials = (name = "") =>
    name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();


  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");

    toast.success("Logged out successfully");
    navigate("/auth", { replace: true });
  };


  const notifications = [
    { id: 1, title: 'New order received', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment confirmed', time: '1 hour ago', unread: true },
    { id: 3, title: 'New customer registered', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="header-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-srch">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-dropdown">
          <button
            className="header-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-dropdown-menu notifications-menu">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <span className="badge-primary">{unreadCount} new</span>
              </div>
              <div className="dropdown-content">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-dot"></div>
                    <div className="notification-info">
                      <p className="notification-title">{notification.title}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="btn-link">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          className="header-icon-btn"
          onClick={() => onNavigate('settings')}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>


        {/* Profile */}
        <div className="header-dropdown">
          <button
            className="header-profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className="header-avatar">{admin ? getInitials(admin.name) : "AU"}</div>
            <span className="header-username">{admin ? admin.name : "Admin"}</span>
            <ChevronDown size={16} />
          </button>

          {showProfile && (
            <div className="header-dropdown-menu profile-menu">
              <div className="profile-header">
                <div className="profile-avatar">{admin ? getInitials(admin.name) : "AU"}</div>
                <div className="profile-info">
                  <h4>{admin?.name || "Admin User"}</h4>
                  <p>{admin?.email || "admin@estore.com"}</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button className="dropdown-item" onClick={() => onNavigate('settings')}>
                  <Settings size={16} />
                  Account Settings
                </button>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AHeader;
