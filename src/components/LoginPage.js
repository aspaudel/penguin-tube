import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  async function isLoggedIn() {
    await axios
      .get("http://localhost:3001/checkAuth", { withCredentials: true })
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
    console.log(e.target.username.value);
    console.log(e.target.password.value);
    await axios
      .post("http://localhost:3001/login", loginForm, { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/profilePage");
        }
      });
  }
  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <label>
        Username:
        <input
          onChange={updateLoginForm}
          value={loginForm.username}
          name="username"
          type="text"
        />
      </label>
      <br></br>
      <label>
        Password:
        <input
          onChange={updateLoginForm}
          value={loginForm.password}
          name="password"
          type="password"
        />
      </label>
      <br></br>
      <br></br>
      <button>Login</button>
      <br></br>
      <br></br>
      <Link to="/SignupPage">Signup</Link>
    </form>
  );
}
