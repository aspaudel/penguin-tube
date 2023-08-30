import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import axios from "axios";
import TopLevelComponent from "./TopLevelComponent";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [videoPaths, setVideoPaths] = useState([]);
  const [masterDelete, setMasterDelete] = useState(false);

  async function checkAuth() {
    await axios
      .get("/checkAuth", {
        withCredentials: true,
      })
      .then(async (response) => {
        console.log(response.status);
        if (response.status === 200) {
          await axios
            .get("/userProfile", {
              withCredentials: true,
            })
            .then((response) => {
              console.log(response);
              if (response.status === 200) {
                setVideoPaths(response.data.paths);
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          navigate("/loginPage");
        }
      });
  }

  async function deleteAccount() {
    console.log("Account Deletion Initiated...");

    await axios
      .get("/masterDeletionAccount", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        navigate("/");
      });
  }

  useEffect(() => {
    checkAuth();
  }, []);

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
      <div className="thumbnail-flex-container">
        {videoPaths.length !== 0 &&
          videoPaths.map((videoPath) => {
            return (
              <div key={videoPath}>
                <Thumbnail videoPath={videoPath} />
              </div>
            );
          })}
        <Link className="uploadVideo" to="/uploadVideo">
          <div>
            <p className="add-video-sign">+</p>
          </div>
        </Link>
      </div>

      {!masterDelete && (
        <button
          className="account-master-deletion"
          onClick={() => {
            setMasterDelete(true);
          }}
        >
          Delete Account
        </button>
      )}
      {masterDelete && (
        <div>
          <button onClick={deleteAccount}>Delete account permanently</button>
          <button
            onClick={() => {
              setMasterDelete(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
