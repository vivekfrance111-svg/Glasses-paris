import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { cartCount, openCart } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/');
    };

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
                    <button className="icon-btn">🔍</button>
                    {userInfo ? (
                        <div className="user-dropdown">
                            <button className="icon-btn profile-btn">{userInfo.name.split(' ')[0]}</button>
                            <div className="dropdown-content glass">
                                {userInfo.isAdmin && (
                                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                                )}
                                <Link to="/profile">Profile</Link>
                                <button onClick={logoutHandler}>Logout</button>
                            </div>

                        </div>
                    ) : (
                        <Link to="/login" className="icon-btn">👤</Link>
                    )}
                    <button className="icon-btn cart-btn" onClick={openCart}>
                        🛒 <span className="cart-count">{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
