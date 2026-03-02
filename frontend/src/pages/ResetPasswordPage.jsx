import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import './ResetPasswordPage.css';

const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'weak' };
    if (score <= 3) return { level: 2, label: 'medium' };
    return { level: 3, label: 'strong' };
};

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const strength = getPasswordStrength(password);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`/api/users/reset-password/${token}`, { password });
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : 'Something went wrong. The token may be invalid or expired.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-pw-container">
            <div className="reset-pw-card glass">
                <div className="icon-wrapper">
                    <FiLock />
                </div>
                <h1>Reset Password</h1>
                <p className="subtitle">
                    Create a strong new password for your account.
                </p>

                {error && <div className="error-message">{error}</div>}

                {success ? (
                    <>
                        <div className="success-message">
                            <FiCheckCircle />
                            Your password has been reset successfully! Redirecting to login...
                        </div>
                        <div className="form-footer">
                            <Link to="/login">Go to Login Now</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="reset-password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {password && (
                                    <>
                                        <div className="password-strength">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`bar ${i <= strength.level ? `active ${strength.label}` : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="password-hint">
                                            Strength: {strength.label || 'too short'}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        id="reset-confirm-password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                id="reset-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <div className="form-footer">
                            Remember your password?
                            <Link to="/login">Sign In</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
