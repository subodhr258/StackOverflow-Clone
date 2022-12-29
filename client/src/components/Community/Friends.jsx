import React from "react";
import { useSelector } from "react-redux";
import Friend from "./Friend";
import "./Friends.css";
import { Link } from "react-router-dom";
const Friends = () => {
  const users = useSelector((state) => state.usersReducer);
  const userId = useSelector((state) => state.currentUserReducer)?.result._id;
  const currentUser = users.filter((user) => user?._id === userId)[0];
  const friends = users.filter(
    (user) =>
      currentUser?.friends?.findIndex((friendId) => friendId === user._id) !==
      -1
  );
  return (
    <div className="friends-container">
      {userId ? (
        <>
          <h1>Your Friends:</h1>
          {friends.length ? friends.map((friend) => (
            <Friend friendDetails={friend} key={friend._id} />
          )) : <h3>No friends yet. Add friends and you'll see their posts here!</h3>}
        </>
      ) : (
        <Link to="/Auth">Please Login or Signup to see your friends</Link>
      )}
    </div>
  );
};

export default Friends;
