import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNAvigation.css";
import {
  FcAdvertising,
  FcManager,
  FcPackage,
  FcRight,
  FcRating,
} from "react-icons/fc";

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
              <FcRating />
              <NavLink to="/favourites">Favourites</NavLink>
            </li>
            <li>
              <NavLink to="/myproducts">
                <FcPackage />
                MyProducts
              </NavLink>
            </li>

            <li>
              <NavLink to="/bidings">
                <FcAdvertising className="icons" /> Bidings
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile">
                <FcManager />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink onClick={logout} to="/welcome">
                logout
                <FcRight className="uio" />
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNavigation;
