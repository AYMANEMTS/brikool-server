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
        callbackURL: "http://localhost:8000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          let user = await UserModel.findOne({ googleId: profile.id });
          if (user) {
            user = await UserModel.findOneAndUpdate(
              { _id: user._id },
              { secret: accessToken },
              { new: true }
            );
            return cb(null, user);
          } else {
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
          }
        } catch (err) {
          return cb(err, null);
        }
      }
    )
  );
};