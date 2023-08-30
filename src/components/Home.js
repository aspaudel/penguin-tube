import React, { useCallback, useState, useRef } from "react";
import axios from "axios";
import ThumbnailHome from "./ThumbnailHome";
import { useNavigate } from "react-router-dom";
import TopLevelComponent from "./TopLevelComponent";

export default function Home() {
  const [videoNumber, setVideoNumber] = useState(0);
  const [videoPaths, setVideoPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef();
  const lastThumbnailElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadVids();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  const navigate = useNavigate();

  async function loadVids() {
    setIsLoading(true);
    const paths = await axios.post("/", { videoNumber });
    setVideoPaths((prevVideoPaths) => [
      ...prevVideoPaths,
      ...paths.data.pagedPaths,
    ]);
    // The backend provides hasMore based on whether the videoNumber < thumbnailPaths's index
    setHasMore(paths.data.hasMore);
    // The backend always sends back false for this one.
    setIsLoading(paths.data.loading);
    // The backend sends the index for the next video in this.
    setVideoNumber(paths.data.videoNumber);
    console.log(paths.data.videoNumber);
  }

  async function getUserProfile() {
    await axios
      .get("/checkAuth", {
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
      <TopLevelComponent getUserProfile={getUserProfile} loadVids={loadVids} />
      <div className="thumbnail-flex-container">
        {videoPaths.length !== 0 &&
          videoPaths.map((videoPath, index) => {
            if (videoPaths.length === index + 1) {
              return (
                <div ref={lastThumbnailElementRef} key={videoPath}>
                  <ThumbnailHome videoPath={videoPath} />
                </div>
              );
            } else {
              return (
                <div>
                  <ThumbnailHome key={videoPath} videoPath={videoPath} />
                </div>
              );
            }
          })}
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
