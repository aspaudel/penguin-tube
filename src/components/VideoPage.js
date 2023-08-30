import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TopLevelComponent from "./TopLevelComponent";
import likeIcon from "../assets/icons/like_icon.svg";
import dislikeIcon from "../assets/icons/dislike_icon.svg";

export default function VideoPage(props) {
  const navigate = useNavigate();
  const { videoPath, uploadTime, displayName } = useLocation().state;
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

  const logout = async (req, res) => {
    await axios
      .get("/logout", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/");
        }
      });
  };

  return (
    <div>
      <TopLevelComponent
        shouldDisplayLoadVideos={false}
        shouldDisplayLoginButton={false}
        logout={logout}
      />
      <div className="video-player-holder">
        <video className="video-player" controls>
          <source
            src={`https://penguin-tube-api.onrender.com/videoPage/${videoName}`}
            type="video/mp4"
          />
          Your browser does not support the video tag
        </video>
        <div className="video-info">
          <div>
            <p className="videoTitle">{displayName}</p>
            <p className="videoTime">{uploadTime}</p>
          </div>
          <div className="likes-holder">
            <p>{likes}</p>
            {isLiked && (
              <button
                className="like-dislike-button"
                disabled={isDisabled}
                onClick={dislikeVideo}
              >
                <img src={dislikeIcon}></img>
                Dislike
              </button>
            )}

            {!isLiked && (
              <button
                disabled={isDisabled}
                onClick={likeVideo}
                class="like-dislike-button"
              >
                <img src={likeIcon}></img>
                Like
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
