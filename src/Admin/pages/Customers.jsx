import { useEffect, useState } from 'react';
import { Search, Eye, Users, UserCheck, DollarSign, Mail, Phone, Calendar, ShoppingBag, MapPin } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 5;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => setCustomers(data));

    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  if (!customers.length) {
    return (
      <p style={{ padding: '2rem', textAlign: 'center' }}>
        Loading customers...
      </p>
    );
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCustomers = customers.filter(c => c.status === 'Active').length;

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCustomer(null);
  };

  // Get customer's orders
  const getCustomerOrders = (customerName) => {
    return orders.filter(o => o.customer.name === customerName);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage and view customer information</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-cards blue">
          <div className="stat-icons blue">
            <Users size={22} />
          </div>
          <div className="stat-content" style={{ marginLeft: '16px' }}>
            <span className="stat-labels">Total Customers</span>
            <h2 className="stat-values">{customers.length}</h2>
          </div>
        </div>

        <div className="stat-cards green">
          <div className="stat-icons green">
            <UserCheck size={22} />
          </div>
          <div className="stat-content" style={{ marginLeft: '16px' }}>
            <span className="stat-labels">Active Customers</span>
            <h2 className="stat-values">{activeCustomers}</h2>
          </div>
        </div>

        <div className="stat-cards orange">
          <div className="stat-icons orange">
            <DollarSign size={22} />
          </div>
          <div className="stat-content" style={{ marginLeft: '16px' }}>
            <span className="stat-labels">Total Revenue</span>
            <h2 className="stat-values">${totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="search-box">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">All Customers ({filteredCustomers.length})</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-cell">
                    <h4>{customer.name}</h4>
                    <p>{customer.email}</p>
                  </div>
                </td>
                <td>{customer.phone}</td>
                <td>{customer.registered}</td>
                <td style={{ textAlign: 'center' }}>{customer.orders}</td>
                <td style={{ color: 'var(--admin-success)', fontWeight: 500 }}>
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td>
                  <span className={`status-badge ${customer.status === 'Active' ? 'active' : 'inactive'}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => handleViewCustomer(customer)}>
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

      {/* View Customer Modal */}
      <AModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Customer Details"
        footer={
          <button className="btn btn-secondary" onClick={handleCloseViewModal}>
            Close
          </button>
        }
      >
        {viewingCustomer && (
          <div className="detail-view">
            <div className="customer-avatar-section">
              <div className="customer-avatar-large">
                {viewingCustomer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3>{viewingCustomer.name}</h3>
              <span className={`status-badge ${viewingCustomer.status === 'Active' ? 'active' : 'inactive'}`}>
                {viewingCustomer.status}
              </span>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Contact Information</h4>
              <div className="detail-row">
                <Mail size={18} />
                <div>
                  <span className="detail-label">Email</span>
                  <p className="detail-value">{viewingCustomer.email}</p>
                </div>
              </div>
              <div className="detail-row">
                <Phone size={18} />
                <div>
                  <span className="detail-label">Phone</span>
                  <p className="detail-value">{viewingCustomer.phone}</p>
                </div>
              </div>
              <div className="detail-row">
                <MapPin size={18} />
                <div>
                  <span className="detail-label">Address</span>
                  <p className="detail-value">123 Main Street, City, State 12345</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Account Information</h4>
              <div className="detail-row">
                <Calendar size={18} />
                <div>
                  <span className="detail-label">Registered</span>
                  <p className="detail-value">{viewingCustomer.registered}</p>
                </div>
              </div>
              <div className="detail-row">
                <ShoppingBag size={18} />
                <div>
                  <span className="detail-label">Total Orders</span>
                  <p className="detail-value">{viewingCustomer.orders} orders</p>
                </div>
              </div>
              <div className="detail-row">
                <DollarSign size={18} />
                <div>
                  <span className="detail-label">Total Spent</span>
                  <p className="detail-value" style={{ color: 'var(--admin-success)', fontWeight: 600 }}>
                    ${viewingCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Recent Orders</h4>
              <div className="customer-orders-list">
                {getCustomerOrders(viewingCustomer.name).length > 0 ? (
                  getCustomerOrders(viewingCustomer.name).map(order => (
                    <div key={order.id} className="customer-order-item">
                      <div>
                        <span className="order-id">{order.id}</span>
                        <span className="order-date">{order.date}</span>
                      </div>
                      <div>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                        <span className="order-amount">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>No orders found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </AModal>
    </div>
  );
}

export default Customers;
