import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Thumbnail({ videoPath }) {
  const [uploadTime, setUploadTime] = useState("Upload Time");
  const [rename, setRename] = useState(false);
  const [remove, setRemove] = useState(false);
  const videoNameRef = useRef();
  const [videoname, setVideoName] = useState(videoPath);
  const [deleted, setDeleted] = useState(false);
  let displayName = videoname.substring(0, videoname.length - 4);
  displayName = displayName.substring(10, displayName.length);

  useEffect(() => {
    getUploadTime();
    console.log("Path here: " + videoPath);
  }, []);

  async function getUploadTime() {
    let videoName = videoname.substring(10, videoname.length);
    videoName = videoName.substring(0, videoName.length - 3) + "mp4";

    await axios
      .post(
        "https://penguin-tube.000webhostapp.com/getUploadTime.php",
        videoName
      )
      .then((response) => {
        if (response.data.response_code === 200) {
          setUploadTime(response.data.upload_time);
        } else {
          console.log("getUploadTime Response code not 200");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function renameVideoFile(e) {
    e.preventDefault();
    console.log("Cliked");
    console.log(videoNameRef?.current?.value);
    console.log(videoname);
    if (rename) {
      let videoName = videoname.substring(10, videoname.length);
      videoName = videoName.substring(0, videoName.length - 3) + "mp4";
      console.log("rename: " + videoName);
      await axios
        .post(
          "http://localhost:3001/renameVideoFile",
          {
            oldVideoName: videoName,
            newVideoName: videoNameRef.current.value + ".mp4",
          },
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            let videoName =
              "thumbnail-" +
              response.data.substring(0, response.data.length - 4) +
              ".png";
            console.log(videoName);
            displayName = "sdfdsfds";
            setVideoName(videoName);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setRename(!rename);
  }

  async function removeVideoFile(e) {
    e.preventDefault();
    console.log("Clicked delete");
    console.log(remove);
    if (remove) {
      let videoName = videoname.substring(10, videoname.length);
      videoName = videoName.substring(0, videoName.length - 3) + "mp4";
      await axios
        .post(
          "http://localhost:3001/deleteVideoFile",
          {
            videoName,
            thumbnailName: videoname,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setDeleted(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setRemove(!remove);
  }

  function cancelRename() {
    setRename(false);
  }

  function cancelRemove() {
    setRemove(false);
  }

  if (!deleted) {
    return (
      <div>
        <Link to="/videoPage" state={{ videoPath: videoname, uploadTime }}>
          <img
            className="home-page-thumbnail"
            src={`http://localhost:3001/uploads/thumbnails/${videoPath}`}
            alt="Image"
          />
        </Link>
        <p className="videoTitle">{displayName}</p>
        <br></br>
        {rename && (
          <form onSubmit={renameVideoFile}>
            <label>
              New Video Name:
              <input
                ref={videoNameRef}
                type="text"
                name="newVideoName"
                required
              />
            </label>
            <button>Rename</button>
            <button onClick={cancelRename}>Cancel</button>
            {/* <p className="rename-alert">
              Don't use a space or any special character in the name!
            </p> */}
          </form>
        )}
        {remove && (
          <form onSubmit={removeVideoFile}>
            <p className="remove-alert">
              Are you sure you want to delete this video?
            </p>
            <button>Delete</button>
            <button onClick={cancelRemove}>Cancel</button>
          </form>
        )}
        {!rename && !remove && (
          <div>
            <button onClick={renameVideoFile}>Rename</button>
            <button onClick={removeVideoFile}>Delete</button>
          </div>
        )}
        <p>{uploadTime}</p>
      </div>
    );
  } else {
    return <></>;
  }
}
