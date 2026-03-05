import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        paidOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await API.get('/api/orders/stats', config);
                setStats(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userInfo.token]);


    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Overview Dashboard</h1>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </header>

                {loading ? (
                    <div className="loading">Loading stats...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card glass-panel">
                            <div className="stat-icon revenue">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Total Revenue</h3>
                                <p className="stat-value">${stats.totalRevenue}</p>
                            </div>
                        </div>

                        <div className="stat-card glass-panel">
                            <div className="stat-icon orders">
                                <i className="fas fa-shopping-bag"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Total Orders</h3>
                                <p className="stat-value">{stats.totalOrders}</p>
                            </div>
                        </div>

                        <div className="stat-card glass-panel">
                            <div className="stat-icon paid">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Paid Orders</h3>
                                <p className="stat-value">{stats.paidOrders}</p>
                            </div>
                        </div>

                        <div className="stat-card glass-panel">
                            <div className="stat-icon pending">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-info">
                                <h3>Pending Orders</h3>
                                <p className="stat-value">{stats.pendingOrders}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="admin-content-sections">
                    <section className="recent-activity glass-panel">
                        <h2>System Overview</h2>
                        <div className="overview-list">
                            <div className="overview-item">
                                <span className="label">Store Status:</span>
                                <span className="value status-online">Online</span>
                            </div>
                            <div className="overview-item">
                                <span className="label">Database Connection:</span>
                                <span className="value status-online">Connected</span>
                            </div>
                            <div className="overview-item">
                                <span className="label">API Health:</span>
                                <span className="value status-online">Good</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
