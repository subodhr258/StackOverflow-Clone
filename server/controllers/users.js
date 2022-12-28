import mongoose from "mongoose";
import User from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    const allUserDetails = [];
    allUsers.forEach((users) => {
      allUserDetails.push({
        _id: users._id,
        name: users.name,
        about: users.about,
        tags: users.tags,
        joinedOn: users.joinedOn,
        friends: users.friends,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User not found");
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true } // it will return the updated profile.
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const toggleFriend = async (req, res) => {
  const { id } = req.params; //friend user
  const { userId } = req.body; //current user
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("User Id invalid");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Friend Id invalid");
  }
  try {
    const user = await User.findById(userId);
    const friendIndex = user.friends.findIndex(
      (friendId) => friendId === String(id)
    );
    if (friendIndex === -1) {
      user.friends.push(id);
    } else {
      user.friends = user.friends.filter((friendId) => friendId !== id);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(405).json({ message: error.message });
  }
};
