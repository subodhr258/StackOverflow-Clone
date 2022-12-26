import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import CommunityNavbar from "../../components/Community/CommunityNavbar";
import "./Community.css";

const Community = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>StackOverflow Community Page</h1>
        <CommunityNavbar />
        This is the community page
      </div>
    </div>
  );
};

export default Community;
