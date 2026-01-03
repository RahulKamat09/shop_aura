import { Store, LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, MessageSquare, Settings, ChevronLeft, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ currentPage, onNavigate, sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    // Clear admin & user session safely
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Redirect to auth page
    navigate("/auth", { replace: true });
  };

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Store />
          <span>eStore</span>
        </div>
        <button
          className="sidebar-toggle desktop-only"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronLeft style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none' }} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-user">
          <div className="admin-user-avatar">AU</div>
          <div className="admin-user-info">
            <h4>Admin User</h4>
            <p>admin@estore.com</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;
