import React, { useState } from "react";
import axios from "axios";
import ThumbnailHome from "./ThumbnailHome";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [videoPaths, setVideoPaths] = useState([]);

  const navigate = useNavigate();

  async function loadVids() {
    const paths = await axios.get("https://penguin-tube-api.onrender.com/");
    setVideoPaths(paths.data.paths);
  }

  async function getUserProfile() {
    await axios
      .get("https://penguin-tube-api.onrender.com/checkAuth", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("here");
        console.log(response);
        if (response.status === 200) {
          navigate("/profilePage");
        }
      })
      .catch((err) => {
        console.log("eta");
        console.log(err);
        if (err.response.status === 401) {
          navigate("/loginPage");
        }
      });
  }

  return (
    <div>
      <h1>Server Videos</h1>
      <button onClick={getUserProfile}>Profile</button>
      <br></br>
      <button onClick={loadVids}>Load Videos</button>
      {videoPaths.length !== 0 &&
        videoPaths.map((videoPath) => {
          return <ThumbnailHome key={videoPath} videoPath={videoPath} />;
        })}
    </div>
  );
}
