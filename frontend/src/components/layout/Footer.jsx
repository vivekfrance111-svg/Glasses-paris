import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer section">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2>LUMINA<span>OPTICS</span></h2>
                        <p>Premium eyewear designed for those who see beyond. Combining timeless style with modern precision.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram">IG</a>
                            <a href="#" aria-label="Twitter">TW</a>
                            <a href="#" aria-label="Facebook">FB</a>
                        </div>
                    </div>
                    <div className="footer-group">
                        <div className="footer-links">
                            <h3>Shop</h3>
                            <ul>
                                <li><a href="/products">Men's Collection</a></li>
                                <li><a href="/products">Women's Collection</a></li>
                                <li><a href="/products">Computer Glasses</a></li>
                                <li><a href="/products">New Arrivals</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h3>Company</h3>
                            <ul>
                                <li><a href="/about">Our Story</a></li>
                                <li><a href="/sustainability">Sustainability</a></li>
                                <li><a href="/careers">Careers</a></li>
                                <li><a href="/stores">Find a Store</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="/shipping">Shipping & Returns</a></li>
                                <li><a href="/warranty">Warranty</a></li>
                                <li><a href="/faqs">FAQs</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Lumina Optics. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
