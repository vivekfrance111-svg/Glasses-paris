import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-wrapper">
            <Header />
            <CartDrawer />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
