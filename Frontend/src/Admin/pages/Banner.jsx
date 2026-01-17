import { useEffect, useState } from 'react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import "../styles/banner.css"

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        page: 'home',
        category: '',
        active: true
    });

    /* ===============================
       FETCH BANNERS
    ================================ */
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await api.get('/banners');
            setBanners(res.data || []);
        } catch (err) {
            toast.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    /* ===============================
       ADD BANNER
    ================================ */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.image) {
            toast.error('Title and Image are required');
            return;
        }

        try {
            await api.post('/banners', formData);
            toast.success('Banner added successfully');
            fetchBanners();

            setFormData({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                page: 'home',
                category: '',
                active: true
            });
        } catch {
            toast.error('Failed to add banner');
        }
    };

    /* ===============================
       DELETE BANNER
    ================================ */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this banner?')) return;

        try {
            await api.delete(`/banners/${id}`);
            toast.success('Banner deleted');
            fetchBanners();
        } catch {
            toast.error('Delete failed');
        }
    };

    /* ===============================
       TOGGLE ACTIVE
    ================================ */
    const toggleActive = async (banner) => {
        try {
            await api.patch(`/banners/${banner.id}`, {
                active: !banner.active
            });
            fetchBanners();
        } catch {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="admin-page">
            <h2 className="admin-title">Banner Management</h2>

            {/* ===============================
          ADD BANNER FORM
      ================================ */}
            <form className="admin-card" onSubmit={handleSubmit}>
                <h3>Add New Banner</h3>

                <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Subtitle (e.g. UP TO 40% OFF)"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                />

                <select
                    value={formData.page}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            page: e.target.value,
                            category: e.target.value === 'category' ? formData.category : ''
                        })
                    }
                >
                    <option value="home">Home Page</option>
                    <option value="category">Category Page</option>
                </select>

                {formData.page === 'category' && (
                    <input
                        type="text"
                        placeholder="Category Name (e.g. Clothing)"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    />
                )}

                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Banner'}
                </button>
            </form>

            {/* ===============================
          BANNER LIST
      ================================ */}
            <div className="admin-card">
                <h3>All Banners</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : banners.length === 0 ? (
                    <p>No banners found</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Page</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.id}>
                                    <td>
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            style={{ width: 80, borderRadius: 6 }}
                                        />
                                    </td>
                                    <td>{banner.title}</td>
                                    <td>{banner.page}</td>
                                    <td>{banner.category || '-'}</td>
                                    <td>
                                        <button
                                            className={banner.active ? 'badge-active' : 'badge-inactive'}
                                            onClick={() => toggleActive(banner)}
                                        >
                                            {banner.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDelete(banner.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Banner;
