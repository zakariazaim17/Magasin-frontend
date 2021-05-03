import React, { useEffect, useState } from "react";
import "../css/Categories.css";
import { NavLink } from "react-router-dom";

//const ServerUrl = "http://localhost:3004/graphql";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
const Categories = () => {
  const [CAtegoryDAta, setCAtegoryDAte] = useState([]);
  useEffect(() => {
    GetallCategories();
  }, []);
  const GetallCategories = async () => {
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
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
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
    <div className="mainWrapercat">
      <div className="main-data-Container">
        {CAtegoryDAta.length !== 0 &&
          CAtegoryDAta.map((obj) => {
            return (
              <NavLink
                key={obj.Name}
                className="SingleCategory"
                to={`/categories/${obj.Name}`}
              >
                <p className="paragraph">{obj.Name}</p>
                <img
                  className="Categoryimg"
                  src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Images}`}
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
