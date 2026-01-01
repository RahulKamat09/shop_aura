import api from "../../api/api";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/ProductCard";
import { Link, useLocation } from "react-router-dom";
import { Grid, List, House } from "lucide-react";

// const categoryIcons = {
//   Electronics: Laptop,
//   Fashion: Shirt,
//   Accessories: Watch,
//   Footwear: Footprints,
//   Clothing: ShoppingBag,
//   Sports: Medal,
//   Students: School,
//   Default: House
// };

const ITEMS_PER_PAGE = 8;

const Category = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [gender, setGender] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);

  const priceRange = { min: 0, max: 500 };

  /* ---------------- READ CATEGORY FROM LINK STATE ---------------- */
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      setShowCategories(false);
    }
  }, [location.state]);

  /* ---------------- RESET PAGE ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories([{ name: "All" }, ...res.data]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);


  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    if (showCategories) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {};
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (gender) {
          params.gender = [gender, "All"];
        }
        // if gender is null → no gender param → fetch all

        const res = await api.get("/products", { params });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, gender, showCategories]);



  /* ---------------- FILTER + SORT ---------------- */
  const filteredProducts = products.filter(p => {
    const genderMatch =
      !gender ||                 // user did NOT select gender
      !p.gender ||               // product has no gender
      p.gender === "All" ||      // unisex product
      p.gender === gender;       // men / women match

    return (
      genderMatch &&
      p.price >= priceRange.min &&
      p.price <= priceRange.max
    );
  });


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "var(--secondary)", padding: "1rem 0" }}>
        <div className="container-custom">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {showCategories ? (
              <span>Shop</span>
            ) : (
              <>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowCategories(true);
                    setSelectedCategory("All");
                    setProducts([]);
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

      <div className="container-custom" style={{ padding: "2rem 0" }}>

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

        {/* Category According to gender */}
        {!showCategories && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem"
            }}
          >
            {["Men", "Women"].map(item => (
              <button
                key={item}
                onClick={() =>
                  setGender(prev => (prev === item ? null : item))
                }
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "999px",
                  border: "1px solid var(--border)",
                  backgroundColor: gender === item ? "var(--primary)" : "transparent",
                  color: gender === item ? "#fff" : "inherit",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* ================= CATEGORY CARDS ================= */}
        {showCategories && (
          <>
            <h2 style={{ marginBottom: "1.5rem" }}>Browse Categories</h2>

            <div className="grid-4">
              {categories.map((cat, index) => (
                <div
                  key={cat.name}
                  className="category-item animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setShowCategories(false);
                  }}
                >
                  {/* BADGES */}
                  {cat.name === "Electronics" && (
                    <span className="category-tag">Popular</span>
                  )}

                  {cat.name === "Fashion" && (
                    <span
                      className="category-tag"
                      style={{ background: "#22c55e" }}
                    >
                      New
                    </span>
                  )}

                  {/* CATEGORY IMAGE */}
                  <div className="category-image-wrapper">
                    {cat.name === "All" ? (
                      <div className="category-all-icon">
                        <House size={36} />
                      </div>
                    ) : (
                      <img
                        src={cat.image || "/placeholder-category.jpg"}
                        alt={cat.name}
                        className="category-image"
                      />
                    )}
                  </div>

                  {/* CATEGORY LABEL */}
                  <span className="category-label">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}


        {/* ================= PRODUCTS VIEW ================= */}
        {!showCategories && (
          <>
            {/* Back Button */}
            <button
              onClick={() => {
                setShowCategories(true);
                setSelectedCategory("All");
                setProducts([]);
              }}
              style={{
                marginBottom: "1.5rem",
                padding: "0.6rem 1.2rem",
                borderRadius: "var(--radius)",
                backgroundColor: "var(--primary)",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              ← Back to Categories
            </button>

            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                backgroundColor: "var(--secondary)",
                borderRadius: "var(--radius)"
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem" }}>
                  Showing {sortedProducts.length} results
                </span>

                <button
                  onClick={() => setViewMode("grid")}
                  className="btn-icon"
                  style={{
                    backgroundColor:
                      viewMode === "grid" ? "var(--primary)" : "transparent",
                    color: viewMode === "grid" ? "#fff" : "inherit"
                  }}
                >
                  <Grid size={18} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className="btn-icon"
                  style={{
                    backgroundColor:
                      viewMode === "list" ? "var(--primary)" : "transparent",
                    color: viewMode === "list" ? "#fff" : "inherit"
                  }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <p style={{ textAlign: "center" }}>Loading products...</p>
            ) : (
              <>
                <div className={viewMode === "grid" ? "grid-4" : "grid-2"}>
                  {paginatedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

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
                        className={currentPage === i + 1 ? "active" : ""}
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

                {sortedProducts.length === 0 && (
                  <p style={{ textAlign: "center", marginTop: "3rem" }}>
                    No products found in this category.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Category;
