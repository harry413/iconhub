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
import Auth from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({origin : process.env.CLIENT_URL, credentials: true})); // Allow requests from the client URL and allow credentials
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


app.use("/api/icons", Icons);

app.use("/api/users", Users);

app.use("/api/admin", Admin);

app.use("/api/auth", Auth);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`server running on port:${PORT}`));

