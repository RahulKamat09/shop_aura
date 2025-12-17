import { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ProductCard';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import { Grid, List, ChevronDown } from 'lucide-react';

const Category = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });

  const categories = ['All', 'Clothing', 'Accessories', 'Electronics'];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
            <span>Shop</span>
          </nav>
        </div>
      </div>

      <div className="container-custom" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div className="filter-sidebar" style={{ display: 'none' }}>
            {/* Hidden on mobile, would show on desktop */}
          </div>

          {/* Main Content */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Categories */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                  Showing {sortedProducts.length} results
                </span>
                <button 
                  onClick={() => setViewMode('grid')}
                  className="btn-icon"
                  style={{ backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'inherit' }}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className="btn-icon"
                  style={{ backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'inherit' }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? 'grid-4' : 'grid-2'}>
              {sortedProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Category;
