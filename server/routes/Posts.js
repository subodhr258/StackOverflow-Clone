import express from "express";
import { getAllPosts, getPost, uploadPost } from "../controllers/Posts.js";
import { uploadMiddleware } from "../middlewares/post.js";

const router = express.Router();
router.get("/get", getAllPosts);
router.get("/:id", getPost);
router.post("/upload", uploadMiddleware, uploadPost);
export default router;
