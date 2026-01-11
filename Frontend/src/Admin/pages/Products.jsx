import api from '../../api/api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Package, Tag, DollarSign, FileText } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 5;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    gender: '',
    description: '',
    fullDescription: '',
    image: '',
    hoverImage: '',
    badge: '',
    rating: 5,
    reviews: 0,
    status: 'In Stock',
    inStock: true
  });


  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data.map(c => c.name));
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed To load data!!!');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const addProduct = async (product) => {
    try {
      await api.post("/products", product);
      toast.success("Product added successfully");

      // find category
      const categoryRes = await api.get(
        `/categories?name=${product.category}`
      );

      if (categoryRes.data.length) {
        const category = categoryRes.data[0];

        await api.patch(`/categories/${category.id}`, {
          products: (category.products || 0) + 1
        });
      }

      fetchInitialData();
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error('Failed to add product');
    }
  };



  const updateProduct = async (id, updatedProduct) => {
    try {
      await api.put(`/products/${id}`, updatedProduct);
      toast.success("Product updated successfully");
      fetchInitialData();
    } catch (error) {
      console.error('Failed to update product', error);
      toast.error('Failed to update product');
    }
  };



  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchInitialData(); // 🔥 refetch products
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product');
    }
  };


  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        gender: product.gender || '',
        description: product.description || '',
        fullDescription: product.fullDescription || '',
        image: product.image || '',
        hoverImage: product.hoverImage || '',
        badge: product.badge || '',
        rating: product.rating || 5,
        reviews: product.reviews || 0,
        status: product.status,
        inStock: product.inStock
      });

    } else {
      setEditingProduct(null);
      setFormData({
        id: '',
        name: '',
        price: '',
        category: '',
        gender: '',
        description: '',
        fullDescription: '',
        image: '',
        hoverImage: '',
        badge: '',
        rating: 5,
        reviews: 0,
        status: 'In Stock',
        inStock: true
      });

    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingProduct(null);
  };

  const handleSubmit = () => {
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      gender: formData.gender,
      description: formData.description,
      fullDescription: formData.fullDescription,
      image: formData.image,
      hoverImage: formData.hoverImage,
      badge: formData.badge,
      rating: Number(formData.rating),
      reviews: Number(formData.reviews),
      status: formData.inStock ? 'In Stock' : 'Out of Stock',
      inStock: formData.inStock
    };


    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    handleCloseModal();
  };


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };


  // 🔹 Loading state (add this just before return)
  if (loading) {
    return (
      <p style={{ padding: '2rem', textAlign: 'center' }}>
        Loading products...
      </p>
    );
  }


  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="search-box">
        <Search />
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">All Products ({filteredProducts.length})</h3>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${product.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" onClick={() => handleViewProduct(product)}>
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" onClick={() => handleOpenModal(product)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View Product Modal */}
      <AModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Product Details"
        footer={
          <button className="btn btn-secondary" onClick={handleCloseViewModal}>
            Close
          </button>
        }
      >
        {viewingProduct && (
          <div className="detail-view">
            <div className="detail-image-container">
              <img src={viewingProduct.image} alt={viewingProduct.name} className="detail-image" />
              {viewingProduct.hoverImage && (
                <img
                  src={viewingProduct.hoverImage}
                  alt="Hover Preview"
                  className="detail-image hover-preview"
                />
              )}
            </div>
            <div className="detail-info">
              <div className="detail-row">
                <Package size={18} />
                <div>
                  <span className="detail-label">Product Name</span>
                  <p className="detail-value">{viewingProduct.name}</p>
                </div>
              </div>
              <div className="detail-row">
                <Tag size={18} />
                <div>
                  <span className="detail-label">Category</span>
                  <p className="detail-value">{viewingProduct.category}</p>
                </div>
              </div>
              <div className="detail-row">
                <DollarSign size={18} />
                <div>
                  <span className="detail-label">Price</span>
                  <p className="detail-value">${viewingProduct.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="detail-row">
                <FileText size={18} />
                <div>
                  <span className="detail-label">Description</span>
                  <p className="detail-value">{viewingProduct.description || 'No description available'}</p>
                </div>
              </div>
              <div className="detail-row">
                <div>
                  <span className="detail-label">Product ID</span>
                  <p className="detail-value">#{viewingProduct.id}</p>
                </div>
              </div>
              {/* Full Description */}
              <div className="detail-row">
                <FileText size={18} />
                <div>
                  <span className="detail-label">Full Description</span>
                  <p className="detail-value">
                    {viewingProduct.fullDescription || 'No full description available'}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="detail-row">
                <Tag size={18} />
                <div>
                  <span className="detail-label">Gender</span>
                  <p className="detail-value">
                    {viewingProduct.gender || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="detail-row">
                <Tag size={18} />
                <div>
                  <span className="detail-label">Badge</span>
                  <p className="detail-value">
                    {viewingProduct.badge ? viewingProduct.badge.toUpperCase() : 'None'}
                  </p>
                </div>
              </div>
              <div className="detail-row">
                <div>
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${viewingProduct.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`} style={{ marginLeft: '8px' }}>
                    {viewingProduct.status}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </AModal>

      {/* Add/Edit Product Modal */}
      <AModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </>
        }
      >

        <div className="form-group">
          <label className="form-label">
            Product Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Price <span className="required">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select category</option>

              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Product description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Description</label>
          <textarea
            className="form-textarea"
            placeholder="Detailed product description"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Badge</label>
          <select
            className="form-select"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          >
            <option value="">None</option>
            <option value="new">New</option>
            <option value="sale">Sale</option>
            <option value="hot">Hot</option>
          </select>
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

        <div className="form-group">
          <label className="form-label">Hover Image URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://..."
            value={formData.hoverImage}
            onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.status === 'In Stock'}
            onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'In Stock' : 'Out of Stock' })}
          />
          <label htmlFor="inStock">In Stock</label>
        </div>

      </AModal>
    </div>
  );
}

export default Products;
