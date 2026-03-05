import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminUserListPage.css';

const AdminUserListPage = () => {
    const { userInfo } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successDelete, setSuccessDelete] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await API.get('/api/users', config);
                setUsers(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userInfo.token, successDelete]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await API.delete(`/api/users/${id}`, config);
                setSuccessDelete(!successDelete);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        }
    };

    const toggleAdminHandler = async (user) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await API.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
            setSuccessDelete(!successDelete); // Refresh
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <h1>User Management</h1>
                    <p>View and manage registered customers</p>
                </header>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : (
                    <div className="admin-table-container glass-panel">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ADMIN</th>
                                    <th>JOINED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="dim-text">{user._id.substring(0, 8)}...</td>
                                        <td>{user.name}</td>
                                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                        <td>
                                            {user.isAdmin ? (
                                                <i className="fas fa-check" style={{ color: '#10b981' }}></i>
                                            ) : (
                                                <i className="fas fa-times" style={{ color: '#ef4444' }}></i>
                                            )}
                                        </td>
                                        <td>{user.createdAt.substring(0, 10)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-text"
                                                onClick={() => toggleAdminHandler(user)}
                                                title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                                            >
                                                <i className={`fas ${user.isAdmin ? 'fa-user-minus' : 'fa-user-shield'}`}></i>
                                            </button>
                                            <button
                                                className="btn-text delete"
                                                onClick={() => deleteHandler(user._id)}
                                                disabled={user._id === userInfo._id}
                                                title="Delete User"
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

export default AdminUserListPage;
