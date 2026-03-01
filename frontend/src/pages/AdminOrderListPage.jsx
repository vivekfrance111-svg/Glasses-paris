import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminOrderListPage.css';

const AdminOrderListPage = () => {
    const { userInfo } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateLoading, setUpdateLoading] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userInfo.token]);

    const updateStatusHandler = async (id, status) => {
        try {
            setUpdateLoading(id);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`/api/orders/${id}/status`, { status }, config);
            fetchOrders();
            setUpdateLoading(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setUpdateLoading(null);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Order Management</h1>
                    <p>Manage and process customer orders</p>
                </header>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading orders...</div>
                ) : (
                    <div className="admin-table-container glass-panel">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="dim-text">{order._id.substring(0, 8)}...</td>
                                        <td>{order.user ? order.user.name : 'Deleted User'}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td className="price-cell">${order.totalPrice.toFixed(2)}</td>
                                        <td>
                                            {order.isPaid ? (
                                                <span className="badge badge-success">{order.paidAt.substring(0, 10)}</span>
                                            ) : (
                                                <span className="badge badge-danger">Not Paid</span>
                                            )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span className="badge badge-success">{order.deliveredAt.substring(0, 10)}</span>
                                            ) : (
                                                <span className="badge badge-danger">No</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-tag ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {order.status === 'Processing' && (
                                                <button
                                                    className="btn-text"
                                                    disabled={updateLoading === order._id}
                                                    onClick={() => updateStatusHandler(order._id, 'Dispatched')}
                                                >
                                                    {updateLoading === order._id ? '...' : 'Mark Dispatched'}
                                                </button>
                                            )}
                                            {order.status === 'Dispatched' && (
                                                <button
                                                    className="btn-text"
                                                    disabled={updateLoading === order._id}
                                                    onClick={() => updateStatusHandler(order._id, 'Delivered')}
                                                >
                                                    {updateLoading === order._id ? '...' : 'Mark Delivered'}
                                                </button>
                                            )}
                                            {order.status === 'Delivered' && (
                                                <span className="dim-text">Completed</span>
                                            )}
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

export default AdminOrderListPage;
