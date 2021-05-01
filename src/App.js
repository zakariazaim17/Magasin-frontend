//import logo from "./logo.svg";
import Auth from "./pages/Auth.js";
import Bidings from "./pages/Bidings.js";
import Profile from "./pages/Profile.js";
import MyProducts from "./pages/MyProducts";
import Categories from "./pages/Categories.js";
import "./css/App.css";
import GeneralProducts from "./pages/GeneralProducts.js";
import MainNavigation from "./Navigation/MainNavigation.js";
import Authcontext from "./context/AuthContext.js";
import favourites from "./pages/Favourites.js";

import specificProduct from "./pages/SpecificProduct.js";
import BidingsRooms from "./pages/BidingsRooms.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import React, { useState } from "react";

function App() {
  const ClientToken = localStorage.getItem("ClientToken");
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

  return (
    <Router>
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
              {!ClientToken && <Redirect from="/categories" to="/auth" />}
              {!ClientToken && <Redirect from="/myproducts" to="/auth" />}
              {!ClientToken && <Redirect from="/profile" to="/auth" />}
              {!ClientToken && <Redirect from="/bidings" to="/auth" />}
              {!ClientToken && <Redirect from="/" to="/auth" exact />}

              {ClientToken && <Redirect from="/" to="/categories" exact />}

              {ClientToken && <Redirect from="/auth" to="/categories" exact />}
              <Route path="/auth" component={Auth} />
              {ClientToken && (
                <Route path="/categories" component={Categories} exact />
              )}
              {ClientToken && (
                <Route path="/myproducts" component={MyProducts} />
              )}
              {ClientToken && (
                <Route
                  path="/categories/:id"
                  component={GeneralProducts}
                  exact
                />
              )}
              {ClientToken && (
                <Route path="/bidings/:id" component={BidingsRooms} exact />
              )}
              <Route path="/auth" component={Auth} />
              {ClientToken && <Route path="/bidings" component={Bidings} />}
              {ClientToken && <Route path="/profile" component={Profile} />}

              {ClientToken && (
                <Route
                  path="/categories/:name/:id"
                  component={specificProduct}
                  exact
                />
              )}
              {ClientToken && (
                <Route path="/favourites" component={favourites} exact />
              )}
            </Switch>
          </main>
        </Authcontext.Provider>
      </React.Fragment>
    </Router>
  );
}

export default App;

/*
render={(props) => {
                  <KK id={props.match.params.id} />;
                }} 
                */
