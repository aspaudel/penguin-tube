import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Thumbnail({ videoPath }) {
  const [uploadTime, setUploadTime] = useState("Upload Time");
  let displayName = videoPath.substring(0, videoPath.length - 4);
  displayName = displayName.substring(10, displayName.length);
  displayName = nameFormatter(displayName);
  displayName = nameFormatter(displayName);

  useEffect(() => {
    getUploadTime();
    console.log("Path thumbnail home: " + videoPath);
  }, []);

  function timeAgo(timestamp) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - timestamp;

    // Define time intervals in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (elapsedTime < minute) {
      return "Just now";
    } else if (elapsedTime < hour) {
      const minutes = Math.floor(elapsedTime / minute);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsedTime < day) {
      const hours = Math.floor(elapsedTime / hour);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (elapsedTime < month) {
      const days = Math.floor(elapsedTime / day);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (elapsedTime < year) {
      const months = Math.floor(elapsedTime / month);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(elapsedTime / year);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  }

  function nameFormatter(name) {
    for (let i = 0; i < name.length; i++) {
      if (name[i] === "-") {
        return name.substring(i + 1, name.length);
      }
    }
    return name;
  }

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
          setUploadTime(timeAgo(response.data.upload_time));
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
          src={`https://penguin-tube-api.onrender.com/uploads/thumbnails/${videoPath}`}
          alt="Image"
        />
      </Link>
      <p className="videoTitle">{displayName}</p>
      <p>{uploadTime}</p>
    </div>
  );
}
