import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, login, loading, error } = useAuth();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            // Error handled in context
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <h1>Welcome Back</h1>
                <p className="subtitle">Sign in to continue your premium experience</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="form-footer">
                    New Customer? <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
