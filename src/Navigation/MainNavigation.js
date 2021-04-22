import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNAvigation.css";
import AuthContext from "../context/AuthContext.js";

const MainNavigation = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation_logo">
              <h1>the navbar</h1>
            </div>
            <nav className="main-navigation_item">
              {context.token && (
                <ul>
                  <li>
                    <NavLink to="/myproducts">MyProducts</NavLink>
                  </li>

                  <li>
                    <NavLink to="/bidings">Bidings</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                </ul>
              )}
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigation;
