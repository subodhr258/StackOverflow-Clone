import React from "react";
import Post from "./Post";
import "./Posts.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const Posts = () => {
  const users = useSelector((state) => state.usersReducer);
  const userId = useSelector((state) => state.currentUserReducer)?.result._id;
  const currentUser = users.filter((user) => user?._id === userId)[0];
  const postsList = useSelector((state) => state.postsReducer);
  console.log("posts:", postsList);
  const [filter, setFilter] = useState("all");
  const [filteredPostsList, setFilteredPostsList] = useState(postsList);
  // let filteredPostsList = postsList;
  const handleAll = () => {
    setFilter("all");
    setFilteredPostsList(postsList);
  };
  const handleFriends = () => {
    setFilter("friends");
    setFilteredPostsList(
      postsList.filter(
        (post) =>
          currentUser?.friends?.findIndex((id) => id === post.owner) !== -1
      )
    );
  };
  const handleMyPosts = () => {
    setFilter("myposts");
    setFilteredPostsList(
      postsList.filter((post) => post.owner === currentUser._id)
    );
  };
  useEffect(() => {
    setFilteredPostsList(postsList);
  }, [postsList]);

  return (
    <div className="posts-container">
      <div className="posts-filter">
        <button
          className={
            filter === "all"
              ? `posts-filter-btn btn-selected`
              : `posts-filter-btn`
          }
          onClick={handleAll}
        >
          All users
        </button>
        <button
          className={
            filter === "friends"
              ? `posts-filter-btn btn-selected`
              : `posts-filter-btn`
          }
          onClick={handleFriends}
        >
          My Friends
        </button>
        <button
          className={
            filter === "myposts"
              ? `posts-filter-btn btn-selected`
              : `posts-filter-btn`
          }
          onClick={handleMyPosts}
        >
          My Posts
        </button>
      </div>
      <div className="posts">
        {filteredPostsList.map((post) => (
          <Post postDetails={post} key={post._id} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
