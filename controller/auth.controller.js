const  Users = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateJWTToken = require("../utils/generateJWTToken");
const generateVerificationToken = require("../utils/generateVerificationToken");
const { sendVerificationEmail } = require("../config/resend/email");
const {sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail} = require("../config/resend/email");


const registerClient = async (req, res) => {
    try {
        const {name,email,password,city} = req.body;
        const verificationToken = generateVerificationToken();
        const client = await Users.create({
            name,email,password,city,verificationToken,
            verificationExpires: Date.now() + 60 * 60 * 1000
        })
        const token = generateJWTToken(res, client._id)
        await sendVerificationEmail(email, verificationToken)
        res.status(200).json({user:{...client._doc,password: undefined},jwt: token})
    }catch (e) {
        console.log(e)
        res.status(500).json({error: e})
    }
}

const sendVerificationUserEmail = async (req,res) => {
    try {
        const user = await Users.findById(req.userId)
        if (user.verificationToken) {
            if (user.verificationExpires > Date.now()) {
                return res.status(200).json({
                    success: true,
                    message: "A verification token has already been sent and is still valid."
                });
            }
        }
        const token = generateVerificationToken();
        user.verificationToken = token;
        user.verificationExpires = Date.now() + 60 * 60 * 1000
        await user.save()
        await sendVerificationEmail(user.email, token)
        res.status(200).json({success:true,message:"Verification token send successfully"})
    }catch (e) {
        res.status(500).json({error: e})
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await Users.findOne({
            verificationToken: token,
            verificationExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }
        user.status = "verified";
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ success: true, message: "Email verified successfully", user: {...user._doc, password: undefined} });
    } catch (error) {
        console.log("error verifying email", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const loginClient = async (req, res) => {
    const {t} = req;
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user || (!await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({ message: t('incorrectEmailOrPassword') })
        }
        const token = generateJWTToken(res, user._id)
        return res.status(200).json({user: {...user._doc,password: undefined},jwt: token})
    }catch (e) {
        console.log(e)
        res.status(500).json({error: e})
    }
}

const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "logout success"})
    }catch (e) {
        res.status(500).json({error: e})
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.googleId){
            return res.status(200).json({success: false, redirect: true,
                url: "/auth/google",
                message: "User is signed in with Google. Redirecting..."
            });
        }
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() +  60 * 60 * 1000;
        await user.save();
        await sendPasswordResetEmail(user.email,
            `${process.env.FRONTEND_URL}?reset-password=true&token=${resetPasswordToken}`
        );
        res.status(200).json({success: true, message: "Password reset email sent successfully!",});
    } catch (error) {
        console.log("error sending password reset email", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await Users.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        user.password = newPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("error resetting password", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body
        const user = await Users.findById(req.userId)
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: req.t('current_password_incorrect') });
        }
        user.password = newPassword
        await user.save()
        return res.status(200).json({ message: req.t('password_changed_successfully'),user });

    } catch (error) {
        res.status(500).json({error: e})
    }
}

const authenticateToken = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select('-password');
        return res.status(200).send({ message: "Token has been checked successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error });
    }
};

const checkAuthAdmin = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select('-password');
        if (!['admin', 'moderator'].includes(user.role)) {
            return res.status(403).json({ error: 'Insufficient role permissions' });
        }
        return res.status(200).send({ message: "Token has been checked successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error });
    }
};

module.exports = {
    registerClient,loginClient,logout,authenticateToken,changePassword,checkAuthAdmin,
    verifyEmail,forgotPassword,resetPassword,sendVerificationUserEmail
};
