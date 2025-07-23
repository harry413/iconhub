import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import Icons from "./routes/iconRoutes.js";
import Users from "./routes/userRoutes.js";
import Admin from "./routes/adminRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected!!!"))
  .catch((err) => console.log("connection error in mongodb", err));

app.get("/", (req, res) => {
  res.send("Welcome to Icon Library API");
  console.log("hello frnds!!!!!");
});
console.log("Mounting icons...");
app.use("/api/icons", Icons);
console.log("Mounting users...");
app.use("/api/users", Users);
console.log("Mounting admin...");
app.use("/api/admin", Admin);
// app.use("/uploads", express.static(path.join(__dirname, "../client/src/pages/uploads")));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`server running on port:${PORT}`));

