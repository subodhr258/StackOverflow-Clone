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
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
  },
  fileId: {
    type: String,
    required: true,
  },
  isVideo: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Post", PostSchema);
