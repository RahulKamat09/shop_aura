import { useEffect, useState } from 'react';
import { Search, Trash2, Circle, CheckCircle, CornerUpLeft, Eye, Send, Mail, User, Calendar } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 4;

function Messages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/messages')
      .then(res => res.json())
      .then(data => {
        // ⏳ 1 second delay
        setTimeout(() => {
          setMessages(data);
          setLoading(false);
        }, 500);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  if (!messages.length) {
    return (
      <p style={{ padding: '2rem', textAlign: 'center' }}>
        Loading messages...
      </p>
    );
  }

  // CRUD Operations
  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const updateMessageStatus = (id, status) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
  };

  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' },
    { id: 'replied', label: 'Replied' }
  ];

  const filteredMessages = messages.filter(msg => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'all' || msg.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id);
    }
  };

  const handleViewMessage = (msg) => {
    setViewingMessage(msg);
    setIsViewModalOpen(true);
    // Mark as read when viewing
    if (msg.status === 'unread') {
      updateMessageStatus(msg.id, 'read');
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingMessage(null);
  };

  const handleOpenReply = (msg) => {
    setViewingMessage(msg);
    setReplyText('');
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setViewingMessage(null);
    setReplyText('');
  };

  const handleSendReply = () => {
    if (replyText.trim() && viewingMessage) {
      updateMessageStatus(viewingMessage.id, 'replied');
      alert('Reply sent successfully!');
      handleCloseReplyModal();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread':
        return <Circle size={8} fill="var(--admin-primary)" color="var(--admin-primary)" />;
      case 'read':
        return <CheckCircle size={16} color="var(--admin-success)" />;
      case 'replied':
        return <CornerUpLeft size={16} color="var(--admin-text-muted)" />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h1>Messages</h1>
            <p>View and respond to customer inquiries</p>
          </div>
          {unreadMessages > 0 && (
            <span className="new-badge" style={{ marginTop: '-20px' }}>
              {unreadMessages} unread
            </span>
          )}
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
          </button>
        ))}
      </div>

      <div className="search-box">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Messages ({filteredMessages.length})</h3>
        </div>
        <div>
          {paginatedMessages.map(msg => (
            <div key={msg.id} className="message-item">
              <div className="message-indicator">
                {getStatusIcon(msg.status)}
              </div>
              <div className="message-content">
                <h4>{msg.sender}</h4>
                <p className="subject">{msg.subject}</p>
                <p className="preview">{msg.message}</p>
              </div>
              <div className="message-meta">
                <span className="message-date">{msg.date}</span>
                <div className="message-actions">
                  <button className="btn-icon" onClick={() => handleViewMessage(msg)} title="Read Message">
                    <Eye size={18} />
                  </button>
                  <button className="btn-icon reply" onClick={() => handleOpenReply(msg)} title="Reply">
                    <Send size={18} />
                  </button>
                  <button className="btn-icon danger" onClick={() => handleDelete(msg.id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View Message Modal */}
      <AModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Message Details"
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseViewModal}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => {
              handleCloseViewModal();
              handleOpenReply(viewingMessage);
            }}>
              <Send size={16} />
              Reply
            </button>
          </>
        }
      >
        {viewingMessage && (
          <div className="detail-view">
            <div className="message-detail-header">
              <span className={`status-badge ${viewingMessage.status}`}>
                {viewingMessage.status}
              </span>
            </div>

            <div className="detail-section">
              <div className="detail-row">
                <User size={18} />
                <div>
                  <span className="detail-label">From</span>
                  <p className="detail-value">{viewingMessage.sender}</p>
                </div>
              </div>
              <div className="detail-row">
                <Mail size={18} />
                <div>
                  <span className="detail-label">Subject</span>
                  <p className="detail-value">{viewingMessage.subject}</p>
                </div>
              </div>
              <div className="detail-row">
                <Calendar size={18} />
                <div>
                  <span className="detail-label">Date</span>
                  <p className="detail-value">{viewingMessage.date}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Message</h4>
              <div className="message-body">
                {viewingMessage.message}
              </div>
            </div>
          </div>
        )}
      </AModal>

      {/* Reply Modal */}
      <AModal
        isOpen={isReplyModalOpen}
        onClose={handleCloseReplyModal}
        title={`Reply to ${viewingMessage?.sender}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseReplyModal}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Send size={16} />
              Send Reply
            </button>
          </>
        }
      >
        {viewingMessage && (
          <div className="reply-form">
            <div className="reply-original">
              <h5>Original Message:</h5>
              <p className="original-subject">{viewingMessage.subject}</p>
              <p className="original-message">{viewingMessage.message}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Your Reply</label>
              <textarea
                className="form-textarea reply-textarea"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        )}
      </AModal>
    </div>
  );
}

export default Messages;
