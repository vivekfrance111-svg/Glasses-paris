import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar glass-panel">
            <div className="sidebar-header">
                <h3>Admin Panel</h3>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <i className="fas fa-th-large"></i> Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <i className="fas fa-box"></i> Products
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <i className="fas fa-shopping-cart"></i> Orders
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <i className="fas fa-users"></i> Users
                </NavLink>
                <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <i className="fas fa-star"></i> Reviews
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
