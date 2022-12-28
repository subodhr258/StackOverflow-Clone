import React, { useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Avatar from "../../components/Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faPen,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import "./UserProfile.css";
import { toggleFriend } from "../../actions/users";
const UserProfile = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);
  const currentProfile = users.filter((user) => user?._id === id)[0];
  const userId = useSelector((state) => state.currentUserReducer)?.result._id;

  const currentUser = users.filter((user) => user?._id === userId)[0];
  const [Switch, setSwitch] = useState(false);
  const dispatch = useDispatch();
  let isFriend = true;
  if (
    currentUser?.friends?.findIndex((friendId) => friendId === id) ===
    -1
  ) {
    isFriend = false;
  }
  const handleToggleFriend = () => {
    dispatch(toggleFriend(currentProfile?._id, currentUser?._id));
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentProfile?.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentProfile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "}
                  {moment(currentProfile?.joinedOn).fromNow()}
                </p>
              </div>
            </div>
            {currentUser?.result?._id === id ? (
              <button
                type="button"
                onClick={() => setSwitch(true)}
                className="edit-profile-btn"
              >
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            ) : isFriend ? (
              <button className="add-friend-btn" onClick={handleToggleFriend}>
                <p>Remove Friend</p>
              </button>
            ) : (
              <button className="add-friend-btn" onClick={handleToggleFriend}>
                <FontAwesomeIcon icon={faUserPlus} />
                <p>Add Friend</p>
              </button>
            )}
          </div>
          <>
            {Switch ? (
              <EditProfileForm
                currentUser={currentUser}
                setSwitch={setSwitch}
              />
            ) : (
              <ProfileBio currentProfile={currentProfile} />
            )}
          </>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
