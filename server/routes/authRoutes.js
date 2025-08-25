import express from "express";
import { googleLogin } from "../auth/googleStrategy.js";

const router = express.Router();


router.post("/google", googleLogin);

export default router;
