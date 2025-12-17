import { useState } from 'react';
import { Menu, Search, Bell, Settings, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AHeader({ onToggleSidebar, sidebarOpen, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

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
            <div className="header-avatar">AU</div>
            <span className="header-username">Admin</span>
            <ChevronDown size={16} />
          </button>

          {showProfile && (
            <div className="header-dropdown-menu profile-menu">
              <div className="profile-header">
                <div className="profile-avatar">AU</div>
                <div className="profile-info">
                  <h4>Admin User</h4>
                  <p>admin@estore.com</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button className="dropdown-item">
                  <User size={16} />
                  My Profile
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  Account Settings
                </button>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-content">
                <button className="dropdown-item logout">
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
