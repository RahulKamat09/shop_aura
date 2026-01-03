import api from "../../api/api";
import { useEffect, useState } from 'react';
import { Search, Eye, Package, Calendar, User, Mail, MapPin, CreditCard } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 5;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  // Admin Order Actions (ADD ONLY)
  const handleAdminAction = async (orderId, action) => {
    let newStatus = "";

    switch (action) {
      case "confirm":
        newStatus = "Processing";
        break;
      case "complete":
        newStatus = "Completed";
        break;
      case "cancel":
        newStatus = "Cancelled";
        break;
      default:
        return;
    }

    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Order update failed", error);
    }
  };


  // CRUD Operations
  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const filters = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'all' || order.status.toLowerCase() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingOrder(null);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'processing': return 'processing';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  if (!orders.length) {
    return (
      <p style={{ padding: '2rem', textAlign: 'center' }}>
        Loading orders...
      </p>
    );
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage customer orders</p>
        </div>
      </div>

      <div className="filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => { setActiveFilter(filter.id); setCurrentPage(1); }}
          >
            {filter.label}
            <span className="count">{filter.count}</span>
          </button>
        ))}
      </div>

      <div className="search-box">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search orders by ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Orders ({filteredOrders.length})</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order.id}>
                <td style={{ color: 'var(--admin-primary)', fontWeight: 500 }}>{order.id}</td>
                <td>
                  <div className="customer-cell">
                    <h4>{order.customer.name}</h4>
                    <p>{order.customer.email}</p>
                  </div>
                </td>
                <td>{order.date}</td>
                <td>
                  <div className="status-select">
                    <select
                      className={getStatusClass(order.status)}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>${order.total.toFixed(2)}</td>
                <td>
                  <button className="btn-icon" onClick={() => handleViewOrder(order)}>
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View Order Modal */}
      <AModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title={`Order Details - ${viewingOrder?.id}`}
        footer={
          <button className="btn btn-secondary" onClick={handleCloseViewModal}>
            Close
          </button>
        }
      >
        {viewingOrder && (
          <div className="detail-view">
            <div className="order-status-header">
              <span className={`status-badge ${getStatusClass(viewingOrder.status)}`}>
                {viewingOrder.status}
              </span>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Customer Information</h4>
              <div className="detail-row">
                <User size={18} />
                <div>
                  <span className="detail-label">Name</span>
                  <p className="detail-value">{viewingOrder.customer.name}</p>
                </div>
              </div>
              <div className="detail-row">
                <Mail size={18} />
                <div>
                  <span className="detail-label">Email</span>
                  <p className="detail-value">{viewingOrder.customer.email}</p>
                </div>
              </div>
              <div className="detail-row">
                <MapPin size={18} />
                <div>
                  <span className="detail-label">Shipping Address</span>
                  <p className="detail-value">123 Main St, City, State 12345</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Order Information</h4>
              <div className="detail-row">
                <Calendar size={18} />
                <div>
                  <span className="detail-label">Order Date</span>
                  <p className="detail-value">{viewingOrder.date}</p>
                </div>
              </div>
              <div className="detail-row">
                <CreditCard size={18} />
                <div>
                  <span className="detail-label">Payment Method</span>
                  <p className="detail-value">Credit Card ending in 4242</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Order Items</h4>
              <div className="order-items-list">
                {products.slice(0, 2).map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <h5>{item.name}</h5>
                      <p>Qty: 1 × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="order-item-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-total">
              <div className="order-total-row">
                <span>Subtotal</span>
                <span>${(viewingOrder.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="order-total-row">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="order-total-row">
                <span>Tax</span>
                <span>${(viewingOrder.total * 0.1 - 10).toFixed(2)}</span>
              </div>
              <div className="order-total-row total">
                <span>Total</span>
                <span>${viewingOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </AModal>
    </div>
  );
}

export default Orders;
