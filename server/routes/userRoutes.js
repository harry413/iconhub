import express from "express"
const router = express.Router();
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {authenticate} from "../middleware/auth.js";

import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

// Update user profile
router.put("/me", authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update password
router.put("/update-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update preferences
router.put("/preferences", authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferences: req.body },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Upload avatar
router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Delete old avatar if exists
      const user = await User.findById(req.user.userId);
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, "../", user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Update user with new avatar path
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = avatarPath;
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete account
router.delete("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete avatar file if exists
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "../", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // TEMPORARY ROUTE -CREATING FIRST ADMIN
// router.post('/make-admin', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOneAndUpdate(
//       { email },
//       { isAdmin: true },
//       { new: true }
//     );
    
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'User promoted to admin', user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//get all users (for admin purposes, if needed)
router.get('/', async (req, res) => {
  try {
    const user = await User.find().populate('username');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    
    // Create and send JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create verification token
    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    

    // Save token to user
    user.verificationToken = verificationToken;
    user.isVerified = false;
    await user.save();

    // Send verification email (pseudo-code)
    sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add email verification endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOneAndUpdate(
      { email: decoded.email, verificationToken: token },
      { isVerified: true, verificationToken: null },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});
// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user (protected route)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile (protected route)
router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add icon to favorites (protected route)
router.post('/favorites/:iconId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.favorites.includes(req.params.iconId)) {
      return res.status(400).json({ message: 'Icon already in favorites' });
    }

    user.favorites.push(req.params.iconId);
    await user.save();

    res.json({ message: 'Icon added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove icon from favorites (protected route)
router.delete('/favorites/:iconId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favorites = user.favorites.filter(
      favId => favId.toString() !== req.params.iconId
    );
    
    await user.save();

    res.json({ message: 'Icon removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('favorites')
      .select('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if icon is favorited
router.get('/favorites/:iconId/check', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const isFavorited = user.favorites.includes(req.params.iconId);
    res.json({ isFavorited });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;