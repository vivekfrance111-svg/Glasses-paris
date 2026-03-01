import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Skeleton from '../components/common/Skeleton';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState('');

    const { userInfo, updateProfile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
            fetchMyOrders();
        }
    }, [userInfo, navigate]);

    const fetchMyOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoadingUpdate(true);
        setMessage(null);
        setError('');

        try {
            await updateProfile({ name, email, password });
            setMessage('Profile Updated Successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-grid">
                <div className="profile-form-section glass-panel">
                    <h2>User Profile</h2>
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loadingUpdate}>
                            {loadingUpdate ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                <div className="profile-orders-section glass-panel">
                    <h2>My Orders</h2>
                    {loading ? (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map(i => (
                                        <tr key={i}>
                                            <td><Skeleton width="80px" height="16px" /></td>
                                            <td><Skeleton width="90px" height="16px" /></td>
                                            <td><Skeleton width="60px" height="16px" /></td>
                                            <td><Skeleton width="50px" height="24px" borderRadius="6px" /></td>
                                            <td><Skeleton width="40px" height="24px" borderRadius="6px" /></td>
                                            <td><Skeleton width="65px" height="30px" borderRadius="6px" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : orders.length === 0 ? (
                        <p>No orders found. <Link to="/products">Start shopping</Link></p>
                    ) : (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}...</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    <span className="badge-paid">Paid</span>
                                                ) : (
                                                    <span className="badge-unpaid">Pending</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelivered ? (
                                                    <span className="badge-delivered">Yes</span>
                                                ) : (
                                                    <span className="badge-pending">No</span>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/order/${order._id}`} className="btn-detail">
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
