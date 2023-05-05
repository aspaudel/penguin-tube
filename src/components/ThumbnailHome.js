import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Thumbnail({ videoPath }) {
  const [uploadTime, setUploadTime] = useState("Upload Time");
  let displayName = videoPath.substring(0, videoPath.length - 4);
  displayName = displayName.substring(10, displayName.length);

  useEffect(() => {
    getUploadTime();
    console.log("Path thumbnail home: " + videoPath);
  }, []);

  async function getUploadTime() {
    let videoName = videoPath.substring(10, videoPath.length);
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

  return (
    <div>
      <Link to="/videoPage" state={{ videoPath, uploadTime }}>
        <img
          className="home-page-thumbnail"
          src={`http://localhost:3001/uploads/thumbnails/${videoPath}`}
          alt="Image"
        />
      </Link>
      <p className="videoTitle">{displayName}</p>
      <p>{uploadTime}</p>
    </div>
  );
}
