const { validationResult } = require('express-validator');

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const lang = req.headers['accept-language']?.split(',')[0] || req.query.lang || 'en';
        const formattedErrors = errors.array().map(error => {
            const message = error.msg[lang] || error.msg['en']; // Fallback to English if the language is not available
            return {
                field: error.path,
                message: message
            };
        });

        const error = new Error(req.t('validationFailed')); // Assuming `req.t` handles translations for the main error message
        error.status = 422;
        error.errors = formattedErrors;

        return next(error);
    }
    next();
};

module.exports = checkValidation;
