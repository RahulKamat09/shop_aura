import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AHeader from './components/AHeader';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import AdminReviews from './pages/AdminReviews';
import '../Admin/styles/admin.css';

function AdminApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    // On mobile/tablet, toggle the mobile sidebar
    if (window.innerWidth <= 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      // On desktop, collapse/expand the sidebar
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Close mobile sidebar when navigating
    setMobileSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'messages':
        return <Messages />;
      case 'reviews':
        return <AdminReviews />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <div className={`admin-main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <AHeader
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={!sidebarCollapsed}
          onNavigate={handleNavigate}
        />
        <main className="admin-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
