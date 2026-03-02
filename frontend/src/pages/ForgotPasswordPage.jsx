import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await axios.post('/api/users/forgot-password', { email });

            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-pw-container">
            <div className="forgot-pw-card glass">
                <div className="icon-wrapper">
                    <FiMail />
                </div>
                <h1>Forgot Password?</h1>
                <p className="subtitle">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && <div className="error-message">{error}</div>}

                {success ? (
                    <div className="success-message">
                        <FiCheckCircle />
                        Password reset link has been sent to your email. Please check your inbox and follow the instructions.
                    </div>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                id="forgot-email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            id="forgot-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="form-footer">
                    Remember your password?
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
