import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/ProductCard";
import { Link, useLocation } from "react-router-dom";
import { Grid, List, House, Laptop, Shirt, Watch, Footprints, ShoppingBag, Medal, School } from "lucide-react";

const categoryIcons = {
  Electronics: Laptop,
  Fashion: Shirt,
  Accessories: Watch,
  Footwear: Footprints,
  Clothing: ShoppingBag,
  Sports: Medal,
  Students: School,
  Default: House
};

const ITEMS_PER_PAGE = 8;

const Category = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [gender, setGender] = useState("Men");

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
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(["All", ...data.map(cat => cat.name)]);
      })
      .catch(err => console.error(err));
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    if (showCategories) return;

    let url = "http://localhost:5000/products?";

    if (selectedCategory !== "All") {
      url += `category=${selectedCategory}&`;
    }

    if (gender) {
      url += `gender=${gender}`;
    }

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [selectedCategory, gender, showCategories]);


  /* ---------------- FILTER + SORT ---------------- */
  const filteredProducts = products.filter(p => {
    return (
      p.gender === gender &&
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
        {showCategories && (
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
                onClick={() => setGender(item)}
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
              {categories.map((cat, index) => {
                const Icon = categoryIcons[cat] || categoryIcons.Default;

                return (
                  <div
                    key={cat}
                    className="category-item animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategories(false);
                    }}
                  >
                    {/* BADGE */}
                    {cat === "Electronics" && (
                      <span className="category-tag">Popular</span>
                    )}

                    {cat === "Fashion" && (
                      <span className="category-tag" style={{ background: "#22c55e" }}>
                        New
                      </span>
                    )}
                    {/* ICON */}
                    <div className="category-icon">
                      <Icon size={30} />
                    </div>

                    {/* CATEGORY LABEL */}
                    <span className="category-label">{cat}</span>
                  </div>
                );
              })}
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
