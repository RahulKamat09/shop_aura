import { useEffect, useState } from 'react';
import { User, Store, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react';

function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetch("https://shop-aura.onrender.com/admin")
      .then(res => res.json())
      .then(data => {
        setAdmin({
          name: data.name,
          email: data.email,
          phone: data.phone
        });
      });
  }, []);

  const handleAdminSave = async () => {
    await fetch("https://shop-aura.onrender.com/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...admin
        // password untouched
      })
    });

    alert("Admin profile updated successfully");
  };

  const [settings, setSettings] = useState({
    storeName: 'ShopAura',
    storeAddress: '123 Store Street, City, Country',
    currency: 'USD',
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    sessionTimeout: '30'
  });


  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="settings-section">
            <h3>Admin Profile</h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={admin.name}
                onChange={(e) =>
                  setAdmin({ ...admin, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={admin.email}
                onChange={(e) =>
                  setAdmin({ ...admin, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={admin.phone}
                onChange={(e) =>
                  setAdmin({ ...admin, phone: e.target.value })
                }
              />
            </div>

            <button className="btn btn-primary" onClick={handleAdminSave}>
              Save Changes
            </button>
          </div>
        );

      case 'store':
        return (
          <>
            <div className="settings-section">
              <h3>Store Information</h3>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Store Address</label>
                <textarea
                  className="form-textarea"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </>
        );

      case 'notifications':
        return (
          <>
            <div className="settings-section">
              <h3>Email Notifications</h3>
              <div className="settings-row">
                <div className="settings-row-info">
                  <h4>Email Notifications</h4>
                  <p>Receive email updates about your store activity</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-row">
                <div className="settings-row-info">
                  <h4>Order Notifications</h4>
                  <p>Get notified when you receive new orders</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={() => handleToggle('orderNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-row">
                <div className="settings-row-info">
                  <h4>Marketing Emails</h4>
                  <p>Receive tips and promotions from eStore</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={() => handleToggle('marketingEmails')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </>
        );

      case 'security':
        return (
          <>
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="settings-row">
                <div className="settings-row-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle('twoFactorAuth')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Session Timeout (minutes)</label>
                <select
                  className="form-select"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </>
        );

      case 'billing':
        return (
          <div className="settings-section">
            <h3>Billing Information</h3>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '20px' }}>
              Manage your billing information and payment methods.
            </p>
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <CreditCard size={48} color="var(--admin-text-muted)" style={{ marginBottom: '16px' }} />
              <h4 style={{ marginBottom: '8px' }}>No payment methods added</h4>
              <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
                Add a payment method to manage your subscriptions
              </p>
              <button className="btn btn-primary">Add Payment Method</button>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="settings-section">
            <h3>Help & Support</h3>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '20px' }}>
              Get help with your store or contact our support team.
            </p>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '8px' }}>Documentation</h4>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                  Read our comprehensive guides and tutorials
                </p>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '8px' }}>Contact Support</h4>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                  Get in touch with our support team for assistance
                </p>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '8px' }}>FAQs</h4>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                  Find answers to commonly asked questions
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your store settings and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <nav className="settings-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings;