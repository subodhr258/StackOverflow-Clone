import React from "react";
import HeartRegular from "../../assets/heart-regular.svg";
import SampleImage from "../../assets/Posts/sample.jpeg";
const Post = ({ postDetails }) => {
  console.log(SampleImage);
  return (
    <div className="post">
      <h3>{postDetails.userPosted}</h3>
      {/* <img className="image-posted" src={postDetails.imgUrl} alt="Posted IMG" /> */}
      <img className="image-posted" src={SampleImage} alt="Posted IMG" />
      <div className="likes-div">
        <img className="like-btn" src={HeartRegular} alt="like" width="18" />
        <h4>{postDetails.likes.length} likes</h4>
      </div>
    </div>
  );
};

export default Post;
