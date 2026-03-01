import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { cartCount, openCart } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const dropdownRef = useRef(null);

    const logoutHandler = () => {
        setDropdownOpen(false);
        setMobileNavOpen(false);
        logout();
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const toggleMobileNav = () => {
        setMobileNavOpen(prev => !prev);
    };

    // Close mobile nav on route change
    useEffect(() => {
        setMobileNavOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

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

    // Prevent body scroll when mobile nav is open
    useEffect(() => {
        if (mobileNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileNavOpen]);

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
                        <div className="auth-links desktop-auth">
                            <Link to="/login" className="login-link-btn">Login</Link>
                            <Link to="/register" className="register-link-btn">Register</Link>
                        </div>
                    )}
                    <button className="icon-btn cart-btn" onClick={openCart}>
                        <FiShoppingCart />
                        <span className="cart-count">{cartCount}</span>
                    </button>
                    <button className="hamburger-btn" onClick={toggleMobileNav} aria-label="Toggle menu">
                        {mobileNavOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`} onClick={() => setMobileNavOpen(false)}></div>
            <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
                <div className="mobile-nav-header">
                    <h2>Menu</h2>
                    <button className="icon-btn" onClick={() => setMobileNavOpen(false)}>
                        <FiX />
                    </button>
                </div>
                <nav className="mobile-nav-links">
                    <Link to="/products">Collections</Link>
                    <Link to="/products?category=men">Men</Link>
                    <Link to="/products?category=women">Women</Link>
                    <Link to="/about">About</Link>
                </nav>
                <div className="mobile-nav-divider"></div>
                {userInfo ? (
                    <div className="mobile-nav-user">
                        <Link to="/profile">My Profile</Link>
                        {userInfo.isAdmin && (
                            <Link to="/admin/dashboard">Admin Dashboard</Link>
                        )}
                        <button onClick={logoutHandler} className="mobile-logout-btn">Logout</button>
                    </div>
                ) : (
                    <div className="mobile-nav-auth">
                        <Link to="/login" className="btn-secondary mobile-auth-btn">Login</Link>
                        <Link to="/register" className="btn-primary mobile-auth-btn">Register</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
