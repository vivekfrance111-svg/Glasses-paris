import { body, validationResult } from 'express-validator';

/**
 * Middleware to handle express-validator errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(400).json({
        errors: extractedErrors,
        message: 'Validation failed'
    });
};

/**
 * Validation rules for user registration
 */
export const registerValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
};

/**
 * Validation rules for user login
 */
export const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ];
};

/**
 * Validation rules for profile updates
 */
export const profileValidationRules = () => {
    return [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
};

/**
 * Validation rules for order creation / payment intent
 */
export const orderValidationRules = () => {
    return [
        body('orderItems').isArray({ min: 1 }).withMessage('Order items must be an array and contain at least one item'),
        body('orderItems.*.product').notEmpty().withMessage('Product ID is required for each item'),
        body('orderItems.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1 for each item'),
        body('shippingAddress.address').trim().notEmpty().withMessage('Shipping address is required'),
        body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
        body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
        body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    ];
};

/**
 * Validation rules for forgot password
 */
export const forgotPasswordValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    ];
};

/**
 * Validation rules for reset password
 */
export const resetPasswordValidationRules = () => {
    return [
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
};

export { validate };
