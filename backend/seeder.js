import mongoose from 'mongoose';
import dotenv from 'dotenv';
import categories from './data/categories.js';
import products from './data/products.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Order from './models/Order.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glasses_ecommerce');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Review.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        // await User.deleteMany(); // We don't have users in data yet, but let's keep it safe

        const createdCategories = await Category.insertMany(categories);

        const menCategory = createdCategories.find(c => c.name === 'Men')._id;
        const womenCategory = createdCategories.find(c => c.name === 'Women')._id;
        const unisexCategory = createdCategories.find(c => c.name === 'Unisex')._id;

        const sampleProducts = products.map((product, index) => {
            let category;
            if (index === 0) category = menCategory;
            else if (index === 1) category = womenCategory;
            else category = unisexCategory;

            return { ...product, category };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Review.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
