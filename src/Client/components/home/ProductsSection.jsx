import { useState } from 'react';
import { products } from '../../../data/products';
import ProductCard from '../ProductCard';

const tabs = ['All', 'Clothing', 'Accessories', 'Electronics'];

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredProducts = activeTab === 'All'
    ? products.slice(4)
    : products.filter(p => p.category === activeTab);

  return (
    <section style={{ padding: '4rem 0', backgroundColor: 'var(--secondary)' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title">Featured Products</h2>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid-4">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
