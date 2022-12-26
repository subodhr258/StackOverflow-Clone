import express from "express";
import auth from "../middlewares/auth.js";
import {uploadMiddleware} from "../controllers/Posts.js";
import {upload} from "../controllers/Posts.js";

const router = express.Router();
router.post("/upload", auth, uploadMiddleware, upload);
export default router;
