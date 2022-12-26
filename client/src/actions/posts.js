import * as api from "../api";

export const fetchAllPosts = () => async (dispatch) => {
  try {
    console.log("trying to get all posts...");
    const { data } = await api.getAllPosts();
    dispatch({ type: "FETCH_ALL_POSTS", payload: data });
  } catch (error) {
    console.log(error);
  }
};
