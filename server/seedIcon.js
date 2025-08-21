import mongoose from "mongoose";
import dotenv from "dotenv";
import Icon from "./models/icon.js"; // Import your Icon model

dotenv.config();

// MongoDB connection
await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("✅ Connected to MongoDB");

// Simple SVG generator
function randomSvg(id) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)"/>
      <text x="50%" y="50%" font-size="20" text-anchor="middle" fill="white" dy=".3em">${id}</text>
    </svg>
  `;
}

// Generate 100 random icons
const icons = Array.from({ length: 1000 }, (_, i) => {
  const categories = ["arrows", "shapes", "ui", "social"];
  return {
    name: `Icon-${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    tags: ["random", "test", `tag${i}`],
    svg: randomSvg(i + 1), // generated SVG string
    png: `https://picsum.photos/seed/icon${i}/1000/1000`, // random PNG placeholder
    createdBy: null, // can set a valid User _id if you want
    downloads: Math.floor(Math.random() * 1000),
  };
});

// Insert into DB
await Icon.insertMany(icons);

console.log("🎉 1000 random icons inserted!");
await mongoose.disconnect();
