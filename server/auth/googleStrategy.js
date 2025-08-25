import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import { generateToken } from "../middleware/auth.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: payload.name,
        email,
        googleId: payload.sub,
        avatar: payload.picture,
        isVerified: true,
      });
      await user.save();
    }

    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
