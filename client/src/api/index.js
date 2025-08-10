import axios from "axios";
import client from "./client";

const API = axios.create({
  baseURL: "https://stackoverflow-backend-1afp.onrender.com/",
  // baseURL: "http://localhost:5000/",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

// Authentication endpoints (keep using direct axios for login/signup)
export const logIn = (authData) => API.post("/user/login", authData);
export const signUp = (authData) => API.post("/user/signup", authData);

// Question endpoints - use batching for POST, caching for GET
export const postQuestion = (questionData) =>
  client.post("/questions/Ask", questionData);
export const getAllQuestions = () => client.get("/questions/get");
export const deleteQuestion = (id) => client.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value, userId) =>
  client.patch(`/questions/vote/${id}`, { value, userId });

// Answer endpoints - use batching for POST
export const postAnswer = (id, noOfAnswers, answerBody, userAnswered, userId) =>
  client.patch(`/answer/post/${id}`, {
    noOfAnswers,
    answerBody,
    userAnswered,
    userId,
  });
export const deleteAnswer = (id, answerId, noOfAnswers) =>
  client.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

// User endpoints - use caching for GET
export const fetchAllUsers = () => client.get("/user/getAllUsers");
export const updateProfile = (id, updateData) =>
  client.patch(`/user/update/${id}`, updateData);
export const toggleFriend = (id, userId) =>
  client.patch(`user/friend/${id}`, { userId });

// Post endpoints - use batching for POST, caching for GET
export const createPost = (fd) => client.post("/posts/upload", fd);
export const getAllPosts = () => client.get("/posts/get");
export const likePost = (id, userId) =>
  client.patch(`/posts/like/${id}`, { userId });
export const deletePost = (id, fileId) =>
  client.patch(`/posts/delete/${id}`, { fileId });

// Search endpoints with debouncing
export const searchQuestions = (query) =>
  client.get("/api/search", { params: { q: query } });
export const autocompleteSearch = (query) =>
  client.get("/api/autocomplete", { params: { q: query } });

// Utility functions for cache management
export const clearAPICache = () => client.clearCache();
export const clearQuestionCache = () => client.clearCachePattern("questions");
export const clearUserCache = () => client.clearCachePattern("user");
