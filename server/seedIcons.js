import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Icon from "./models/icon.js";

dotenv.config();

// MongoDB connection
await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("✅ Connected to MongoDB");

// Folder where your icons are stored
const iconsDir = path.join(process.cwd(), "out");

// Read all files in folder
const files = fs.readdirSync(iconsDir);

// Group by basename (arrow1.svg + arrow1.png -> one icon)
const grouped = {};
files.forEach((file) => {
  const ext = path.extname(file); // .svg or .png
  const base = path.basename(file, ext); // e.g. "arrow1"

  if (!grouped[base]) grouped[base] = {};
  grouped[base][ext.replace(".", "")] = file;
});

// Prepare icon docs
const icons = Object.keys(grouped).map((name, i) => {
  const svgFile = grouped[name].svg
    ? fs.readFileSync(path.join(iconsDir, grouped[name].svg), "utf8")
    : null;

  const pngFile = grouped[name].png
    ? fs.readFileSync(path.join(iconsDir, grouped[name].png)).toString("base64")
    : null;

  return {
    name,
    category: i % 2 === 0 ? "shapes" : "arrows", // assign categories however you like
    tags: [name, "icon"],
    svg: svgFile,
    png: pngFile ? `data:image/png;base64,${pngFile}` : null, // embed PNG as base64
    createdBy: null,
    downloads: Math.floor(Math.random() * 100),
  };
});

// Insert into DB 
await Icon.insertMany(icons);

console.log(`🎉 Inserted ${icons.length} icons from files!`);
await mongoose.disconnect();
