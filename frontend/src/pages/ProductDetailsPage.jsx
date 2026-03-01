import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CustomSelect from '../components/common/CustomSelect';
import Skeleton from '../components/common/Skeleton';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { addToCart, openCart } = useCart();
    const { userInfo } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLens, setSelectedLens] = useState('');

    // Review states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewImage, setReviewImage] = useState('');
    const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState(null);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
            if (data.lensOptions && data.lensOptions.length > 0) {
                setSelectedLens(data.lensOptions[0].lensType);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Product not found.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const uploadReviewImageHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploadingReviewImage(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setReviewImage(data.image);
            setUploadingReviewImage(false);
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
            setUploadingReviewImage(false);
        }
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post(
                '/api/reviews',
                { rating, comment, productId: id, image: reviewImage },
                config
            );

            setRating(5);
            setComment('');
            setReviewImage('');
            fetchProduct(); // Reload product to show new review
            alert('Review submitted successfully!');
        } catch (err) {
            setReviewError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="pdp-container container section">
                <div className="pdp-layout">
                    <div className="pdp-gallery glass-panel">
                        <Skeleton height="500px" width="100%" borderRadius="16px" className="skeleton-img" />
                    </div>
                    <div className="pdp-info">
                        <Skeleton height="20px" width="100px" className="pdp-brand" />
                        <Skeleton height="40px" width="300px" className="pdp-title" />
                        <Skeleton height="20px" width="150px" />
                        <Skeleton height="35px" width="120px" style={{ marginTop: '1rem' }} />
                        <div className="pdp-selection" style={{ marginTop: '2rem' }}>
                            <Skeleton height="20px" width="150px" />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <Skeleton height="60px" width="120px" borderRadius="12px" />
                                <Skeleton height="60px" width="120px" borderRadius="12px" />
                            </div>
                        </div>
                        <div className="pdp-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <Skeleton height="50px" width="200px" borderRadius="30px" />
                            <Skeleton height="50px" width="150px" borderRadius="30px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <div className="container section">{error}</div>;
    if (!product) return null;

    const currentLens = product.lensOptions?.find(l => l.lensType === selectedLens);
    const finalPrice = product.price + (currentLens?.additionalPrice || 0);

    const handleAddToCart = () => {
        addToCart(product, 1, currentLens);
        openCart();
    };

    return (
        <div className="pdp-container container section">
            <div className="pdp-layout">
                <div className="pdp-gallery glass-panel">
                    <img src={product.image} alt={product.name} className="main-image" />
                </div>

                <div className="pdp-info">
                    <div className="pdp-header">
                        <span className="pdp-brand">{product.brand}</span>
                        <h1 className="pdp-title">{product.name}</h1>
                        <div className="pdp-rating">
                            <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
                            <span className="reviews-count">({product.numReviews} Reviews)</span>
                        </div>
                    </div>

                    <div className="pdp-price">
                        ${finalPrice.toFixed(2)}
                    </div>

                    <div className="pdp-selection">
                        <div className="selection-group">
                            <h4>Frame Details</h4>
                            <p>Style: {product.frameStyle}</p>
                            <p>Color: {product.color}</p>
                            <p>Dimensions: {product.dimensions}</p>
                        </div>

                        {product.lensOptions?.length > 0 && (
                            <div className="selection-group">
                                <h4>Lens Type</h4>
                                <div className="lens-options">
                                    {product.lensOptions.map(lens => (
                                        <button
                                            key={lens.lensType}
                                            className={`lens-btn ${selectedLens === lens.lensType ? 'active' : ''}`}
                                            onClick={() => setSelectedLens(lens.lensType)}
                                        >
                                            <span className="type">{lens.lensType}</span>
                                            <span className="price">
                                                {lens.additionalPrice > 0 ? `+$${lens.additionalPrice}` : 'Free'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pdp-actions">
                        <button className="btn-primary pdp-add-to-cart" onClick={handleAddToCart}>
                            Add to Bag
                        </button>
                        <button className="btn-secondary pdp-wishlist">Wishlist</button>
                    </div>

                    <div className="pdp-description">
                        <h4>Description</h4>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="reviews-section section">
                <h2 className="section-title">Customer Reviews</h2>

                <div className="reviews-layout">
                    <div className="reviews-list">
                        {product.reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
                        {product.reviews.map((review) => (
                            <div key={review._id} className="review-card glass-panel">
                                <div className="review-header">
                                    <div className="review-meta">
                                        <strong>{review.name}</strong>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="review-stars stars">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                {review.image && <img src={review.image} alt="Review" className="review-image" />}
                            </div>
                        ))}
                    </div>

                    <div className="review-form-container">
                        <div className="glass-panel review-form-card">
                            <h3>Write a Review</h3>
                            {userInfo ? (
                                <form onSubmit={submitReviewHandler} className="review-form">
                                    <div className="form-group">
                                        <label>Rating</label>
                                        <CustomSelect
                                            value={rating}
                                            options={[
                                                { value: '5', label: '5 - Excellent' },
                                                { value: '4', label: '4 - Very Good' },
                                                { value: '3', label: '3 - Good' },
                                                { value: '2', label: '2 - Fair' },
                                                { value: '1', label: '1 - Poor' },
                                            ]}
                                            onChange={setRating}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows="4"
                                            required
                                            className="form-control"
                                            placeholder="Share your thoughts about this product..."
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Photo (Optional)</label>
                                        <input
                                            type="file"
                                            onChange={uploadReviewImageHandler}
                                            className="form-control"
                                            accept="image/*"
                                        />
                                        {uploadingReviewImage && <p className="loading-text">Uploading image...</p>}
                                        {reviewImage && <p className="success-text">Image uploaded!</p>}
                                    </div>
                                    {reviewError && <p className="error-message">{reviewError}</p>}
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={submittingReview || uploadingReviewImage}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : (
                                <p>Please <a href="/login" className="accent-link">sign in</a> to write a review.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
