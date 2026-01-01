import api from "../../api/api";
import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';
import "../styles/admin.css"

const ITEMS_PER_PAGE = 4;

function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: ''
  });

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };



  // CRUD Operations
  const addCategory = async (category) => {
    try {
      setLoading(true);
      await api.post("/categories", category);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to add category", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      setLoading(true);
      await api.put(`/categories/${id}`, { ...updatedCategory, id });
      await fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setLoading(false);
    }
  };


  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    const categoryData = {
      name: formData.name,
      slug: formData.slug || `/${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
      image: formData.image,
      products: editingCategory?.products ?? 0
    };


    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }


    handleCloseModal();
  };

  const handleDelete = async (category) => {
    try {
      const relatedProducts = products.filter(
        p => p.category === category.name
      );

      const count = relatedProducts.length;

      const message =
        count > 0
          ? `This category has ${count} products.\n\nIf you delete this category, ALL related products will also be deleted.\n\nDo you want to continue?`
          : "Are you sure you want to delete this category?";

      if (!window.confirm(message)) return;

      setLoading(true);

      // delete products first
      if (count > 0) {
        await Promise.all(
          relatedProducts.map(p =>
            api.delete(`/products/${p.id}`)
          )
        );
      }

      // delete category
      await api.delete(`/categories/${category.id}`);

      // refresh data
      await fetchCategories();
      const productsRes = await api.get("/products");
      setProducts(productsRes.data);

    } catch (error) {
      console.error("Failed to delete category with products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>
        Loading categories...
      </p>
    );
  }


  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize your products into categories</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="search-box">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="categories-grid">
        {paginatedCategories.map(category => (
          <div key={category.id} className="categories-card">
            <div className="category-image">
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <p>{getProductCount(category.name)} products</p>
              </div>
            </div>
            <div className="category-footer">
              <span className="category-slug">{category.slug}</span>
              <div className="actions-cell">
                <button className="btn-icon" onClick={() => handleOpenModal(category)}>
                  <Edit2 size={18} />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(category)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
            </button>

          </>
        }
      >
        <div className="form-group">
          <label className="form-label">
            Category Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input
            type="text"
            className="form-input"
            placeholder="/category-name"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>
      </AModal>
    </div>
  );
}

export default Categories;
