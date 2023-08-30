import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/icons/Logo.png";

export default function SignupPage() {
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  function updateSignupForm(e) {
    const { name, value } = e.target;
    setSignupForm({
      ...signupForm,
      [name]: value,
    });
  }

  async function handleSignup(e) {
    e.preventDefault();

    await axios.post("/signup", signupForm).then((response) => {
      console.log(response);
      if (response.status === 200) {
        navigate("/loginPage");
      }
    });
  }

  return (
    <form class="signin-form" onSubmit={handleSignup}>
      <div class="signin-form-components">
        <div class="form-header">
          <img class="penguin-logo" src={logo}></img>
          <h1>Create a Penguin Account</h1>
        </div>
        <div class="input-fields">
          <div class="input-contain">
            <input
              onChange={updateSignupForm}
              value={signupForm.username}
              name="username"
              type="text"
            />
            <label class="placeholder-text">
              <div class="text">Username</div>
            </label>
          </div>

          <br></br>

          <div class="input-contain">
            <input
              onChange={updateSignupForm}
              value={signupForm.password}
              name="password"
              type="password"
            />
            <label class="placeholder-text">
              <div class="text">Password</div>
            </label>
          </div>
        </div>
        <br></br>
        <div class="login-signup-bundle">
          <Link to="/loginPage">Already registered?</Link>
          <button>Sign up</button>
        </div>
      </div>
    </form>
  );
}
