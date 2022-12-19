import React from "react";
import Questions from "./Questions";

const QuestionsList = ({ questionsList }) => {
  return (
    <>
      {questionsList === null ? (
        <h1>Loading...</h1>
      ) : (
        questionsList.map((question) => (
          <Questions question={question} key={question._id} />
        ))
      )}
    </>
  );
};

export default QuestionsList;
