import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  likes: { type: [String], default: [] },
  fileId: {
    type: String,
    required: true,
  },
  isVideo: {
    type: Boolean,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Post", PostSchema);
