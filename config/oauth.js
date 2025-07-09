// oauth.js
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/User");

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
      new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://brikool-server-2.vercel.app/auth/google/callback",
          },
          async function (accessToken, refreshToken, profile, cb) {
            try {
              const existingUserWithGoogle = await UserModel.findOne({ googleId: profile.id });

              if (existingUserWithGoogle) {
                // Update secret and return
                existingUserWithGoogle.secret = accessToken;
                await existingUserWithGoogle.save();
                return cb(null, existingUserWithGoogle);
              }

              // ⚠️ Check if there's already a user with the same email (but without Google auth)
              const existingUserByEmail = await UserModel.findOne({ email: profile.emails[0].value });

              if (existingUserByEmail) {
                // Conflict: email used in native signup
                const error = new Error("Email already exists. Please log in using your password.");
                error.type = "email_exists";
                return cb(error, null); // ⛔ Pass error to passport callback
              }

              // ✅ No conflict, create new Google user
              const newUser = new UserModel({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
                password: accessToken,
                secret: accessToken,
              });

              const result = await newUser.save();
              return cb(null, result);
            } catch (err) {
              return cb(err, null);
            }
          }
      )
  );

};
