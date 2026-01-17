import api from "../../../api/api";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import toast from "react-hot-toast";
import ProductCardSkeleton from "../Skeletons/ProductCardSkeleton";

const tabs = ["All", "Clothing", "Accessories", "Electronics"];

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {};
        if (activeTab !== "All") {
          params.category = activeTab;
        }

        const res = await api.get("/products", { params });

        // Show only 12 products
        setProducts(res.data.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error('Failed to fetch products!')
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);


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
          {loading
            ? [...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
            : products.map((product, index) => (
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
