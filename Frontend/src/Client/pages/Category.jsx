import api from '../../api/api';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ProductCard';
import { Link, useLocation } from 'react-router-dom';
import { Grid, List, House, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

/* ===============================
   CONSTANTS
================================ */
const ITEMS_PER_PAGE = 9;

const Category = () => {
  const location = useLocation();

  /* ===============================
     UI STATES
  ================================ */
  const [viewMode, setViewMode] = useState('grid');       // grid / list view
  const [sortBy, setSortBy] = useState('default');       // sorting option
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategories, setShowCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [gender, setGender] = useState(null);            // Men / Women / null
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ===============================
     DATA STATES
  ================================ */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===============================
     FETCH CATEGORIES
     (Runs once on page load)
  ================================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch categories');
        toast.error('Failed to fetch categories!')
      }
    };

    fetchCategories();
  }, []);

  /* ===============================
     FETCH PRODUCTS
     (Runs once on page load)
  ================================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products');
        toast.error('Failed to fetch products!!')
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ===============================
     READ CATEGORY FROM LINK STATE
     (When user comes from Home page)
  ================================ */
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      setShowCategories(false);
    }
  }, [location.state]);

  /* ===============================
     RESET PAGINATION
     (When filters change)
  ================================ */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, gender]);

  /* ===============================
     FILTER PRODUCTS
  ================================ */
  const filteredProducts = products.filter(product => {
    const categoryMatch =
      selectedCategory === 'All' || product.category === selectedCategory;

    const genderMatch =
      !gender ||                     // no gender selected
      !product.gender ||             // product has no gender
      product.gender === 'All' ||    // unisex product
      product.gender === gender;

    return categoryMatch && genderMatch;
  });

  /* ===============================
     SORT PRODUCTS
  ================================ */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  /* ===============================
     PAGINATION LOGIC
  ================================ */
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ===============================
     CATEGORY LIST (ADD "ALL")
  ================================ */
  const allCategories = [
    { id: 0, name: 'All', image: '' },
    ...categories
  ];

  /* ===============================
     FILTER SIDEBAR COMPONENT
  ================================ */
  const FilterSidebar = () => (
    <div className="filter-sidebar">

      {/* SORT */}
      <div className="filter-section">
        <h3 className="filter-title">Sort By</h3>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input-field"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* GENDER */}
      <div className="filter-section">
        <h3 className="filter-title">Gender</h3>
        {['All', 'Men', 'Women'].map(item => (
          <label key={item} className="filter-option">
            <input
              type="radio"
              name="gender"
              checked={item === 'All' ? gender === null : gender === item}
              onChange={() => setGender(item === 'All' ? null : item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      {/* CATEGORY */}
      <div className="filter-section">
        <h3 className="filter-title">Categories</h3>
        {allCategories.map(cat => (
          <label key={cat.id} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === cat.name}
              onChange={() => {
                setSelectedCategory(cat.name);
                setShowCategories(false);
              }}
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>

      {/* CLEAR */}
      <button
        className="btn-outline"
        onClick={() => {
          setGender(null);
          setSortBy('default');
          setSelectedCategory('All');
          setShowCategories(true);
        }}
      >
        Clear All Filters
      </button>
    </div>
  );

  /* ===============================
     ERROR STATE
  ================================ */
  if (error) {
    return (
      <Layout>
        <div className="container-custom" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Error loading data</h2>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  /* ===============================
     MAIN RENDER
  ================================ */
  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem 0' }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {showCategories ? (
              <span>Shop</span>
            ) : (
              <>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowCategories(true);
                    setSelectedCategory('All');
                  }}
                >
                  Shop
                </span>
                <span>/</span>
                <span>{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container-custom" style={{ padding: '2rem 0' }}>
        <p className="category-intro">
          Explore our curated collection of products across multiple categories.
          Each category is carefully selected to offer quality, value, and modern design
          tailored to your everyday needs.
        </p>

        <div className="category-badges">
          <span className="category-badge">✔ Verified Products</span>
          <span className="category-badge">🚚 Fast Delivery</span>
          <span className="category-badge">🔒 Secure Payments</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p>Loading products...</p>
          </div>
        )}

        {/* Category Cards - Initial View */}
        {!loading && showCategories && (
          <>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Browse Categories</h2>

            <div className="grid-4 productExtra">
              {allCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="category-item animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setShowCategories(false);
                  }}
                >
                  {cat.name === 'Electronics' && (
                    <span className="category-tag">Popular</span>
                  )}
                  {cat.name === 'Fashion' && (
                    <span className="category-tag" style={{ background: '#22c55e' }}>
                      New
                    </span>
                  )}

                  <div className="category-image-wrapper">
                    {cat.name === 'All' ? (
                      <div className="category-all-icon">
                        <House size={36} />
                      </div>
                    ) : (
                      <img
                        src={cat.image || '/placeholder.svg'}
                        alt={cat.name}
                        className="category-image"
                      />
                    )}
                  </div>

                  <span className="category-label">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Products View with Sidebar */}
        {!loading && !showCategories && (
          <>
            {/* Mobile Filter Button */}
            <div className="filterExtra">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="btn-primary mobile-filter-btn"
              >
                <Filter size={18} />
                <span style={{ marginLeft: '0.5rem' }}>Filters</span>
              </button>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 100,
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}
                onClick={() => setShowMobileFilters(false)}
              >
                <div
                  style={{
                    width: '300px',
                    maxWidth: '85vw',
                    height: '100%',
                    backgroundColor: 'var(--background)',
                    padding: '1rem',
                    overflowY: 'auto'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 600 }}>Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <X size={24} />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            )}

            <div className="category-layout">
              {/* Desktop Sidebar */}
              <div className="hidden-mobile">
                <FilterSidebar />
              </div>

              {/* Products Section */}
              <div>
                {/* Toolbar */}
                <div className="products-toolbar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => {
                        setShowCategories(true);
                        setSelectedCategory('All');
                      }}
                      className="btn-outline"
                    >
                      ← Back
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                      Showing {sortedProducts.length} results
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className="btn-icon"
                      style={{
                        backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'grid' ? '#fff' : 'inherit'
                      }}
                    >
                      <Grid size={18} />
                    </button>

                    <button
                      onClick={() => setViewMode('list')}
                      className="btn-icon"
                      style={{
                        backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'list' ? '#fff' : 'inherit'
                      }}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>

                {/* Active Filters */}
                {(gender || selectedCategory !== 'All') && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {selectedCategory !== 'All' && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          borderRadius: '999px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('All')}>
                          <X size={14} />
                        </button>
                      </span>
                    )}
                    {gender && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          borderRadius: '999px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {gender}
                        <button onClick={() => setGender(null)}>
                          <X size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Products */}
                <div className={viewMode === 'grid' ? 'products-grid-3' : 'grid-2'}>
                  {paginatedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in productExtra"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* No Products Message */}
                {sortedProducts.length === 0 && (
                  <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--muted-foreground)' }}>
                    No products found matching your criteria.
                  </p>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={currentPage === i + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Category;

