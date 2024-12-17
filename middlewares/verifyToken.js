const {verify} = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token expired or invalid" });
            }
            try {
                const user = await User.findById(decoded.userId).select('-password');

                if (!user) {
                    return res.status(404).json({ message: "User not found or invalid token" });
                }
                req.userId = user._id
                next()
            } catch (error) {

                return res.status(500).json({ message: "Error fetching user", error });
            }
        });
    }catch (e) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

module.exports = verifyToken