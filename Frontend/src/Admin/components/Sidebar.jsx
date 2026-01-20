import api from "../../api/api";
import toast from 'react-hot-toast';
import { Store, LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, MessageSquare, Settings, ChevronLeft, LogOut, X, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Sidebar({ currentPage, onNavigate, sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'reviews', label: 'Reviews', icon: MessageSquareText },
  ];

  const [admin, setAdmin] = useState(null);
  const adminToken = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

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
        console.error("Sidebar admin fetch failed:", error);
        toast.error('Failed To load Sidebar')
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
    // Clear admin & user session safely
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    // Redirect to auth page
    toast.success('Logged Out Successfully!')
    navigate("/auth", { replace: true });
  };

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Store />
          <span>ShopAura</span>
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
          <div className="admin-user-avatar">{admin ? getInitials(admin.name) : "AU"}</div>
          <div className="admin-user-info">
            <h4>{admin?.name || "Admin User"}</h4>
            <p>{admin?.email || "admin@estore.com"}</p>
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
