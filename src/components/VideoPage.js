import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function VideoPage() {
  const { videoPath, uploadTime } = useLocation().state;
  const [likes, setVideoLikes] = useState("9999");
  const [isLiked, setLiked] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  let videoName = videoPath.substring(10, videoPath.length);
  videoName = videoName.substring(0, videoName.length - 3) + "mp4";

  useEffect(() => {
    getVideoLikes();
    getLikeState();
  }, []);

  async function getVideoLikes() {
    await axios
      .post(
        "https://penguin-tube.000webhostapp.com/getVideoLikes.php",
        videoName
      )
      .then((response) => {
        console.log(response);
        if (response.data.response_code === 200) {
          setVideoLikes(response.data.videoLikes);
        } else {
          console.log("getVideoLikes Response code not 200");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function likeVideo() {
    setDisabled(true);
    await axios
      .post(
        "/updateVideoLikes",
        { videoName, value: 1 },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("Number 1");
          setLiked(true);
          getVideoLikes();
        } else {
          console.log("Response code not 200");
        }
      })
      .catch((err) => {
        console.log(err.response.status);
      });
    setDisabled(false);
  }

  async function dislikeVideo() {
    setDisabled(true);
    await axios
      .post(
        "/updateVideoLikes",
        { videoName, value: -1 },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("Number 2");
          setLiked(false);
          getVideoLikes();
        } else {
          console.log("Response code not 200");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setDisabled(false);
  }

  async function getLikeState() {
    setDisabled(true);
    await axios
      .post(
        "/getLikeState",
        { videoName },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setLiked(response.data === "true");
        setDisabled(false);
      })
      .catch((err) => {
        console.log("getLikeState error: " + err);
      });
  }

  return (
    <div className="video-player-holder">
      <video className="video-player" width="320" height="240" controls>
        <source
          src={`https://penguin-tube-api.onrender.com/videoPage/${videoName}`}
          type="video/mp4"
        />
        Your browser does not support the video tag
      </video>
      <div className="video-info">
        <p>{uploadTime}</p>
        <div className="likes-holder">
          <p>{likes}</p>
          {isLiked && (
            <button disabled={isDisabled} onClick={dislikeVideo}>
              Dislike
            </button>
          )}

          {!isLiked && (
            <button disabled={isDisabled} onClick={likeVideo}>
              Like
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
