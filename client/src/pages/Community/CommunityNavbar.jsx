import React from "react";
import { NavLink } from "react-router-dom";

const CommunityNavbar = () => {
  return (
    <nav className="com-main-nav">
      <div className="com-navbar">
        <NavLink to="/Community/Posts" className="com-nav-item" activeclass="active">
          Posts
        </NavLink>
        <NavLink to="/Community/Create" className="com-nav-item" activeclass="active">
          Create
        </NavLink>
        <NavLink to="/Community/Friends" className="com-nav-item" activeclass="active">
          Friends
        </NavLink>
      </div>
    </nav>
  );
};

export default CommunityNavbar;
