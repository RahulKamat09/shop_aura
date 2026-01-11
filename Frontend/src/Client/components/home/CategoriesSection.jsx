import api from "../../../api/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error('Failed to fetch categories!');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading categories...</p>;
  }

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--secondary)" }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Browse our wide selection of categories to find exactly what you're looking for
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/category"
              state={{ selectedCategory: category.name }}
              className="category-card animate-scale-in"
              style={{
                animationDelay: `${index * 0.05}s`,
                aspectRatio: "1"
              }}
            >
              <img src={category.image} alt={category.name} />

              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">
                  {category.products ?? 0} Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
