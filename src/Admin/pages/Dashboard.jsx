import { useEffect, useState } from 'react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

function Dashboard({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);

  /* ---------------- FETCH DATA FROM db.json ---------------- */
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data));

    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => setOrders(data));

    fetch('http://localhost:5000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  /* ---------------- CALCULATIONS (UNCHANGED) ---------------- */
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  const recentOrders = orders.slice(0, 5);
  const recentMessages = messages.slice(0, 3);
  const topProducts = products.slice(0, 3);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'processing': return 'processing';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="stats-grid">
        <div className="stat-cards blue">
          <div className="stat-content">
            <span className="stat-labels">Total Revenue</span>
            <h2 className="stat-values">${totalRevenue.toFixed(2)}</h2>
            <div className="stat-changes positive">
              <TrendingUp size={14} /> +12.5%
            </div>
          </div>
          <div className="stat-icons blue">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="stat-cards green">
          <div className="stat-content">
            <span className="stat-labels">Total Products</span>
            <h2 className="stat-values">{products.length}</h2>
          </div>
          <div className="stat-icons green">
            <Package size={22} />
          </div>
        </div>

        <div className="stat-cards orange">
          <div className="stat-content">
            <span className="stat-labels">Total Orders</span>
            <h2 className="stat-values">{orders.length}</h2>
            <p style={{ fontSize: '12px' }}>
              {pendingOrders} pending
            </p>
          </div>
          <div className="stat-icons orange">
            <ShoppingCart size={22} />
          </div>
        </div>

        <div className="stat-cards purple">
          <div className="stat-content">
            <span className="stat-labels">Total Customers</span>
            <h2 className="stat-values">{customers.length}</h2>
          </div>
          <div className="stat-icons purple">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* ---------------- TABLES ---------------- */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Recent Orders</h3>
              <a className="view-all-link" onClick={() => onNavigate('orders')}>
                View all <ArrowRight size={16} />
              </a>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer.name}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------- SIDEBAR ---------------- */}
        <div className="dashboard-sidebar">
          <div className="card messages-widget">
            <div className="card-header">
              <h3 className="card-title">Messages</h3>
              {unreadMessages > 0 && (
                <span className="new-badge">{unreadMessages} new</span>
              )}
            </div>

            {recentMessages.map(msg => (
              <div key={msg.id} className="mini-message">
                <MessageSquare size={18} />
                <div>
                  <h4>{msg.subject}</h4>
                  <p>{msg.sender}</p>
                </div>
              </div>
            ))}

            <a className="view-all-link" onClick={() => onNavigate('messages')}>
              View all messages
            </a>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Products</h3>
            </div>

            {topProducts.map(product => (
              <div key={product.id} className="top-product">
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
