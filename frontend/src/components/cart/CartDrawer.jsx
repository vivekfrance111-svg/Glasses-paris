import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
    const {
        cartItems,
        removeFromCart,
        updateQty,
        isOpen,
        closeCart,
        cartTotal
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <div className="cart-overlay-bg" onClick={closeCart}>
            <div className="cart-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Your Bag</h2>
                    <button className="close-btn" onClick={closeCart}>&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your bag is empty.</p>
                            <button className="btn-primary-sm" onClick={closeCart}>Start Shopping</button>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={`${item._id}-${idx}`} className="cart-item">
                                <div className="item-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-top">
                                        <h4>{item.name}</h4>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id, item.lensOptions)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <p className="item-variant">
                                        {item.lensOptions?.lensType}
                                    </p>
                                    <div className="item-bottom">
                                        <div className="qty-control">
                                            <button
                                                onClick={() => updateQty(item._id, item.lensOptions, Math.max(1, item.qty - 1))}
                                            >-</button>
                                            <span>{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item._id, item.lensOptions, item.qty + 1)}
                                            >+</button>
                                        </div>
                                        <span className="item-price">
                                            ${((item.price + (item.lensOptions?.additionalPrice || 0)) * item.qty).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="footer-note">Shipping and taxes calculated at checkout.</p>
                        <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
