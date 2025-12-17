import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { wishlistItems } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (234) 567-890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  });

  const addresses = [
    {
      id: 1,
      type: 'Home',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      isDefault: false
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'Delivered',
      total: 259.99,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      status: 'In Transit',
      total: 149.50,
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'Processing',
      total: 89.99,
      items: 1
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>My Account</span>
          </nav>
        </div>
      </div>

      <section style={{ padding: '3rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* Sidebar */}
            <div style={{ backgroundColor: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={profile.avatar} 
                    alt={profile.firstName}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <button style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <h3 style={{ fontWeight: '600' }}>{profile.firstName} {profile.lastName}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{profile.email}</p>
                </div>
              </div>

              <div className="profile-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
                <button className="profile-tab" style={{ color: 'var(--destructive)' }}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ backgroundColor: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Personal Information</h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-grid form-grid-2">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="input-field" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input 
                          type="tel" 
                          className="input-field" 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Order History</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600' }}>{order.id}</span>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '9999px', 
                            fontSize: '0.75rem', 
                            fontWeight: '500',
                            backgroundColor: order.status === 'Delivered' ? 'var(--success)' : order.status === 'In Transit' ? 'var(--warning)' : 'var(--primary)',
                            color: 'white'
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                          <span>{order.date}</span>
                          <span>{order.items} items</span>
                          <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>My Wishlist ({wishlistItems.length})</h2>
                  {wishlistItems.length === 0 ? (
                    <p style={{ color: 'var(--muted-foreground)' }}>Your wishlist is empty.</p>
                  ) : (
                    <div className="grid-3">
                      {wishlistItems.map(item => (
                        <div key={item.id} style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }} />
                          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                          <p style={{ color: 'var(--primary)', fontWeight: '600' }}>${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Saved Addresses</h2>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {addresses.map(addr => (
                      <div key={addr.id} style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', border: addr.isDefault ? '2px solid var(--primary)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600' }}>{addr.type}</span>
                          {addr.isDefault && (
                            <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)', fontSize: '0.75rem' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                          {addr.address}, {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button className="btn-outline" style={{ marginTop: '1rem' }}>
                    Add New Address
                  </button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Account Settings</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: '500' }}>Email Notifications</h4>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Receive email updates about your orders</p>
                      </div>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: '500' }}>Newsletter</h4>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Get updates on new products and sales</p>
                      </div>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
                    </div>
                    <button className="btn-outline" style={{ color: 'var(--destructive)', borderColor: 'var(--destructive)' }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
