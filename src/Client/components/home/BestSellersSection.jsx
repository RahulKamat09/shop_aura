import { products } from '../../../data/products';
import ProductCard from '../ProductCard';

const BestSellersSection = () => {
  const bestSellers = products.slice(0, 4);

  return (
    <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
          </p>
        </div>

        <div className="grid-4">
          {bestSellers.map((product, index) => (
            <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
