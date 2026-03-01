import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mockProducts from './data/products.js';
import mockCategories from './data/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Track MongoDB connection status
let dbConnected = false;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (non-blocking)
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glasses_ecommerce', {
            serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB isn't available
        });
        dbConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        dbConnected = false;
        console.warn(`MongoDB not available: ${error.message}`);
        console.warn('Server will use mock data fallback.');
    }
};

// Generate mock product objects with _id fields to match frontend expectations
const generateMockProductsWithIds = () => {
    const categoryIds = {
        Men: '65dbd6a782a20336a8e833f1',
        Women: '65dbd6a782a20336a8e833f2',
        Unisex: '65dbd6a782a20336a8e833f3',
    };

    return mockProducts.map((product, index) => {
        let categoryName;
        if (index === 0) categoryName = 'Men';
        else if (index === 1) categoryName = 'Women';
        else categoryName = 'Unisex';

        return {
            ...product,
            _id: `mock_product_${index + 1}_${Date.now().toString(36)}`,
            category: { _id: categoryIds[categoryName], name: categoryName },
            reviews: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    });
};

// Mock data fallback middleware — intercepts API routes when MongoDB is down
app.use('/api/products', (req, res, next) => {
    if (dbConnected) return next(); // Use real routes if DB is connected

    // GET /api/products
    if (req.method === 'GET' && !req.params[0]) {
        const products = generateMockProductsWithIds();
        return res.json({ products, page: 1, pages: 1 });
    }
    next();
});

app.use('/api/products/:id', (req, res, next) => {
    if (dbConnected) return next();

    if (req.method === 'GET') {
        const products = generateMockProductsWithIds();
        const product = products.find(p => p._id === req.params.id);
        if (product) return res.json(product);
        // If not found by mock ID, return first product as fallback
        return res.json(products[0]);
    }
    next();
});

app.use('/api/categories', (req, res, next) => {
    if (dbConnected) return next();

    if (req.method === 'GET') {
        const categories = mockCategories.map((cat, index) => ({
            ...cat,
            _id: `mock_category_${index + 1}`,
        }));
        return res.json(categories);
    }
    next();
});

// Routes (used when MongoDB is connected)
app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        dbStatus: dbConnected ? 'connected' : 'using mock data',
    });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    if (!dbConnected) {
        console.log('📦 Serving mock product data (MongoDB unavailable)');
    }
});
