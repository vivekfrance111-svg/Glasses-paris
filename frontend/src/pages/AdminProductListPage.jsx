import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminProductListPage.css';

const AdminProductListPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successDelete, setSuccessDelete] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/products', config);
                setProducts(data.products);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userInfo.token, successDelete]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                setSuccessDelete(!successDelete);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            setLoadingCreate(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            setLoadingCreate(false);
            navigate(`/admin/product/${data._id}/edit`);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoadingCreate(false);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header product-list-header">
                    <div>
                        <h1>Product Management</h1>
                        <p>Total Products: {products.length}</p>
                    </div>
                    <button className="btn btn-primary create-btn" onClick={createProductHandler} disabled={loadingCreate}>
                        {loadingCreate ? 'Creating...' : <><i className="fas fa-plus"></i> Create Product</>}
                    </button>
                </header>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : (
                    <div className="admin-table-container glass-panel">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>STOCK</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="dim-text">{product._id.substring(0, 8)}...</td>
                                        <td className="product-name-cell">
                                            <img src={product.image} alt={product.name} className="mini-thumb" />
                                            {product.name}
                                        </td>
                                        <td className="price-cell">${product.price}</td>
                                        <td>{product.category?.name || 'N/A'}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <span className={`stock-badge ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.countInStock}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-icon edit"
                                                onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                                title="Edit Product"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => deleteHandler(product._id)}
                                                title="Delete Product"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProductListPage;
