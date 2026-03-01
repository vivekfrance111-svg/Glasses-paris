import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { cartCount, openCart } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const logoutHandler = () => {
        setDropdownOpen(false);
        logout();
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="header glass-panel">
            <div className="container header-content">
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <h1>LUMINA<span>OPTICS</span></h1>
                    </div>
                </Link>
                <nav className="nav">
                    <ul className="nav-links">
                        <li><Link to="/products">Collections</Link></li>
                        <li><Link to="/products?category=men">Men</Link></li>
                        <li><Link to="/products?category=women">Women</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </nav>
                <div className="header-actions">
                    <button className="icon-btn search-btn" onClick={() => alert('Feature coming soon!')}>
                        <FiSearch />
                    </button>
                    {userInfo ? (
                        <div className="user-dropdown" ref={dropdownRef}>
                            <button className="icon-btn profile-btn" onClick={toggleDropdown}>
                                {userInfo.name.split(' ')[0]}
                                <FiChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                            </button>
                            <div className={`dropdown-content glass ${dropdownOpen ? 'show' : ''}`}>
                                {userInfo.isAdmin && (
                                    <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                                )}
                                <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                <button onClick={logoutHandler}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="login-link-btn">Login</Link>
                            <Link to="/register" className="register-link-btn">Register</Link>
                        </div>
                    )}
                    <button className="icon-btn cart-btn" onClick={openCart}>
                        <FiShoppingCart />
                        <span className="cart-count">{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
