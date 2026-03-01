import express from 'express';
const router = express.Router();
import { createProductReview, getProductReviews, getAllReviews, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, createProductReview)
    .get(protect, admin, getAllReviews);
router.route('/:productId').get(getProductReviews);
router.route('/:id').delete(protect, admin, deleteReview);

export default router;
