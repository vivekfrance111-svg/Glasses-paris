import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
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
    const [isSuccess, setIsSuccess] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=checkout');
        }
        if (cartItems.length === 0 && !isSuccess) {
            navigate('/products');
        }
    }, [userInfo, cartItems, navigate, isSuccess]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
    };

    const cardElementOptions = {
        style: {
            base: {
                color: "#ffffff",
                fontFamily: '"Outfit", sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)"
                }
            },
            invalid: {
                color: "#ef4444",
                iconColor: "#ef4444"
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderItems = cartItems.map(item => ({
                product: item._id,
                qty: item.qty,
                lensOptions: item.lensOptions
            }));

            // 1. Create Payment Intent and Pending Order
            const { data: { clientSecret, orderId } } = await axios.post(
                '/api/orders/create-payment-intent',
                {
                    orderItems,
                    shippingAddress,
                    paymentMethod
                },
                config
            );

            // 2. Confirm Payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: userInfo.name,
                        email: userInfo.email,
                        address: {
                            line1: shippingAddress.address,
                            city: shippingAddress.city,
                            postal_code: shippingAddress.postalCode,
                            country: shippingAddress.country || 'US',
                        }
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                setIsSuccess(true);
                clearCart();
                navigate(`/order/${orderId}`);
            }
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

                            {paymentMethod === 'Stripe' && (
                                <div className="stripe-element-container glass-panel">
                                    <label className="stripe-label">Card Details</label>
                                    <div className="stripe-card-input">
                                        <CardElement options={cardElementOptions} />
                                    </div>
                                </div>
                            )}

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

const CheckoutPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default CheckoutPage;
