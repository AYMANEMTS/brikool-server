const { check, body } = require('express-validator');
const Job = require('../models/Job');

exports.jobForm = [
   
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),


    check('status')
        .optional()
        .isIn(['active', 'inactive','suspended']).withMessage('Status must be either active or inactive'),

    check('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID format'),  

    check('ratings.*.userId')
        .optional()
        .isMongoId().withMessage('Invalid user ID format for review'), // Validate userId in reviews if present

    check('ratings.*.rating')
        .optional()
        .isNumeric().withMessage('Rating must be a number')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'), // Validate rating value

    check('comments.*.userId')
        .optional()
        .isMongoId().withMessage('Invalid user ID format for comment'), // Validate userId in comments if present

    check('comments.*.comment')
        .optional()
        .isString().withMessage('Comment must be a string')
        .isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'), // Validate comment length

];

exports.addCommentValidation = [
    check('comment').isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
]

exports.ratingValidation = [
    check('rating').isNumeric().withMessage('Rating should be a number')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
]