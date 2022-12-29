import React from "react";
import { useLocation } from "react-router-dom";
import "./HomeMainbar.css";
import QuestionsList from "./QuestionsList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomeMainbar = () => {
  const questionsList = useSelector((state) => state.questionsReducer);

  const location = useLocation();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();
  const checkAuth = () => {
    if (User === null) {
      alert("login or signup to ask a question");
      navigate("/Auth");
    } else {
      navigate("/AskQuestion");
    }
  };
  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Questions</h1>
        ) : (
          <h1>All Questions</h1>
        )}
        <button onClick={checkAuth} className="ask-btn">
          Ask Question
        </button>
      </div>
      <div>
        {questionsList.data === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <p>{questionsList.data.length} questions</p>
            <QuestionsList questionsList={questionsList.data} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeMainbar;
