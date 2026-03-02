import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiSliders, FiX } from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import CustomSelect from '../components/common/CustomSelect';
import './ProductListingPage.css';

const ProductListingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
                let url = `/api/products?`;
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

    const frameStyleOptions = [
        { value: '', label: 'All Styles' },
        { value: 'Rectangular', label: 'Rectangular' },
        { value: 'Round', label: 'Round' },
        { value: 'Aviator', label: 'Aviator' },
        { value: 'Wayfarer', label: 'Wayfarer' },
        { value: 'Cat Eye', label: 'Cat Eye' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest Arrivals' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Customer Rating' },
    ];

    return (
        <div className="plp-container container section">
            {/* Mobile Filter Toggle */}
            <button className="mobile-filter-toggle" onClick={() => setMobileFilterOpen(true)}>
                <FiSliders /> Filters
            </button>

            <div className="plp-layout">
                {/* Mobile Overlay */}
                {mobileFilterOpen && (
                    <div className="filter-overlay" onClick={() => setMobileFilterOpen(false)}></div>
                )}

                {/* Sidebar Filters */}
                <aside className={`plp-sidebar glass-panel ${mobileFilterOpen ? 'mobile-open' : ''}`}>
                    <div className="filter-header">
                        <h3>Filters</h3>
                        <div className="filter-header-actions">
                            <button onClick={clearFilters} className="btn-text-sm">Clear All</button>
                            <button className="filter-close-btn" onClick={() => setMobileFilterOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Frame Style</h4>
                        <CustomSelect
                            value={frameStyleQuery}
                            options={frameStyleOptions}
                            onChange={(val) => updateFilter('frameStyle', val)}
                            placeholder="All Styles"
                        />
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
                            <CustomSelect
                                value={sort}
                                options={sortOptions}
                                onChange={(val) => updateFilter('sort', val)}
                                placeholder="Newest Arrivals"
                            />
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
