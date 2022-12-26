import React from "react";
import HeartRegular from "../../assets/heart-regular.svg";
import SampleImage from "../../assets/Posts/sample.jpeg";

const baseURL = "http://localhost:5000";
// const baseURL: "https://stackoverflow-backend-1afp.onrender.com/";

const Post = ({ postDetails }) => {
  console.log(SampleImage);
  return (
    <div className="post">
      <h3>{postDetails.ownerName}</h3>
      {
        postDetails.isVideo ? (
          <video className="image-posted" controls>
            <source src={`${baseURL}/posts/${postDetails.fileId}`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`${baseURL}/posts/${postDetails.fileId}`}
            alt="regular version"
            className="image-posted"
          />
        )
      }
      <div className="likes-div">
        <img className="like-btn" src={HeartRegular} alt="like" width="18" />
        <h4>{postDetails.likes.length} likes</h4>
      </div>
    </div>
  );
};

export default Post;
