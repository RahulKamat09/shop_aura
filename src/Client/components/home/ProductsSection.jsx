import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const tabs = ["All", "Clothing", "Accessories", "Electronics"];

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "http://localhost:5000/products";

    // Filter by category when tab is not "All"
    if (activeTab !== "All") {
      url += `?category=${activeTab}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Optional: skip first 4 if you want same behavior as before
        setProducts(activeTab === "All" ? data.slice(4) : data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [activeTab]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading products...</p>;
  }

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--secondary)" }}>
      <div className="container-custom">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title">Featured Products</h2>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
