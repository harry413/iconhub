// seedIcons.js
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

// Categories for icons
const categories = [
  'social',
  'business',
  'technology',
  'education',
  'health',
  'food',
  'travel',
  'weather',
  'finance',
  'shopping',
  'communication',
  'media',
  'security',
  'home',
  'transportation',
  'science',
  'sports',
  'gaming',
  'nature',
  'clothing'
];

// Common tags
const commonTags = [
  'popular',
  'new',
  'free',
  'outline',
  'filled',
  'color',
  'minimal',
  'modern',
  'classic',
  'trending'
];

// Sample users (you should replace with actual user IDs from your database)
const sampleUsers = [
  '65a1b2c3d4e5f6a1b2c3d4e5', // Admin user
  '65a1b2c3d4e5f6a1b2c3d4e6', // Regular user 1
  '65a1b2c3d4e5f6a1b2c3d4e7'  // Regular user 2
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Icon model
const Icon = mongoose.model('Icon', new mongoose.Schema({
  name: String,
  category: String,
  tags: [String],
  svg: String,
  png: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  downloads: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

// Sample SVG content (in a real app, you would use actual SVG files)
const sampleSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
</svg>`;

// Sample PNG path (in a real app, you would use actual PNG files)
const samplePNG = '/uploads/icons/icon.png';

// Generate random icon data
const generateIcons = async (count = 200) => {
  const icons = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate 3-5 random tags
    const tags = [...commonTags]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 3));
    
    // Add category-specific tags
    tags.push(category);
    
    icons.push({
      name: `Icon ${i}`,
      category,
      tags,
      svg: sampleSVG.replace('currentColor', `#${Math.floor(Math.random()*16777215).toString(16)}`),
      png: samplePNG,
      createdBy: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
      downloads: Math.floor(Math.random() * 1000),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      updatedAt: new Date()
    });
  }
  
  try {
    // Clear existing icons
    await Icon.deleteMany({});
    console.log('Cleared existing icons');
    
    // Insert new icons
    const result = await Icon.insertMany(icons);
    console.log(`Successfully inserted ${result.length} icons`);
    
    // Create indexes
    await Icon.createIndexes();
    console.log('Created indexes');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Run the script
generateIcons(200);