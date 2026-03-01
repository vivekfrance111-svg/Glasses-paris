import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=checkout');
        }
        if (cartItems.length === 0) {
            navigate('/products');
        }
    }, [userInfo, cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price + (item.lensOptions?.additionalPrice || 0),
                    product: item._id,
                    lensOptions: item.lensOptions
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: cartTotal,
                shippingPrice: cartTotal > 100 ? 0 : 10, // Example shipping logic
                taxPrice: cartTotal * 0.1, // 10% tax
                totalPrice: cartTotal + (cartTotal > 100 ? 0 : 10) + (cartTotal * 0.1),
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);

            clearCart();
            navigate(`/order/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-content glass-panel">
                <h1>Checkout</h1>
                {error && <div className="error-message">{error}</div>}

                <form className="checkout-form" onSubmit={submitHandler}>
                    <div className="form-section">
                        <h3>Shipping Information</h3>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={shippingAddress.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={shippingAddress.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                required
                                value={shippingAddress.country}
                                onChange={handleInputChange}
                                placeholder="Enter country"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Payment Method</h3>
                        <div className="payment-options">
                            <label className={`payment-option ${paymentMethod === 'Stripe' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Stripe"
                                    checked={paymentMethod === 'Stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                Credit Card (Stripe)
                            </label>
                            <label className={`payment-option ${paymentMethod === 'PayPal' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                PayPal
                            </label>
                        </div>
                    </div>

                    <div className="order-summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>${(cartTotal > 100 ? 0 : 10).toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (10%):</span>
                                <span>${(cartTotal * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${(cartTotal + (cartTotal > 100 ? 0 : 10) + (cartTotal * 0.1)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary checkout-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>

            <div className="checkout-sidebar glass-panel">
                <h3>In Your Bag</h3>
                <div className="checkout-items">
                    {cartItems.map((item, idx) => (
                        <div key={`${item._id}-${idx}`} className="checkout-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>{item.lensOptions?.lensType} x {item.qty}</p>
                                <span className="item-price">
                                    ${((item.price + (item.lensOptions?.additionalPrice || 0)) * item.qty).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
