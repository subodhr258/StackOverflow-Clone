import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Questions from "./pages/Questions/Questions";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import DisplayQuestion from "./pages/Questions/DisplayQuestion";
import Tags from "./pages/Tags/Tags";
import Users from "./pages/Users/Users";
import UserProfile from "./pages/UserProfile/UserProfile";
import Community from "./pages/Community/Community";
import PostsPage from "./pages/Community/PostsPage";
import CreatePage from "./pages/Community/CreatePage";
import FriendsPage from "./pages/Community/FriendsPage";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Auth/:isSignup" element={<Auth />} />
      <Route path="/Questions" element={<Questions />} />
      <Route path="/AskQuestion" element={<AskQuestion />} />
      <Route path="/Questions/:id" element={<DisplayQuestion />} />
      <Route path="/Tags" element={<Tags />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/Users/:id" element={<UserProfile />} />
      <Route path="/Community" element={<Community />} />
      <Route path="/Community/Posts" element={<PostsPage />} />
      <Route path="/Community/Create" element={<CreatePage />} />
      <Route path="/Community/Friends" element={<FriendsPage />} />
    </Routes>
  );
};

export default AllRoutes;
