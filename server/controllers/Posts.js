import mongoose from "mongoose";
import path from "path";
import Posts from "../models/Post.js";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.CONNECTION_URL;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});

export const uploadPost = async (req, res) => {
  const { file } = req;
  const { id } = file;
  const { userId } = req.body;
  const { userName } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("invalid id");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("invalid UserId");
  }
  if (file.size > 20000000) {
    deleteImage(id);
    return res.status(400).send("file may not exceed 20MB");
  }
  try {
    const videofiletypes = /mp4|mkv/;
    const isVideo = videofiletypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const newPost = await Posts.create({
      owner: userId,
      fileId: id,
      isVideo: isVideo,
      ownerName: userName,
    });
    res.send(file.id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const deleteImage = (id) => {
  if (!id || id === "undefined") return res.status(400).send("no image id");
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return err;
  });
};

export const getPost = async ({ params: { id } }, res) => {
  if (!id || id === "undefined") return res.status(400).send("no image id");
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(400).send("no files exist");
    gfs.openDownloadStream(_id).pipe(res);
  });
};

export const getAllPosts = async (req, res) => {
  try {
    const PostList = await Posts.find().sort({ datePosted: -1 });
    PostList.map;
    res.status(200).json(PostList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "id not found" });
  }
  try {
    const post = await Posts.findById(_id);
    const likeIndex = post.likes.findIndex((id) => id === String(userId));
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }
    await Posts.findByIdAndUpdate(_id, post);
    res.status(200).json({ message: "likes updated successfully" });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { fileId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid Post ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(404).json({ message: "Invalid File ID" });
  }
  try {
    const _id = new mongoose.Types.ObjectId(fileId);
    gfs.delete(_id, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
      }
    });
    await Posts.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
