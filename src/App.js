//import logo from "./logo.svg";
import Auth from "./pages/Auth.js";
import Bidings from "./pages/Bidings.js";
import Profile from "./pages/Profile.js";
import MyProducts from "./pages/MyProducts";
import Categories from "./pages/Categories.js";
import "./css/App.css";
import MainNavigation from "./Navigation/MainNavigation.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
  Redirect,
} from "react-router-dom";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/categories" component={Categories} />
            <Route path="/auth" component={Auth} />
            <Route path="/myproducts" component={MyProducts} />
            <Route path="/bidings" component={Bidings} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
