import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminReviewListPage.css';

const AdminReviewListPage = () => {
    const { userInfo } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successDelete, setSuccessDelete] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await API.get('/api/reviews', config);
                setReviews(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userInfo.token, successDelete]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await API.delete(`/api/reviews/${id}`, config);
                setSuccessDelete(!successDelete);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Review Moderation</h1>
                    <p>Manage customer feedback and ratings</p>
                </header>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading reviews...</div>
                ) : (
                    <div className="admin-table-container glass-panel">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>PRODUCT</th>
                                    <th>USER</th>
                                    <th>RATING</th>
                                    <th>COMMENT</th>
                                    <th>DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review._id}>
                                        <td className="dim-text">{review._id.substring(0, 8)}...</td>
                                        <td className="product-name">{review.product?.name || 'Deleted Product'}</td>
                                        <td>{review.name || review.user?.name}</td>
                                        <td>
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`fa-star ${i < review.rating ? 'fas' : 'far'}`}></i>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="comment-cell">{review.comment}</td>
                                        <td>{review.createdAt.substring(0, 10)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-text delete"
                                                onClick={() => deleteHandler(review._id)}
                                                title="Delete Review"
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

export default AdminReviewListPage;
