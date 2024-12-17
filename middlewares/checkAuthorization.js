const User = require("../models/User");
const checkAuthorization = (requiredPermission = "") => async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role === 'admin') {
            return next();
        }
        if (user.role === 'moderator') {
            if (user.permissions && user.permissions.includes(requiredPermission)) {
                return next();
            }
            return res.status(403).send('You do not have the required permission to access this action.');
        }
        return res.status(403).send('You do not have permission to access this action.');
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid or missing token.');
    }
};

module.exports = checkAuthorization;
