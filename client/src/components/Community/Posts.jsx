import React from "react";
import Post from "./Post";
import "./Posts.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const users = useSelector((state) => state.usersReducer);
  const userId = useSelector((state) => state.currentUserReducer)?.result?._id;
  const currentUser = users.filter((user) => user?._id === userId)[0];
  const postsList = useSelector((state) => state.postsReducer);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [filteredPostsList, setFilteredPostsList] = useState(postsList);
  // let filteredPostsList = postsList;
  const handleAll = () => {
    setFilter("all");
    setFilteredPostsList(postsList);
  };
  const handleFriends = () => {
    if (userId === undefined) {
      alert("Login or Signup to answer a question");
      navigate("/Auth");
    }
    setFilter("friends");
    setFilteredPostsList(
      postsList.filter(
        (post) =>
          currentUser?.friends?.findIndex((id) => id === post.owner) !== -1
      )
    );
  };
  const handleMyPosts = () => {
    if (userId === undefined) {
      alert("Login or Signup to answer a question");
      navigate("/Auth");
    }
    setFilter("myposts");
    setFilteredPostsList(
      postsList.filter((post) => post.owner === currentUser?._id)
    );
  };
  useEffect(() => {
    setFilteredPostsList(postsList);
  }, [postsList]);

  return (
    <div className="posts-container">
      <div className="posts-filter">
        <div className="posts-filter-header">
          <h3>Filters</h3>
          <FontAwesomeIcon icon={faSliders} />
        </div>

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
        {filteredPostsList.length ? (
          filteredPostsList.map((post) => (
            <Post postDetails={post} key={post._id} />
          ))
        ) : (
          <h3>0 Posts</h3>
        )}
      </div>
    </div>
  );
};

export default Posts;
