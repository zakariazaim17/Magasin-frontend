import React, { useContext } from "react";
import { NavLink, useHistory, Redirect } from "react-router-dom";
import "./MainNAvigation.css";
import AuthContext from "../context/AuthContext.js";

const MainNavigation = (props) => {
  const logout = async () => {
    try {
      localStorage.removeItem("ClientToken");
      window.location.reload();
      // history.push("/welcome");
    } catch (e) {
      console.log(e.message);
    }

    // localStorage.removeItem("currentClient");
  };
  const ClientToken = localStorage.getItem("ClientToken");
  return (
    <header className="main-navigation">
      <div className="main-navigation_logo">
        <h1>the navbar</h1>
      </div>
      <nav className="main-navigation_item">
        {ClientToken && (
          <ul>
            <li>
              <NavLink to="/myproducts">MyProducts</NavLink>
            </li>

            <li>
              <NavLink to="/bidings">Bidings</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile </NavLink>
            </li>
            <li>
              <NavLink onClick={logout} to="/welcome">
                logout
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNavigation;
