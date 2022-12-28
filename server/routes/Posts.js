import express from "express";
import {
  getAllPosts,
  getPost,
  likePost,
  uploadPost,
} from "../controllers/Posts.js";
import { uploadMiddleware } from "../middlewares/post.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
router.get("/get", getAllPosts);
router.get("/:id", getPost);
router.post("/upload", uploadMiddleware, uploadPost);
router.patch("/like/:id", auth, likePost);
export default router;
