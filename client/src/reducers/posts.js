export const postsReducer = (states = [], action) => {
  switch (action.type) {
    case "FETCH_ALL_POSTS":
      return action.payload;
    default:
      return states;
  }
};
