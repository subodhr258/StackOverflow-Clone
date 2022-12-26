import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import CommunityNavbar from "../../components/Community/CommunityNavbar";
import Friends from "../../components/Community/Friends";

const FriendsPage = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>StackOverflow Friends Page</h1>
        <CommunityNavbar />
        <Friends/>
      </div>
    </div>
  );
};

export default FriendsPage;
