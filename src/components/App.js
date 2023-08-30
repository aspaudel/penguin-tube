import UploadVideoPage from "./UploadVideoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoPage from "./VideoPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ProfilePage from "./ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uploadVideo" element={<UploadVideoPage />} />
        <Route path="/videoPage" element={<VideoPage />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/signupPage" element={<SignupPage />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route path="*" element={<div>404 Page Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
