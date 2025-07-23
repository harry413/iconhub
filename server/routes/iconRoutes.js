// server/routes/iconRoutes.js
import express from "express"
const router = express.Router();
import Icon from "../models/icon.js"
import {authenticate} from "../middleware/auth.js";

import multer from "multer"
import path from "path"

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /svg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb('Error: Only SVG and PNG files are allowed!');
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all icons
router.get('/', async (req, res) => {
  try {
    const icons = await Icon.find()?.populate('createdBy', 'username');
    res.json(icons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query, category, sort, limit } = req.query;
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      searchQuery.category = category;
    }

    let sortOption = {};
    if (sort === 'popular') {
      sortOption = { downloads: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const icons = await Icon.find(searchQuery)
      .sort(sortOption)
      .limit(parseInt(limit) || 100)
      .populate('createdBy', 'username');

    res.json(icons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get icon by ID
router.get('/:id', async (req, res) => {
  try {
    const icon = await Icon.findById(req.params.id).populate('createdBy', 'username');
    if (!icon) return res.status(404).json({ message: 'Icon not found' });
    
    // Increment download count
    icon.downloads += 1;
    await icon.save();
    
    res.json(icon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new icon (protected)
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'svg', maxCount: 1 },
    { name: 'png', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files.svg || !req.files.png) {
        return res.status(400).json({ message: 'Both SVG and PNG files are required' });
      }

      const icon = new Icon({
        name: req.body.name,
        category: req.body.category,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        svg: req.files.svg[0].path,
        png: req.files.png[0].path,
        createdBy: req.user.userId
      });

      const newIcon = await icon.save();
      res.status(201).json(newIcon);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Advanced search

export default router;