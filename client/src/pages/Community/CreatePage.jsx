import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import CommunityNavbar from "../../components/Community/CommunityNavbar";
import Create from "../../components/Community/Create";

const CreatePage = () => {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>StackOverflow Create Page</h1>
        <CommunityNavbar />
        <Create />
      </div>
    </div>
  );
};

export default CreatePage;
