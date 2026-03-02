import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import {
    registerValidationRules,
    loginValidationRules,
    validate,
} from '../middleware/validatorMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authRateLimiter, loginValidationRules(), validate, loginUser);
router.post('/register', authRateLimiter, registerValidationRules(), validate, registerUser);

export default router;
