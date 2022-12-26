import React, { useState } from "react";
import axios from "axios";
import LoadingDots from "../../assets/loading-dots.gif";
import "./Create.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllPosts } from "../../actions/posts";
import { useDispatch } from "react-redux";
const baseURL = "http://localhost:5000";
// const baseURL: "https://stackoverflow-backend-1afp.onrender.com/";
const API = axios.create({
  baseURL: baseURL,
});

const Create = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [progress, setProgress] = useState(null);
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append("image", file, file.name);
    fd.append("userId", User.result._id);
    fd.append("userName", User.result.name);
    API.post(
      "/posts/upload",
      // { fd, UserId: User.result._id },
      fd,
      {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            "upload progress",
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      }
    )
      .then(({ data }) => {
        setImageId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
        navigate("/Community/Posts");
        dispatch(fetchAllPosts());
      })
      .catch((err) => {
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
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      });
  };

  const handleClick = () => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      fileUploadHandler();
    }
  };
  return (
    <div className="regular">
      <div className="image-section">
        {imageId ? (
          <>
            {/* <p>{imageId}</p> */}
            <video width="320" height="240" controls>
              <source
                src={`${baseURL}/posts/${imageId}`}
                type="video/mp4"
              />
            </video>
            <img
              src={`${baseURL}/posts/${imageId}`}
              alt="regular version"
              className="image"
            />
            <a
              className="link"
              href={`${baseURL}/posts/${imageId}`}
              target="_blank"
            >
              link
            </a>
          </>
        ) : (
          <p className="nopic">no pic yet</p>
        )}
      </div>
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
              {file ? "UPLOAD" : "POST"}
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default Create;
