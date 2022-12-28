import React, { useState } from "react";
import LoadingDots from "../../assets/loading-dots.gif";
import "./Create.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fileUploadHandler } from "../../actions/posts";

const Create = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleClick = () => {
    if (User === null) {
      alert("Login or Signup to create a post");
      navigate("/Auth");
    }
    if (file) {
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("userId", User.result._id);
      fd.append("userName", User.result.name);
      setCurrentlyUploading(true);
      dispatch(
        fileUploadHandler({ fd, navigate, setFile, setCurrentlyUploading })
      );
    }
  };
  return (
    <div className="regular">
      <div>{file && <p className="file-info">This file contains: {file.name}</p>}</div>
      <div className="inputcontainer">
        {currentlyUploading ? (
          <img
            src={LoadingDots}
            className="loadingdots"
            alt="upload in progress"
          />
        ) : (
          <>
            <input
              className="file-input"
              onChange={handleFile}
              type="file"
              name="file"
              id="file"
            />
            <label
              className={`inputlabel ${file && "file-selected"}`}
              htmlFor="file"
              onClick={handleClick}
            >
              {file ? "POST" : "UPLOAD"}
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default Create;
