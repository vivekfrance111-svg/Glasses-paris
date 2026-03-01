import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminProductEditPage.css';

const AdminProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [frameStyle, setFrameStyle] = useState('');
    const [color, setColor] = useState('');

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [successUpdate, setSuccessUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const { data: categoriesData } = await axios.get('/api/categories');
                setCategories(categoriesData);

                // Fetch product
                const { data: productData } = await axios.get(`/api/products/${productId}`);
                if (productData) {
                    setName(productData.name);
                    setPrice(productData.price);
                    setImage(productData.image);
                    setBrand(productData.brand);
                    setCategory(productData.category._id || productData.category);
                    setCountInStock(productData.countInStock);
                    setDescription(productData.description);
                    setFrameStyle(productData.frameStyle || '');
                    setColor(productData.color || '');
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoadingUpdate(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/products/${productId}`,
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                    frameStyle,
                    color
                },
                config
            );

            setSuccessUpdate(true);
            setLoadingUpdate(false);
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoadingUpdate(false);
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
                    <h1>Edit Product</h1>
                </header>

                {loading ? (
                    <div className="loading">Loading product data...</div>
                ) : (
                    <div className="edit-form-container glass-panel">
                        {error && <div className="error-message">{error}</div>}
                        {successUpdate && <div className="success-message">Product updated successfully! Redirecting...</div>}

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
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        required
                                    />
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
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
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
                                    disabled={loadingUpdate}
                                >
                                    {loadingUpdate ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProductEditPage;
