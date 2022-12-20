import React from "react";
import "./LeftSidebar.css";
import { NavLink } from "react-router-dom";
import Globe from "../../assets/Globe.svg";

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <nav className="side-nav">
        <NavLink to="/" className="side-nav-links" activeclass="active">
          <p>Home</p>
        </NavLink>
        <div className="side-nav-div">
          <div className="side-nav-div2">
            {/* <p className="public">PUBLIC :-</p> */}
            <NavLink
              to="/Questions"
              className="side-nav-links"
              activeclass="active"
            >
              <img src={Globe} alt="Globe" />
              <p style={{ paddingLeft: "10px" }}>Questions</p>
            </NavLink>
            <NavLink to="/Tags" className="side-nav-links" activeclass="active">
              <p>Tags</p>
            </NavLink>
            <NavLink
              to="/Users"
              className="side-nav-links"
              activeclass="active"
            >
              <p>Users</p>
            </NavLink>
            <NavLink
              to="/Community"
              className="side-nav-links"
              activeclass="active"
            >
              <p>Community</p>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
