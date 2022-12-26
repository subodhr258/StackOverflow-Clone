import { combineReducers } from "redux";
import authReducer from "./auth.js";
import { currentUserReducer } from "./currentUser.js";
import { questionsReducer } from "./questions.js";
import { usersReducer } from "./users.js";
import { postsReducer } from "./posts.js";

export default combineReducers({
  authReducer,
  currentUserReducer,
  questionsReducer,
  usersReducer,
  postsReducer,
});
