import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Users, Award, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Award, value: '500+', label: 'Products' },
    { icon: Globe, value: '50+', label: 'Countries Served' },
    { icon: Heart, value: '99%', label: 'Satisfaction Rate' },
  ];

  const team = [
    { name: 'John Doe', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVhbSUyMG1lbWJlcnN8ZW58MHx8MHx8fDA%3D' },
    { name: 'Jane Smith', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbSUyMG1lbWJlcnN8ZW58MHx8MHx8fDA%3D' },
    { name: 'Mike Johnson', role: 'Marketing Head', image: 'https://media.istockphoto.com/id/1294434046/photo/grow-your-confidence-grow-your-success.webp?a=1&s=612x612&w=0&k=20&c=znjEeieumaEEujvnwgHU-0GXszfXpXoarU6c7RCcViE=' },
    { name: 'Sarah Williams', role: 'Product Manager', image: 'https://media.istockphoto.com/id/1390330373/photo/young-business-woman-with-crossed-arms-outdoor-portrait.webp?a=1&s=612x612&w=0&k=20&c=eDVVOJpJOBZsmFrlsZbWvDa_fF6UCOP56UzqgThDYR4=' },
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

      {/* Mission / Vision */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="containered-custom">
          <div className="griid-3">
            <div className="info-card">
              <h3>🎯 Our Mission</h3>
              <p>
                Our mission is to deliver high-quality fashion that blends comfort,
                affordability, and modern design while empowering customers to express
                their individuality.
              </p>
            </div>

            <div className="info-card">
              <h3>🚀 Our Vision</h3>
              <p>
                To become a globally trusted fashion brand known for innovation,
                sustainability, and customer-first experiences across digital platforms.
              </p>
            </div>

            <div className="info-card">
              <h3>💎 Our Values</h3>
              <p>
                Integrity, creativity, inclusivity, and continuous improvement guide
                every decision we make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="containered-custom">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              What makes us different from others
            </p>
          </div>

          <div className="griid-3">
            <div className="featured-card">
              <h4>Premium Quality</h4>
              <p>
                Every product goes through strict quality checks to ensure durability
                and comfort.
              </p>
            </div>

            <div className="featured-card">
              <h4>Fast & Secure Delivery</h4>
              <p>
                We deliver across multiple countries with real-time tracking and secure
                packaging.
              </p>
            </div>

            <div className="featured-card">
              <h4>Customer-Centric Support</h4>
              <p>
                Our support team is always ready to assist you before and after your
                purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--secondary)' }}>
        <div className="containered-custom">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Our Journey
          </h2>

          <div className="timeline">
            <div className="timeline-item">
              <span>2019</span>
              <p>Brand founded with a small passionate team.</p>
            </div>

            <div className="timeline-item">
              <span>2021</span>
              <p>Expanded product range and crossed 5K customers.</p>
            </div>

            <div className="timeline-item">
              <span>2023</span>
              <p>Started global shipping and sustainable fashion initiatives.</p>
            </div>

            <div className="timeline-item">
              <span>2025</span>
              <p>Serving customers in 50+ countries with 99% satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="containered-custom">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Real feedback from real people
            </p>
          </div>

          <div className="griid-3">
            <div className="testimonial-card">
              <p>
                “Amazing quality and super fast delivery. I absolutely love the designs!”
              </p>
              <h4>— Aditi Sharma</h4>
            </div>

            <div className="testimonial-card">
              <p>
                “Customer support is top-notch. They helped me instantly with my issue.”
              </p>
              <h4>— Rahul Mehta</h4>
            </div>

            <div className="testimonial-card">
              <p>
                “Best online shopping experience I’ve had in a long time.”
              </p>
              <h4>— Neha Verma</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--primary)', color: '#fff' }}>
        <div className="containered-custom" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Ready to Upgrade Your Style?
          </h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            Discover our latest collections crafted just for you.
          </p>
          <Link to="/category" className="btn-light">
            Explore Collections
          </Link>
        </div>
      </section>

    </Layout>
  );
};

export default About;
