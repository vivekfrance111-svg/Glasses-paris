import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Developmental mock fallback for testing when MongoDB is disconnected or for CI/CD
    if (process.env.NODE_ENV === 'development') {
        if (email === 'john@example.com' && password === 'password123') {
            return res.json({
                _id: '65dbd6a782a20336a8e833f0',
                name: 'John Doe',
                email: 'john@example.com',
                isAdmin: false,
                token: generateToken('65dbd6a782a20336a8e833f0'),
            });
        }
        if (email === 'admin@example.com' && password === 'admin123') {
            return res.json({
                _id: '65dbd6a782a20336a8e833e9',
                name: 'Admin User',
                email: 'admin@example.com',
                isAdmin: true,
                token: generateToken('65dbd6a782a20336a8e833e9'),
            });
        }
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Provide graceful error messages in development
        res.status(500).json({ message: `Database error: ${error.message}` });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`MongoDB unavailable for registration: ${error.message}. Returning mock user.`);
            const mockId = `mock_reg_${Date.now()}`;
            return res.status(201).json({
                _id: mockId,
                name: name,
                email: email,
                isAdmin: false,
                token: generateToken(mockId),
            });
        }
        res.status(500).json({ message: error.message });
    }
};

export { loginUser, registerUser };
