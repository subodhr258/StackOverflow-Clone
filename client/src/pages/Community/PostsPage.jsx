import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import CommunityNavbar from "./CommunityNavbar";
import Posts from "../../components/Community/Posts";

const PostsPage = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>StackOverflow Posts Page</h1>
        <CommunityNavbar />
        <Posts/>
      </div>
    </div>
  );
};

export default PostsPage;
