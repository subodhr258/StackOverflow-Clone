import React from "react";

const Post = ({ postDetails }) => {
  return (
    <div>
      <img src={postDetails.imgUrl} alt="Posted IMG" />
      <h3>{postDetails.userPosted}</h3>
    </div>
  );
};

export default Post;
