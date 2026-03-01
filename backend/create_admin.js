import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glasses_ecommerce');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'password123';
        const adminName = 'Admin User';

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            userExists.isAdmin = true;
            await userExists.save();
            console.log('User already exists, updated to Admin');
        } else {
            await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                isAdmin: true
            });
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
