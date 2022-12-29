import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import CommunityNavbar from "../../components/Community/CommunityNavbar";
import "./Community.css";
import CommunityPic from "../../assets/community.jpg";
const Community = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>StackOverflow Community Page</h1>
        <CommunityNavbar />
        <div className="com-container">
          <img src={CommunityPic} alt="" />
          <div className="com-welcome">WELCOME TO THE COMMUNITY PAGE</div>
        </div>
      </div>
    </div>
  );
};

export default Community;
