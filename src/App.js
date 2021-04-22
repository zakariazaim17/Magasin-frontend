//import logo from "./logo.svg";
import Auth from "./pages/Auth.js";
import Bidings from "./pages/Bidings.js";
import Profile from "./pages/Profile.js";
import MyProducts from "./pages/MyProducts";
import Categories from "./pages/Categories.js";
import "./css/App.css";
import MainNavigation from "./Navigation/MainNavigation.js";
import Authcontext from "./context/AuthContext.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
  Redirect,
} from "react-router-dom";
import React, { useState } from "react";
function App() {
  const [Clientdata, setClientdata] = useState({
    token: null,
    id: null,
  });

  const login = (token, id) => {
    setClientdata({ token: token, id: id });
  };

  const logout = () => {
    setClientdata({ token: null, id: null });
  };

  //const ServerURL = "http://localhost:3004/graphql";
  return (
    <BrowserRouter>
      <React.Fragment>
        <Authcontext.Provider
          value={{
            token: Clientdata.token,
            id: Clientdata.id,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!Clientdata.token && <Redirect from="/" to="/auth" exact />}
              {Clientdata.token && <Redirect from="/" to="/categories" exact />}
              {Clientdata.token && (
                <Redirect from="/auth" to="/categories" exact />
              )}
              <Route path="/auth" component={Auth} />
              {Clientdata.token && (
                <Route path="/categories" component={Categories} />
              )}
              {Clientdata.token && (
                <Route path="/myproducts" component={MyProducts} />
              )}
              {Clientdata.token && (
                <Route path="/bidings" component={Bidings} />
              )}
              {Clientdata.token && (
                <Route path="/profile" component={Profile} />
              )}
            </Switch>
          </main>
        </Authcontext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
