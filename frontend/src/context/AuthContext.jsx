import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUser = localStorage.getItem('userInfo');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put('/api/users/profile', userData, config);
            setUserInfo({ ...userInfo, ...data });
            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout, updateProfile, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
