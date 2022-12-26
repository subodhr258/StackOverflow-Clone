import React from "react";
import Post from "./Post";
import './Posts.css';

const Posts = () => {
  const postData = [
    {
      id: "1",
      image: true,
      imgUrl:
        "https://images.pexels.com/photos/11586570/pexels-photo-11586570.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      videoUrl: "",
      userPosted: "Subodh",
      likes: [],
    },
    {
      id: "2",
      image: true,
      imgUrl:
        "https://images.pexels.com/photos/14143253/pexels-photo-14143253.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      videoUrl: "",
      userPosted: "User 2",
      likes: [],
    },
    {
      id: "3",
      image: true,
      imgUrl:
        "https://images.pexels.com/photos/10411848/pexels-photo-10411848.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      videoUrl: "",
      userPosted: "User 3",
      likes: [],
    },
  ];
  return (
    <div className="posts">
      {postData.map((post) => (
        <Post postDetails={post} />
      ))}
    </div>
  );
};

export default Posts;
