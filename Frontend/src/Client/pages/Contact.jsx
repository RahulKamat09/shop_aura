import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us. We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPin, title: 'Our Address', content: '123 Fashion Street, New York, NY 10001' },
    { icon: Phone, title: 'Phone Number', content: '+1 (234) 567-890' },
    { icon: Mail, title: 'Email Address', content: 'info@estore.com' },
    { icon: Clock, title: 'Working Hours', content: 'Mon - Fri: 9:00 AM - 6:00 PM' },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>Contact</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Get in <span style={{ color: 'var(--primary)' }}>Touch</span>
          </h1>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: '42rem', margin: '0 auto' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section style={{ padding: '2rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container-custom">
          <div className="grid-3">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-icon">
                  <info.icon size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{info.title}</h4>
                  <p style={{ color: 'var(--muted-foreground)' }}>{info.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  className="input-field" 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ height: '400px', backgroundColor: 'var(--secondary)' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
      </section>
    </Layout>
  );
};

export default Contact;
