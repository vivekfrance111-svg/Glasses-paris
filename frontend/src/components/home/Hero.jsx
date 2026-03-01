import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero section">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="badge">New Collection 2026</span>
                    <h1>Clear Vision, <span>Modern Style</span></h1>
                    <p>Elevate your perspective with our curated collection of premium eyewear. Designed for clarity, crafted for comfort.</p>
                    <div className="hero-cta">
                        <button className="btn-primary">Shop Men</button>
                        <button className="btn-secondary">Shop Women</button>
                    </div>
                    <div className="hero-trust">
                        <div className="trust-item">
                            <span className="trust-val">24h</span>
                            <span className="trust-label">Fast Shipping</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-val">100%</span>
                            <span className="trust-label">Authentic</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-image-placeholder glass-panel">
                        <div className="floating-badge">Limited Edition</div>
                        <div className="image-overlay"></div>
                        <span>LUMINA OPTICS</span>
                    </div>
                    <div className="experience-badge glass-panel">
                        <span className="years">15+</span>
                        <span className="text">Years of Precision</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
