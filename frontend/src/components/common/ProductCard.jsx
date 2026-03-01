import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card glass-panel">
            <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image">
                    <img src={product.image} alt={product.name} className="img-fluid" />
                    {product.countInStock === 0 && (
                        <div className="stock-badge out-of-stock">Out of Stock</div>
                    )}
                    <div className="card-overlay">
                        <button className="btn-icon" aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>♡</button>
                        <span className="btn-primary-sm">View Details</span>
                    </div>
                </div>
                <div className="product-info">
                    <div className="product-category">{product.category && product.category.name}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        <div className="product-rating">
                            <span className="star">★</span>
                            <span className="rating-val">{product.rating}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
