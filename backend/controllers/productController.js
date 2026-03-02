import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        let categoryQuery = {};
        if (req.query.category) {
            if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
                categoryQuery = { category: req.query.category };
            } else {
                const category = await Category.findOne({ name: { $regex: req.query.category, $options: 'i' } });
                if (category) {
                    categoryQuery = { category: category._id };
                } else {
                    return res.json({ products: [], page, pages: 0 });
                }
            }
        }

        const frameStyle = req.query.frameStyle ? { frameStyle: req.query.frameStyle } : {};
        const color = req.query.color ? { color: req.query.color } : {};

        let priceFilter = {};
        if (req.query.minPrice || req.query.maxPrice) {
            priceFilter.price = {};
            if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
        }

        const query = {
            ...keyword,
            ...categoryQuery,
            ...frameStyle,
            ...color,
            ...priceFilter
        };

        // Only show visible products unless showAll is explicitly requested (e.g., from Admin list)
        if (req.query.showAll !== 'true') {
            query.isVisible = true;
        }

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate({
                path: 'reviews',
                options: { sort: { createdAt: -1 } }
            });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
            frameStyle,
            color,
            isVisible
        } = req.body;

        const productData = {
            name: name || 'Sample Name',
            price: price || 0,
            user: req.user._id,
            image: image || '/images/sample.jpg',
            brand: brand || 'Sample Brand',
            category: category || '65dbd6a782a20336a8e833f4', // Placeholder Category ID
            countInStock: countInStock || 0,
            numReviews: 0,
            description: description || 'Sample description',
            frameStyle: frameStyle || 'Wayfarer',
            color: color || 'Black',
            isVisible: isVisible !== undefined ? isVisible : true
        };

        const product = new Product(productData);

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
            frameStyle,
            color
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            product.frameStyle = frameStyle || product.frameStyle;
            product.color = color || product.color;
            if (isVisible !== undefined) product.isVisible = isVisible;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
