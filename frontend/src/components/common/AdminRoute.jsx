import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { userInfo } = useAuth();

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            alert('Not Authorized');
        }
    }, [userInfo]);

    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/" />;
};


export default AdminRoute;
