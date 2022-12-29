import React from "react";
import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";

const Friend = ({friendDetails}) => {
  return (
    <div className="friend-container">
      <Link to={`/Users/${friendDetails._id}`} className="post-username">
        <Avatar
          backgroundColor="#009dff"
          px="10px"
          py="5px"
          borderRadius="50px"
          color="white"
        >
          {friendDetails?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <h3>{friendDetails?.name}</h3>
      </Link>
    </div>
  );
};

export default Friend;
