const express = require('express');
const router = express.Router();
const {registerClient,loginClient, logout,authenticateToken,changePassword, checkAuthAdmin, verifyEmail, forgotPassword,
    resetPassword, sendVerificationUserEmail
} = require('../controller/auth.controller');
const {createClientValidation,loginValidation} = require("../validators/userValidation");
const checkValidation = require("../middlewares/checkValidation");
const upload = require('../config/multerConfig');
const verifyToken = require("../middlewares/verifyToken");


router.get("/check-auth", verifyToken, authenticateToken)
router.get("/admin/checkAuth",verifyToken,checkAuthAdmin)
router.get('/send-verification-token',verifyToken, sendVerificationUserEmail)
router.post('/register',upload.none(), createClientValidation,checkValidation,registerClient);
router.post('/verify-email',upload.none(),verifyEmail)
router.post('/login', upload.none(),loginValidation,checkValidation,loginClient);
router.post('/logout',verifyToken,logout)
router.post('/changePassword',upload.none(),verifyToken,changePassword)
router.post('/forget-password',upload.none(),forgotPassword)
router.post('/reset-password/:token',upload.none(),resetPassword)

module.exports = router;
