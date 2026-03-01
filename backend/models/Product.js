import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        // Glasses specific attributes
        frameStyle: {
            type: String, // e.g., Rectangular, Round, Aviator
        },
        color: {
            type: String,
        },
        dimensions: {
            type: String, // e.g., 52-18-140
        },
        lensOptions: [
            {
                lensType: { type: String }, // e.g., Single Vision, Progressive, Blue Light
                additionalPrice: { type: Number, default: 0 },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
