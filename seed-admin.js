import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glasses_ecommerce');
        console.log('Connected to DB');

        const email = 'admin@example.com';
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            existingAdmin.isAdmin = true;
            existingAdmin.isVerified = true;
            await existingAdmin.save();
            console.log('Admin user updated');
        } else {
            await User.create({
                name: 'Admin User',
                email,
                password: 'password123',
                isAdmin: true,
                isVerified: true
            });
            console.log('Admin user created');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
