import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import { generateToken } from "./auth.js";

export const googleAuth = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true,
        scope: ["profile", "email"],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await User.findOne({ email });

          if (!user) {
            // Create new user if doesn't exist
            user = new User({
              username: profile.displayName,
              email,
              googleId: profile.id,
              isVerified: true,
              avatar: profile.photos[0]?.value,
            });
            await user.save();
          } else if (!user.googleId) {
            // Add Google ID to existing user
            user.googleId = profile.id;
            user.avatar = profile.photos[0]?.value;
            await user.save();
          }

          const token = generateToken(user);
          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};
