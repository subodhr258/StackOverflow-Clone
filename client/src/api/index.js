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

export const logIn = (authData) => client.post("/user/login", authData);
export const signUp = (authData) => client.post("/user/signup", authData);

export const postQuestion = (questionData) =>
  client.post("/questions/Ask", questionData);
export const getAllQuestions = () => client.get("/questions/get");
export const deleteQuestion = (id) => client.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value, userId) =>
  client.patch(`/questions/vote/${id}`, { value, userId });

export const postAnswer = (id, noOfAnswers, answerBody, userAnswered, userId) =>
  client.patch(`/answer/post/${id}`, {
    noOfAnswers,
    answerBody,
    userAnswered,
    userId,
  });
export const deleteAnswer = (id, answerId, noOfAnswers) =>
  client.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

export const fetchAllUsers = () => client.get("/user/getAllUsers");
export const updateProfile = (id, updateData) =>
  client.patch(`/user/update/${id}`, updateData);
export const toggleFriend = (id, userId) =>
  client.patch(`user/friend/${id}`, { userId });

export const createPost = (fd) => client.post("/posts/upload", fd);
export const getAllPosts = () => client.get("/posts/get");
export const likePost = (id, userId) =>
  client.patch(`/posts/like/${id}`, { userId });
export const deletePost = (id, fileId) =>
  client.patch(`/posts/delete/${id}`, { fileId });

// Export the client for direct use
export { client };
