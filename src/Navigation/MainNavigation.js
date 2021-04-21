import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNAvigation.css";

const MainNavigation = (props) => {
  return (
    <header className="main-navigation">
      <div className="main-navigation_logo">
        <h1>the navbar</h1>
      </div>
      <nav className="main-navigation_item">
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
      </nav>
    </header>
  );
};

export default MainNavigation;
