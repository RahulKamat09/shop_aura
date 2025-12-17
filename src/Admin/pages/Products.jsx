import { useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Package, Tag, DollarSign, FileText } from 'lucide-react';
import AModal from '../components/AModal';
import Pagination from '../components/Pagination';
import { products as initialProducts, categories as initialCategories } from '../../data/products';

const ITEMS_PER_PAGE = 5;

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    status: 'In Stock'
  });

  // CRUD Operations
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
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
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description || '',
        image: product.image,
        status: product.status
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        status: 'In Stock'
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
      description: formData.description,
      image: formData.image,
      status: formData.status
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

  const uniqueCategories = [...new Set(products.map(p => p.category))];

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
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${viewingProduct.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`} style={{ marginLeft: '8px' }}>
                    {viewingProduct.status}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div>
                  <span className="detail-label">Product ID</span>
                  <p className="detail-value">#{viewingProduct.id}</p>
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
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
