import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

export default function UploadVideoPage() {
  const [FileName, setFileName] = useState("No File Selected");
  const [thumbnail, setThumbnail] = useState("");

  return (
    <div>
      <h1>Upload Video Page</h1>
      <Dropzone
        onDrop={(acceptedFiles) => {
          let formData = new FormData();
          const config = {
            withCredentials: true,
            header: { "content-type": "multipart/form-data" },
          };
          formData.append("file", acceptedFiles[0]);
          axios
            .post("http://localhost:3001/uploadVideo", formData, config)
            .then((response) => {
              if (response.data.success) {
                let variable = {
                  filePath: response.data.filePath,
                  fileName: response.data.fileName,
                };

                setFileName(response.data.fileName);

                console.log(variable);
                //generate thumbnail with this filepath
                axios
                  .post("http://localhost:3001/thumbnail", variable, {
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
              <p className="file-dropper">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      <p>{FileName}</p>
      {thumbnail !== "" && (
        <div>
          <img
            key={thumbnail}
            src={`http://localhost:3001/${thumbnail}`}
            alt="Image"
          />
        </div>
      )}
    </div>
  );
}
