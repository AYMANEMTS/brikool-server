const jwt = require("jsonwebtoken");

const generateJWTToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })

    res.cookie('jwt', token, {
        httpOnly: true, 
        secure: false, 
        sameSite: 'None', 
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return token;
}
module.exports = generateJWTToken;