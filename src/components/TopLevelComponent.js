import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import penguinLogo from "../assets/icons/Logo.png";
import signIn from "../assets/icons/login_user_avatar_person_users_icon.png";

export default function TopLevelComponent(props) {
  const navigate = useNavigate();
  const [shouldDisplayLoadVideos, setShouldDisplayLoadVideos] = useState(true);
  const [shouldDisplayLoginButton, setShouldDisplayLoginButton] =
    useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (props.shouldDisplayLoadVideos === false) {
      setShouldDisplayLoadVideos(false);
    }
    if (props.shouldDisplayLoginButton === false) {
      setShouldDisplayLoginButton(false);
    }
    async function getLoggedInStatus() {
      await axios
        .get("/checkAuth", {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          }
        });
    }
    getLoggedInStatus();
  }, []);

  return (
    <div className="top-level-component">
      <img
        className="penguin-logo"
        src={penguinLogo}
        onClick={() => {
          navigate("/");
        }}
      ></img>
      {shouldDisplayLoadVideos && (
        <button className="load-videos-button" onClick={props.loadVids}>
          Load Videos
        </button>
      )}
      {shouldDisplayLoginButton && (
        <div className="signin-group" onClick={props.getUserProfile}>
          <img className="signin-icon" src={signIn}></img>
          {!isLoggedIn && <p className="signin-text">Sign in</p>}
        </div>
      )}
      {!shouldDisplayLoginButton && (
        <div className="signin-group" onClick={props.logout}>
          <img className="signin-icon" src={signIn}></img>
          {isLoggedIn && <p className="singin-text">Sign out</p>}
        </div>
      )}
    </div>
  );
}
