import React, { useState, useRef } from "react";
import Alert from "@material-ui/lab/Alert";
import "../css/Auth.css";

const Auth = () => {
  const [registerdata, setregisterdata] = useState({
    email: null,
    password: null,
    username: null,
  });

  const emaildata = useRef();
  const passworddata = useRef();
  const usernamedata = useRef();

  const RegisterationHandler = (event) => {
    event.preventDefault();
    const email = emaildata.current.value;
    const password = passworddata.current.value;
    const username = usernamedata.current.value;

    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      username.trim().length === 0
    ) {
      return (
        <Alert variant="outlined" severity="warning">
          This is a warning alert — check it out!
        </Alert>
      );
    }
  };
  return (
    <form className="auth-form" onSubmit={RegisterationHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emaildata} />
      </div>
      <div className="form-control">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" ref={usernamedata} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passworddata} />
      </div>
      <div className="form-actions">
        <button type="submit">Switch to Login</button>
        <button type="submit">Register</button>
      </div>
    </form>
  );
};

export default Auth;
