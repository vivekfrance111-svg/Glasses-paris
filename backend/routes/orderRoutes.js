import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    getOrderStats,
    updateOrderStatus,
    createPaymentIntent,
    stripeWebhook,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/webhook').post(stripeWebhook);
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);


export default router;
