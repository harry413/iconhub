import dotenv from "dotenv"
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import path from "path";
import Icons from "./routes/iconRoutes.js";
import Users from "./routes/userRoutes.js"; 
import Admin from "./routes/adminRoutes.js"

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(cors({
  origin: "http://localhost:5173", // Or your specific frontend URL
  credentials: true,
  exposedHeaders: ['Authorization', ['authorization']] // Ensure headers aren't blocked
}));
app.use(express.json())

mongoose
.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then(() => console.log("mongodb connected!!!"))
  .catch((err) => console.log("connection error in mongodb", err));

  app.get('/' ,(req, res) => {
    console.log("hello frnds!!!!!");
  })
  
  app.use('/api/icons', Icons);
  app.use('/api/users', Users);
  app.use('/api/admin', Admin);
// app.use("/uploads", express.static(path.join(__dirname, "../client/src/pages/uploads")));

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(
            path.join(__dirname, '../client/build', 'index.html'))
         });
}


app.listen(PORT, () => 
    console.log(`server running on port:${PORT}`)
)