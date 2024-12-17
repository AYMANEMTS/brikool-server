// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || null;

    res.status(status).json({ message, errors });
};
