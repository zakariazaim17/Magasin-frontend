import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNAvigation.css";

import logo from "../lotties/logo.png";

const MainNavigation = (props) => {
  const logout = async () => {
    try {
      localStorage.removeItem("ClientToken");
      localStorage.removeItem("CurentcliEnt");
      window.location.reload();
    } catch (e) {
      console.log(e.message);
    }
  };
  const ClientToken = localStorage.getItem("ClientToken");
  return (
    <header className="main-navigation">
      <NavLink className="main-navigation_logo" to="/categories">
        <img src={logo} alt="logo" />
      </NavLink>
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
