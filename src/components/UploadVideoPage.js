import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropzone from "react-dropzone";
import TopLevelComponent from "./TopLevelComponent";
import uploadIcon from "../assets/icons/cloud_upload_icon.png";

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const [FileName, setFileName] = useState("No File Selected");
  const [thumbnail, setThumbnail] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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
      <div className="upload-video-form">
        <h1>Upload a Video here</h1>
        <Dropzone
          onDrop={(acceptedFiles) => {
            let formData = new FormData();
            const config = {
              withCredentials: true,
              header: { "content-type": "multipart/form-data" },
              onUploadProgress: (progressEvent) => {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentage);
              },
            };
            formData.append("file", acceptedFiles[0]);
            axios.post("/uploadVideo", formData, config).then((response) => {
              setUploadProgress(0);
              if (response.data.success) {
                let variable = {
                  filePath: response.data.filePath,
                  fileName: response.data.fileName,
                };

                setFileName(response.data.fileName);

                console.log(variable);
                //generate thumbnail with this filepath
                axios
                  .post("/thumbnail", variable, {
                    withCredentials: true,
                  })
                  .then((response) => {
                    if (response.data.success) {
                      setThumbnail(response.data.thumbsFilePath);
                    } else {
                      alert("Failed to make the thumbnails");
                    }
                  });
              } else {
                alert("Failed to save the video in the server");
              }
            });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <img className="file-dropper" src={uploadIcon}></img>
              </div>
            </section>
          )}
        </Dropzone>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <p>{FileName}</p>
        {thumbnail !== "" && (
          <div>
            <img
              key={thumbnail}
              src={`https://penguin-tube-api.onrender.com/${thumbnail}`}
              alt="Image"
            />
          </div>
        )}
      </div>
    </div>
  );
}
