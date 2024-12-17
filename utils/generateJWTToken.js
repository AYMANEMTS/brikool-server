const jwt = require("jsonwebtoken");

const generateJWTToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })

    res.cookie('jwt', token, {
        httpOnly: true, // cookie cannot be accessed by client side scripts
        secure: process.env.NODE_ENV === 'production', // cookie will only be set on https
        sameSite: 'strict', // cookie will only be set on the same site
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return token;
}
module.exports = generateJWTToken;