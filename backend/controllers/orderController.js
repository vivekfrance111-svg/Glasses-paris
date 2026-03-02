import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    if (req.user && !req.user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email to place an order.' });
    }
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const orderData = {
                orderItems: orderItems.map((x) => ({
                    ...x,
                    product: x.product,
                    _id: undefined
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid: req.body.isPaid || false,
                paidAt: req.body.paidAt,
                paymentResult: req.body.paymentResult,
            };

            // In development, handle cases where MongoDB is unavailable
            if (process.env.NODE_ENV === 'development') {
                try {
                    const order = new Order(orderData);
                    const createdOrder = await order.save();
                    return res.status(201).json(createdOrder);
                } catch (dbError) {
                    console.warn(`Falling back to mock order: ${dbError.message}`);
                    return res.status(201).json({
                        ...orderData,
                        _id: `mock_order_${Date.now()}`,
                        createdAt: new Date().toISOString(),
                    });
                }
            }

            const order = new Order(orderData);
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            res.json(order);
        } else {
            if (req.params.id.startsWith('mock_order_')) {
                return res.json({
                    _id: req.params.id,
                    user: { name: 'John Doe', email: 'john@example.com' },
                    orderItems: [], // Simplification for mock
                    status: 'Processing',
                    createdAt: new Date().toISOString()
                });
            }
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        if (req.params.id.startsWith('mock_order_')) {
            return res.json({
                _id: req.params.id,
                user: { name: 'John Doe', email: 'john@example.com' },
                orderItems: [],
                status: 'Processing',
                createdAt: new Date().toISOString()
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updatedOrder = await order.save();

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({});
        const paidOrders = await Order.countDocuments({ isPaid: true });
        const orders = await Order.find({});

        const totalRevenue = orders.reduce((acc, order) => {
            return acc + (order.isPaid ? order.totalPrice : 0);
        }, 0);

        const pendingOrders = totalOrders - paidOrders;

        res.json({
            totalOrders,
            paidOrders,
            pendingOrders,
            totalRevenue: totalRevenue.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const { status } = req.body;
            order.status = status || order.status;

            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create payment intent for Stripe
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    if (req.user && !req.user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email to proceed to checkout.' });
    }
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    try {
        let itemsPrice = 0;

        // Recalculate items price on server side for security
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            // Calculate price based on DB product price + lens option price
            const lensOption = product.lensOptions.find(l => l.lensType === item.lensOptions?.lensType);
            const additionalPrice = lensOption ? lensOption.additionalPrice : 0;
            const itemTotal = (product.price + additionalPrice) * item.qty;

            itemsPrice += itemTotal;
        }

        // Apply business logic for shipping and tax
        const calculatedShippingPrice = itemsPrice > 100 ? 0 : 10;
        const calculatedTaxPrice = itemsPrice * 0.1;
        const totalPrice = itemsPrice + calculatedShippingPrice + calculatedTaxPrice;

        // Create a pending order first
        const orderData = {
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod: paymentMethod || 'Stripe',
            itemsPrice,
            taxPrice: calculatedTaxPrice,
            shippingPrice: calculatedShippingPrice,
            totalPrice,
            isPaid: false,
        };

        const order = new Order(orderData);
        const createdOrder = await order.save();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                orderId: createdOrder._id.toString(),
                userEmail: req.user.email
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            orderId: createdOrder._id,
            totalPrice: totalPrice.toFixed(2)
        });
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe Webhook
// @route   POST /api/orders/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body is already a Buffer here thanks to server.js middleware
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
        );
    } catch (err) {
        console.error(`Webhook Signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        console.log(`💰 Payment Intent Succeeded for order: ${orderId}`);

        if (orderId) {
            try {
                const order = await Order.findById(orderId);
                if (order) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: paymentIntent.id,
                        status: paymentIntent.status,
                        update_time: Date.now().toString(),
                        email_address: paymentIntent.receipt_email || paymentIntent.metadata.userEmail || '',
                    };
                    await order.save();
                    console.log(`✅ Order ${orderId} marked as paid successfully.`);
                } else {
                    console.warn(`⚠️ Order ${orderId} not found in database.`);
                }
            } catch (error) {
                console.error(`❌ Error updating order ${orderId}:`, error);
            }
        }
    }

    res.json({ received: true });
};

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    getOrderStats,
    updateOrderStatus,
    createPaymentIntent,
    stripeWebhook
};

