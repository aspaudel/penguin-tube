import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import axios from "axios";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
  axios.defaults.baseURL = "https://penguin-tube-api.onrender.com";
} else {
  axios.defaults.baseURL = "http://localhost:3001";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
