import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/home/Hero';
import ProductCard from '../components/common/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Using relative path will work if we set proxy in vite.config.ts or use full URL
                const { data } = await axios.get('http://localhost:5000/api/products');
                // Only show top 4 on home page
                setProducts(data.products.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products.');
                setLoading(false);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Hero />

            <section className="featured section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Trending Now</h2>
                        <a href="/products" className="btn-text">View All Collections &rarr;</a>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="product-card-skeleton glass-panel">
                                    <div className="skeleton-img"></div>
                                    <div className="skeleton-details">
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="error-message glass-panel">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>No products found in the catalog.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default HomePage;
