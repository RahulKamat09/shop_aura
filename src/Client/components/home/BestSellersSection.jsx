import api from "../../../api/api";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const BestSellersSection = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products", {
          params: {
            _sort: "rating",
            _order: "desc",
            _limit: 4
          }
        });
        setBestSellers(res.data);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);


  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading best sellers...</p>;
  }

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--background)" }}>
      <div className="container-custom">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
          </p>
        </div>

        <div className="grid-4">
          {bestSellers.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
