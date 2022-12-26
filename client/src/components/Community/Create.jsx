import React, { useState } from "react";
import axios from "axios";
import LoadingDots from "../../assets/loading-dots.gif";
import "./Create.scss";
const Create = () => {
  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append("image", file, file.name);
    axios
      .post("/posts/upload", fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            "upload progress",
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
      .then(({ data }) => {
        setImageId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
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
          alert("db error");
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
            <p>{imageId}</p>
            <video width="320" height="240" controls>
              <source src={`/api/image/${imageId}`} type="video/mp4" />
            </video>
            <img
              src={`/api/image/${imageId}`}
              alt="regular version"
              className="image"
            />
            <a className="link" href={`/api/image/${imageId}`} target="_blank">
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
