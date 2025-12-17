import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Award, value: '500+', label: 'Products' },
    { icon: Globe, value: '50+', label: 'Countries Served' },
    { icon: Heart, value: '99%', label: 'Satisfaction Rate' },
  ];

  const team = [
    { name: 'John Doe', role: 'CEO & Founder', image: 'https://bootstrapmade.com/content/demo/eStore/assets/img/team/team-1.jpg' },
    { name: 'Jane Smith', role: 'Creative Director', image: 'https://bootstrapmade.com/content/demo/eStore/assets/img/team/team-2.jpg' },
    { name: 'Mike Johnson', role: 'Marketing Head', image: 'https://bootstrapmade.com/content/demo/eStore/assets/img/team/team-3.jpg' },
    { name: 'Sarah Williams', role: 'Product Manager', image: 'https://bootstrapmade.com/content/demo/eStore/assets/img/team/team-4.jpg' },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>About Us</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <div className="hero-grid">
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                We're Passionate About <span style={{ color: 'var(--primary)' }}>Fashion</span>
              </h1>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
              </p>
              <Link to="/category" className="btn-primary">
                Shop Now
              </Link>
            </div>
            <div>
              <img
                src="https://plus.unsplash.com/premium_vector-1682303477571-3f31fc4c1ac4?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="About Us"
                style={{ borderRadius: 'var(--radius)', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="container-custom">
          <div className="grid-3">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon size={48} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The passionate people behind our success
            </p>
          </div>

          <div className="grid-3">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
