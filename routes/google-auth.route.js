// google-auth.route.js

const express = require("express");
const Router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
Router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

Router.get(
    "/auth/google/callback",
    (req, res, next) => {
        passport.authenticate("google", async (err, user) => {
            if (err) {
                // ⛔ Check if it's the "email already used" error
                if (err.type === "email_exists") {
                    return res.redirect(`${process.env.FRONTEND_URL}?error=email_exists`);
                }

                // Any other error
                return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
            }

            if (!user) {
                return res.redirect(`${process.env.FRONTEND_URL}?error=no_user`);
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "30d",
            });

            await User.findByIdAndUpdate(user._id, { status: "verified" }, { new: true });

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.redirect(`${process.env.FRONTEND_URL}?jwt=${token}`);
        })(req, res, next);
    }
);

module.exports = Router;
