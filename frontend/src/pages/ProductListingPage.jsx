import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import './ProductListingPage.css';

const ProductListingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Read from searchParams
    const categoryQuery = searchParams.get('category') || '';
    const frameStyleQuery = searchParams.get('frameStyle') || '';
    const colorQuery = searchParams.get('color') || '';
    const minPriceQuery = searchParams.get('minPrice') || '';
    const maxPriceQuery = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = `http://localhost:5000/api/products?`;
                if (categoryQuery) url += `category=${categoryQuery}&`;
                if (frameStyleQuery) url += `frameStyle=${frameStyleQuery}&`;
                if (colorQuery) url += `color=${colorQuery}&`;
                if (minPriceQuery) url += `minPrice=${minPriceQuery}&`;
                if (maxPriceQuery) url += `maxPrice=${maxPriceQuery}&`;

                const { data } = await axios.get(url);

                let sortedProducts = [...data.products];
                if (sort === 'price-low') {
                    sortedProducts.sort((a, b) => a.price - b.price);
                } else if (sort === 'price-high') {
                    sortedProducts.sort((a, b) => b.price - a.price);
                } else if (sort === 'rating') {
                    sortedProducts.sort((a, b) => b.rating - a.rating);
                }

                setProducts(sortedProducts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryQuery, frameStyleQuery, colorQuery, minPriceQuery, maxPriceQuery, sort]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    return (
        <div className="plp-container container section">
            <div className="plp-layout">
                {/* Sidebar Filters */}
                <aside className="plp-sidebar glass-panel">
                    <div className="filter-header">
                        <h3>Filters</h3>
                        <button onClick={clearFilters} className="btn-text-sm">Clear All</button>
                    </div>

                    <div className="filter-group">
                        <h4>Frame Style</h4>
                        <select
                            value={frameStyleQuery}
                            onChange={(e) => updateFilter('frameStyle', e.target.value)}
                        >
                            <option value="">All Styles</option>
                            <option value="Rectangular">Rectangular</option>
                            <option value="Round">Round</option>
                            <option value="Aviator">Aviator</option>
                            <option value="Wayfarer">Wayfarer</option>
                            <option value="Cat Eye">Cat Eye</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h4>Color</h4>
                        <div className="color-options">
                            {['Black', 'Tortoise', 'Gold', 'Silver', 'Blue', 'Clear'].map(c => (
                                <button
                                    key={c}
                                    className={`color-btn ${colorQuery === c ? 'active' : ''}`}
                                    onClick={() => updateFilter('color', colorQuery === c ? '' : c)}
                                    title={c}
                                    style={{ backgroundColor: c.toLowerCase() }}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Price Range</h4>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPriceQuery}
                                onChange={(e) => updateFilter('minPrice', e.target.value)}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPriceQuery}
                                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="plp-main">
                    <div className="plp-header">
                        <div className="results-count">
                            Showing {products.length} products
                        </div>
                        <div className="sort-dropdown">
                            <label>Sort by:</label>
                            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Customer Rating</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
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
                                    <p>No products match your selected filters.</p>
                                    <button onClick={clearFilters} className="btn-primary-sm">Clear Filters</button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListingPage;
