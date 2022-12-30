import axios from "axios";

export const searchResult = (req) => async (dispatch) => {
  const params = {
    key: "AIzaSyAYYSh_FhFEypmyWsqLttL7idnOJAwd0uc",
    cx: "85257571d4b5c4129",
    q: `${req}`,
  };
  try {
    const data = await axios.get(
      "https://www.googleapis.com/customsearch/v1?",
      {
        params: params,
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
