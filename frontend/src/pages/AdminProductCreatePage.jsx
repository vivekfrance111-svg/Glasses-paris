import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import CustomSelect from '../components/common/CustomSelect';
import './AdminProductEditPage.css'; // Reuse the same styles

const AdminProductCreatePage = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(10);
    const [description, setDescription] = useState('');
    const [frameStyle, setFrameStyle] = useState('Classic');
    const [color, setColor] = useState('Black');
    const [isVisible, setIsVisible] = useState(true);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await API.get('/api/categories');
                setCategories(data);
                if (data.length > 0) {
                    setCategory(data[0]._id);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await API.post('/api/upload', formData, config);
            setImage(data.image);
            setUploading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!category) {
            setError('Please select a category');
            return;
        }

        try {
            setLoadingCreate(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await API.post(
                '/api/products',
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                    frameStyle,
                    color,
                    isVisible
                },
                config
            );

            setLoadingCreate(false);
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoadingCreate(false);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <Link to="/admin/products" className="back-link">
                        <i className="fas fa-arrow-left"></i> Back to Products
                    </Link>
                    <h1>Create New Product</h1>
                </header>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="edit-form-container glass-panel">
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={submitHandler} className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Image</label>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="file"
                                        id="image-file"
                                        onChange={uploadFileHandler}
                                        className="file-input"
                                        style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-primary)' }}
                                    />
                                    {uploading && <div className="loading" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Uploading...</div>}
                                </div>

                                <div className="form-group">
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        placeholder="Enter brand"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <CustomSelect
                                        value={category}
                                        options={categories.map(c => ({ value: c._id, label: c.name }))}
                                        onChange={setCategory}
                                        placeholder="Select Category"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Count In Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Enter stock"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Frame Style</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Wayfarer, Aviator"
                                        value={frameStyle}
                                        onChange={(e) => setFrameStyle(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Color</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Black, Gold"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>

                                <div className="form-group checkout-toggle">
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={isVisible}
                                            onChange={(e) => setIsVisible(e.target.checked)}
                                        />
                                        <span className="toggle-text">Visible on storefront</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    rows="5"
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary submit-btn"
                                    disabled={loadingCreate}
                                >
                                    {loadingCreate ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProductCreatePage;
