import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import './LoginPage.css';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await API.get(`/api/users/verify-email/${token}`);
                setSuccess(true);
                setLoading(false);
            } catch (err) {
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Verification failed. The link may be invalid or expired.'
                );
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="login-container">
            <div className="login-card glass" style={{ textAlign: 'center' }}>
                {loading ? (
                    <div className="verifying">
                        <FiLoader className="spinner" size={60} style={{ marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
                        <h1>Verifying your email...</h1>
                    </div>
                ) : success ? (
                    <div className="success">
                        <FiCheckCircle size={60} color="#4caf50" style={{ marginBottom: '1rem' }} />
                        <h1 style={{ color: '#4caf50' }}>Verification Successful!</h1>
                        <p className="subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '1rem 0 2rem' }}>
                            Your email has been verified. You can now log in to your account and explore our luxury collection.
                        </p>
                        <Link to="/login" className="login-button" style={{ display: 'block', textDecoration: 'none' }}>
                            Sign In Now
                        </Link>
                    </div>
                ) : (
                    <div className="error">
                        <FiXCircle size={60} color="#ff5252" style={{ marginBottom: '1rem' }} />
                        <h1 style={{ color: '#ff5252' }}>Verification Failed</h1>
                        <div className="error-message" style={{ margin: '1.5rem 0' }}>{error}</div>
                        <p className="subtitle" style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem' }}>
                            Please try registering again or contact our support team.
                        </p>
                        <Link to="/register" className="login-button" style={{ display: 'block', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                            Back to Register
                        </Link>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            ` }} />
        </div>
    );
};

export default VerifyEmailPage;
