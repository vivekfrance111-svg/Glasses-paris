import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment, productId, image } = req.body;

    try {
        const product = await Product.findById(productId);

        if (product) {
            const alreadyReviewed = await Review.findOne({
                user: req.user._id,
                product: productId,
            });

            if (alreadyReviewed) {
                res.status(400).json({ message: 'Product already reviewed' });
                return;
            }

            const review = await Review.create({
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
                product: productId,
                image,
            });

            product.reviews.push(review._id);
            product.numReviews = await Review.countDocuments({ product: productId });

            const reviews = await Review.find({ product: productId });
            product.rating =
                reviews.reduce((acc, item) => item.rating + acc, 0) /
                reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user', 'name').populate('product', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            const product = await Product.findById(review.product);
            if (product) {
                product.reviews = product.reviews.filter(r => r.toString() !== review._id.toString());
                await product.save();

                // Recalculate rating
                const remainingReviews = await Review.find({ product: product._id, _id: { $ne: review._id } });
                if (remainingReviews.length > 0) {
                    product.rating = remainingReviews.reduce((acc, r) => r.rating + acc, 0) / remainingReviews.length;
                } else {
                    product.rating = 0;
                }
                product.numReviews = remainingReviews.length;
                await product.save();
            }

            await review.deleteOne();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createProductReview, getProductReviews, getAllReviews, deleteReview };
