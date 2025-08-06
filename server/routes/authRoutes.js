import express from "express";
import passport from "passport";
// import { googleAuth } from "../auth/googleStrategy.js";

const router = express.Router();

// Initialize Google Strategy
// googleAuth(passport);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
    session: false,
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&userId=${user._id}`
    );
  }
);

export default router;
