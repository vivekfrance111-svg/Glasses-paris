import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="layout-wrapper">
            <Header />
            <CartDrawer />
            <main className="main-content page-enter" key={location.pathname}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
