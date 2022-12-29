import React from "react";
import HeartRegular from "../../assets/heart-regular.svg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { likePost } from "../../actions/posts";
import Avatar from "../Avatar/Avatar";

// const baseURL = "http://localhost:5000";
const baseURL = "https://stackoverflow-backend-1afp.onrender.com/";

const Post = ({ postDetails }) => {
  const User = useSelector((state) => state.currentUserReducer);
  const userId = User?.result?._id;
  let likedPost = false;
  if (postDetails.likes.findIndex((id) => id === userId) !== -1) {
    likedPost = true;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLike = () => {
    if (User === null) {
      alert("Login or Signup to like a post");
      navigate("/Auth");
    }
    dispatch(likePost(postDetails._id, User?.result?._id));
  };
  return (
    <div className="post">
      <Link to={`/Users/${postDetails.owner}`} className="post-username">
        <Avatar
          backgroundColor="#009dff"
          px="10px"
          py="5px"
          borderRadius="50px"
          color="white"
        >
          {postDetails?.ownerName.charAt(0).toUpperCase()}
        </Avatar>
        <h3>{postDetails?.ownerName}</h3>
      </Link>
      {postDetails.isVideo ? (
        <div className="post-box">
          <video className="image-posted" controls>
            <source
              src={`${baseURL}/posts/${postDetails.fileId}`}
              type="video/mp4"
            />
          </video>
        </div>
      ) : (
        <div className="post-box">
          <img
            src={`${baseURL}/posts/${postDetails.fileId}`}
            alt="post"
            className="image-posted"
          />
        </div>
      )}
      <div className="likes-div">
        {likedPost ? (
          <div className="like-btn-liked" onClick={handleLike}>
            ❤️
          </div>
        ) : (
          <img
            className="like-btn"
            src={HeartRegular}
            alt="like"
            onClick={handleLike}
          />
        )}

        <h4>
          {postDetails.likes.length} like
          {postDetails.likes.length === 1 ? null : "s"}
        </h4>
      </div>
      <div>Posted {moment(postDetails.datePosted).fromNow()}</div>
    </div>
  );
};

export default Post;
