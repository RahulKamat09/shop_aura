import { Link } from 'react-router-dom';
import { categories } from '../../../data/products';

const CategoriesSection = () => {
  return (
    <section style={{ padding: '4rem 0', backgroundColor: 'var(--secondary)' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Browse our wide selection of categories to find exactly what you're looking for
          </p>
        </div>

        <div className="grid-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/category"
              className="category-card animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s`, aspectRatio: '1' }}
            >
              <img
                src={category.image}
                alt={category.name}
              />
              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.products} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
