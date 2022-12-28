import * as api from "../api";

export const fetchAllPosts = () => async (dispatch) => {
  try {
    const { data } = await api.getAllPosts();
    dispatch({ type: "FETCH_ALL_POSTS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const fileUploadHandler = ({
  fd,
  navigate,
  setFile,
  setCurrentlyUploading,
}) => async (dispatch) => {
  try {
    const { data } = await api.createPost(fd);
    setFile(null);
    setCurrentlyUploading(false);
    navigate("/Community/Posts");
    dispatch(fetchAllPosts());
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) {
      const errMsg = err.response.data;
      if (errMsg) {
        console.log(errMsg);
        alert(errMsg);
      }
    } else if (err.response.status === 500) {
      console.log("db error");
      alert("db error: ", err.response.data);
    } else {
      console.log("other error");
    }
    setCurrentlyUploading(false);
  }
};

export const likePost = (id, userId) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id, userId);
    dispatch(fetchAllPosts());
  } catch (error) {
    console.log(error);
  }
};
