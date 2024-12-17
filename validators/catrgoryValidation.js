const { check, body } = require('express-validator');
const Category = require('../models/Category');

exports.createCategoryValidation = [
    body('name.en')
        .notEmpty().withMessage("Category name in English is required")
        .isLength({ min: 3, max: 30 }).withMessage("English name must be between 3 and 30 characters long"),
    body('name.fr')
        .notEmpty().withMessage("Category name in French is required")
        .isLength({ min: 3, max: 30 }).withMessage("French name must be between 3 and 30 characters long"),
    body('name.ar')
        .notEmpty().withMessage("Category name in Arabic is required")
        .isLength({ min: 3, max: 30 }).withMessage("Arabic name must be between 3 and 30 characters long"),
    body('name')
        .custom(async (val, { req }) => {
            // Ensure unique names across all fields (en, fr, ar)
            const existingCategory = await Category.findOne({
                $or: [
                    { "name.en": val.en },
                    { "name.fr": val.fr },
                    { "name.ar": val.ar },
                ],
            });
            if (existingCategory && existingCategory._id.toString() !== req.params.id) {
                throw new Error('Category name already exists in one or more languages');
            }
            return true;
        }),
    check('image').optional()
];
