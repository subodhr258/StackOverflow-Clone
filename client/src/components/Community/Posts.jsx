import React from "react";
import Post from "./Post";
import "./Posts.css";
import { useSelector } from "react-redux";

const Posts = () => {
  const postsList = useSelector((state) => state.postsReducer).reverse();
  console.log("postsList:", postsList);
  return (
    <div className="posts">
      {postsList.map((post) => (
        <Post postDetails={post} />
      ))}
    </div>
  );
};

export default Posts;
