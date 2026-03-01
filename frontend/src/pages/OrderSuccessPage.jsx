import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const { id } = useParams();
    const { userInfo } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrder();
        }
    }, [id, userInfo]);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (error) return <div className="error-container glass-panel"><h2>Error</h2><p>{error}</p></div>;

    return (
        <div className="order-success-container">
            <div className="success-card glass-panel h-entry">
                <div className="success-icon">✨</div>
                <h1>Order Confirmed!</h1>
                <p className="order-number">Order ID: #{order._id}</p>
                <p>Thank you for your purchase, {order.user.name}. Your glasses are being prepared for shipment.</p>

                <div className="order-details-grid">
                    <div className="details-box">
                        <h3>Shipping To</h3>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                    <div className="details-box">
                        <h3>Payment Status</h3>
                        <p className={order.isPaid ? 'status-paid' : 'status-pending'}>
                            {order.isPaid ? 'Paid' : 'Pending Payment'}
                        </p>
                        <p>Method: {order.paymentMethod}</p>
                    </div>
                </div>

                <div className="ordered-items">
                    <h3>Items</h3>
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                            <span>{item.name} ({item.lensOptions?.lensType}) x {item.qty}</span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="order-total-row">
                        <span>Total Paid</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <div className="success-actions">
                    <Link to="/products" className="btn-primary-sm">Continue Shopping</Link>
                    <Link to="/profile" className="btn-secondary-sm">View Order History</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
