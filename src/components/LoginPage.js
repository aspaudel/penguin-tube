import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/icons/Logo.png";

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  async function isLoggedIn() {
    await axios
      .get("/checkAuth", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
      });
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  const navigate = useNavigate();

  function updateLoginForm(e) {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    await axios
      .post("/login", loginForm, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/");
        }
      });
  }
  return (
    <form className="signin-form" onSubmit={handleLogin}>
      <div className="signin-form-components">
        <div className="form-header">
          <img className="penguin-logo" src={logo}></img>
          <h1>Sign in</h1>
          <p>to continue to PenguinTube</p>
        </div>
        <div className="input-fields">
          <div className="input-contain">
            <input
              onChange={updateLoginForm}
              value={loginForm.username}
              name="username"
              type="text"
            />
            <label className="placeholder-text">
              <div className="text">Username</div>
            </label>
          </div>

          <br></br>

          <div className="input-contain">
            <input
              onChange={updateLoginForm}
              value={loginForm.password}
              name="password"
              type="password"
            />
            <label className="placeholder-text">
              <div className="text">Password</div>
            </label>
          </div>
        </div>
        <br></br>
        <div className="login-signup-bundle">
          <Link to="/SignupPage">Create account</Link>
          <button>Sign in</button>
        </div>
      </div>
    </form>
  );
}
