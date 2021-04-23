import React, { useEffect, useState } from "react";
import "../css/Categories.css";
import { Link, NavLink } from "react-router-dom";
//import Authcontext from "../context/AuthContext.js";
const ServerUrl = "http://localhost:3004/graphql";

const Categories = () => {
  //const context = React.useContext(Authcontext);
  const [CAtegoryDAta, setCAtegoryDAte] = useState([]);
  useEffect(() => {
    GetallCategories();
  }, []);
  const GetallCategories = async () => {
    //console.log("wwww", context.token);
    const requestbody = {
      query: `
            query{
                GetCategories{
                    Name
                     TotalItems
                      Images
                    }
                }`,
    };

    try {
      const Categories = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (Categories.status !== 200 && Categories.status !== 201) {
        throw new Error("Failed");
      }
      const CategoriesREsults = await Categories.json();
      setCAtegoryDAte(CategoriesREsults.data.GetCategories);
      console.log(CategoriesREsults.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="mainWraper">
      <p> All Categories</p>
      <div className="main-data-Container">
        {CAtegoryDAta.length !== 0 &&
          CAtegoryDAta.map((obj) => {
            return (
              <NavLink
                key={obj.Name}
                className="SingleCategory"
                to={`/categories/${obj.Name}`}
              >
                <p>{obj.Name}</p>
                <img
                  className="Categoryimg"
                  src={`http://localhost:3004/${obj.Images}`}
                  alt="hello"
                />
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};

export default Categories;
