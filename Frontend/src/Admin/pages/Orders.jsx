import api from "../../api/api";
import { useEffect, useState } from 'react';
import { Search, Eye, Package, Calendar, User, Mail, MapPin, CreditCard } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
        ]);

        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error('Failed to Load Data!')
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );


  /* ---------------- FILTERS ---------------- */
  const filters = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
  ];

  const filteredOrders = sortedOrders.filter(order => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order?.id?.toLowerCase().includes(search) ||
      order?.customer?.name?.toLowerCase().includes(search) ||
      order?.customer?.email?.toLowerCase().includes(search);

    const matchesFilter =
      activeFilter === 'all' ||
      order?.status?.toLowerCase() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ---------------- STATUS UPDATE ---------------- */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      localStorage.setItem("ordersUpdated", Date.now());
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingOrder(null);
  };

  const getStatusClass = (status = '') => {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'processing': return 'processing';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  /* ---------------- UPDATE ORDER STATUS (MODAL) ---------------- */
  const updateOrderStatusFromModal = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}`, { status });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      setViewingOrder(prev => ({ ...prev, status }));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  /* ---------------- UPDATE PAYMENT STATUS (COD ONLY) ---------------- */
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    // ⛔ Block update if order is completed or cancelled
    if (["Completed", "Cancelled"].includes(viewingOrder.status)) {
      toast.error("Payment cannot be updated for completed or cancelled orders");
      return;
    }

    // ⛔ Block update if payment is NOT COD
    if (viewingOrder.payment?.method !== "cod") {
      toast.error("Payment status can only be updated for COD orders");
      return;
    }

    try {
      await api.patch(`/orders/${orderId}`, {
        payment: {
          ...viewingOrder.payment,
          status: paymentStatus
        }
      });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, payment: { ...order.payment, status: paymentStatus } }
            : order
        )
      );

      setViewingOrder(prev => ({
        ...prev,
        payment: { ...prev.payment, status: paymentStatus }
      }));

      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    }
  };


  if (loading) {
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
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
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
            <div className="detail-section">
              <h4 className="detail-section-title">Order Status</h4>

              <select
                className={`status-badge ${getStatusClass(viewingOrder.status)}`}
                value={viewingOrder.status}
                disabled={["Completed", "Cancelled"].includes(viewingOrder.status)}
                onChange={(e) =>
                  updateOrderStatusFromModal(viewingOrder.id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {["Completed", "Cancelled"].includes(viewingOrder.status) && (
                <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                  🔒 Order status is locked
                </p>
              )}
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
                  <p className="detail-value">
                    {viewingOrder.shippingAddress?.address}, {viewingOrder.shippingAddress?.city},<br />
                    {viewingOrder.shippingAddress?.state} {viewingOrder.shippingAddress?.zip},
                    {viewingOrder.shippingAddress?.country}
                  </p>

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
                  <span className="detail-label">Payment</span>

                  <div style={{ marginTop: "0.25rem" }}>
                    <span className="status-badge processing">
                      {viewingOrder.payment?.method?.toUpperCase()}
                    </span>
                  </div>

                  {/* COD → editable */}
                  {viewingOrder.payment?.method === "cod" &&
                    !["Completed", "Cancelled"].includes(viewingOrder.status) ? (
                    <>
                      <select
                        value={viewingOrder.payment.status}
                        onChange={(e) =>
                          updatePaymentStatus(viewingOrder.id, e.target.value)
                        }
                        style={{ marginTop: "0.5rem" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>

                      <p className="text-muted">
                        COD payment can be manually confirmed
                      </p>
                    </>
                  ) : (
                    <p className="detail-value">
                      Status:{" "}
                      <strong>{viewingOrder.payment?.status}</strong>
                    </p>
                  )}

                  {["Completed", "Cancelled"].includes(viewingOrder.status) && (
                    <p className="text-muted">
                      🔒 Payment status locked
                    </p>
                  )}
                </div>
              </div>

            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Order Items</h4>
              <div className="order-items-list">
                {viewingOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <h5>{item.name}</h5>
                      <p>
                        Qty: {item.qty} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="order-item-price">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-total">
              <div className="order-total-left">
                <div className="row">
                  <span>Subtotal</span>
                  <span>$77.99</span>
                </div>
                <div className="row">
                  <span>Shipping</span>
                  <span>$10.00</span>
                </div>
              </div>

              <div className="order-total-right">
                <span className="label">Total</span>
                <span className="amount">$87.99</span>
              </div>
            </div>
          </div>
        )}
      </AModal>
    </div>
  );
}

export default Orders;
