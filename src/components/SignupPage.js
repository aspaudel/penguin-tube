import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
    console.log(e.target.username.value);
    console.log(e.target.password.value);
    await axios
      .post("http://localhost:3001/signup", signupForm)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          navigate("/loginPage");
        }
      });
  }

  return (
    <form onSubmit={handleSignup}>
      <h1>Signup</h1>
      <label>
        Username:
        <input
          value={signupForm.userName}
          onChange={updateSignupForm}
          name="username"
          type="text"
          required
        />
      </label>
      <br></br>
      <label>
        Password:{" "}
        <input
          value={signupForm.password}
          onChange={updateSignupForm}
          name="password"
          type="password"
          required
        />
      </label>
      <br></br>
      <br></br>
      <button>Signup</button>
      <br></br>
      <br></br>
      <Link to="/loginPage">Login</Link>
    </form>
  );
}
