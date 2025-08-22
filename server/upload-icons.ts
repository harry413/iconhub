import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// ✅ Load env variables
dotenv.config();

// ✅ Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = "test";
const COLLECTION = "icons";

// ✅ Icons directory
const ICONS_DIR = path.join(__dirname, "icons"); // <-- folder where your .tsx files are

async function uploadIcons() {
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // read .tsx files
    const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith(".tsx"));

    for (const file of files) {
      const filePath = path.join(ICONS_DIR, file);
      const code = fs.readFileSync(filePath, "utf-8");

      const iconName = path.basename(file, ".tsx");

      // Upsert (insert or update if exists)
      await collection.updateOne(
        { name: iconName },
        { $set: { name: iconName, code } },
        { upsert: true }
      );

      console.log(`✅ Uploaded ${iconName}`);
    }
  } catch (err) {
    console.error("❌ Error uploading icons:", err);
  } finally {
    await client.close();
  }
}

uploadIcons();
