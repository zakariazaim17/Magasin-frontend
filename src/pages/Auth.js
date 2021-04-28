import React, { useState, useRef } from "react";
import Authcontext from "../context/AuthContext.js";
import Alert from "@material-ui/lab/Alert";
import "../css/Auth.css";
import { Player } from "@lottiefiles/react-lottie-player";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "http://localhost:3004/graphql";
const Auth = () => {
  const context = React.useContext(Authcontext);
  const [authStatus, setauthStatus] = useState("login");

  const passworddatalogin = useRef();
  const usernamedatalogin = useRef();

  const emaildataregister = useRef();
  const passworddataregister = useRef();
  const usernamedataregister = useRef();

  //Login function
  const LoginHandler = async (event) => {
    event.preventDefault();
    const username = usernamedatalogin.current.value;
    const password = passworddatalogin.current.value;

    const requestbody = {
      query: `
        query{
            login(
                username:"${username}",
                 password:"${password}"
                 )
        {
           id
            username
             token
              Verified
            }
        }`,
    };
    try {
      const loggedUser = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (loggedUser.status !== 200 && loggedUser.status !== 201) {
        throw new Error("Failed");
      }
      const resultUser = await loggedUser.json();
      console.log(resultUser.data.login);

      if (resultUser.data.login.token) {
        localStorage.setItem("ClientToken", resultUser.data.login.token);
        localStorage.setItem("CurentcliEnt", resultUser.data.login.id);
        context.login(resultUser.data.login.token, resultUser.data.login.id);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  //Register Function
  const RegisterationHandler = async (event) => {
    event.preventDefault();
    const email = emaildataregister.current.value;
    const password = passworddataregister.current.value;
    const username = usernamedataregister.current.value;

    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      username.trim().length === 0
    ) {
      return (
        <Alert severity="warning">
          This is a warning alert — check it out!
        </Alert>
      );
    }

    const requestbody = {
      query: `
        mutation{
            AddClient(
                username:"${username}",
                 password:"${password}",
                  Email:"${email}"
                  )
        {
         id
         username
        }
        }`,
    };

    try {
      const addeduser = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (addeduser.status !== 200 && addeduser.status !== 201) {
        throw new Error("Failed");
      }
      const resultUser = await addeduser.json();
      console.log(resultUser.data.AddClient);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="parent-wrapper">
      {authStatus === "login" && (
        <div className="child-wrapper">
          <form className="auth-form" onSubmit={LoginHandler}>
            <h3>Login</h3>
            <Player
              className="lottiefile"
              autoplay
              loop
              src="https://assets2.lottiefiles.com/packages/lf20_ope20lbo.json"
              style={{ height: "210px", width: "210px" }}
            />
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" ref={usernamedatalogin} />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={passworddatalogin} />
            </div>
            <div className="form-actions">
              <button type="submit" className="loginbtn">
                Login
              </button>
              <button
                onClick={() => setauthStatus("register")}
                className="registerbtn"
              >
                Switch to Register
              </button>
            </div>
          </form>
        </div>
      )}
      {authStatus === "register" && (
        <div>
          <h3>Register</h3>
          <form className="auth-form" onSubmit={RegisterationHandler}>
            <div className="form-control">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" ref={emaildataregister} />
            </div>

            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" ref={usernamedataregister} />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={passworddataregister} />
            </div>
            <div className="form-actions">
              <button type="submit">Register</button>
              <button onClick={() => setauthStatus("login")}>
                Switch to Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;
