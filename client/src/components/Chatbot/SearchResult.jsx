import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchResult } from "../../actions/chatbot";

const SearchResult = (props) => {
  const { steps } = props;
  const dispatch = useDispatch();
  const [result, setResult] = useState("");
  const handleSearch = () => {
    dispatch(searchResult(steps.userInput.message)).then((res) => {
      setResult(res.data);
    });
  };

  return (
    <div>
      <h1>Here are my answers for "{steps.userInput.message}"</h1>
      <button onClick={handleSearch} className="get-results-btn">getResults</button>
      <ol>
        {result?.items?.slice(0, 5).map((item) => (
          <li key={item?.link}>
            <h3>{item?.title}</h3>
            <p>{item?.snippet}</p>
            <a href={item?.link} target="_blank">
              Click here for more info
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default SearchResult;
