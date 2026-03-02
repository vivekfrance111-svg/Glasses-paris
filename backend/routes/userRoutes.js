import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    registerValidationRules,
    loginValidationRules,
    profileValidationRules,
    forgotPasswordValidationRules,
    resetPasswordValidationRules,
    validate,
} from '../middleware/validatorMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

router.route('/')
    .post(authRateLimiter, registerValidationRules(), validate, registerUser)
    .get(protect, admin, getUsers);
router.post('/login', authRateLimiter, loginValidationRules(), validate, authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, profileValidationRules(), validate, updateUserProfile);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

router.post('/forgot-password', forgotPasswordValidationRules(), validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidationRules(), validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);


export default router;
